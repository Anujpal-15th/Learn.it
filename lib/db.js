// lib/db.js — PostgreSQL connection pool + schema bootstrap.
//
// We use the `pg` package directly (no ORM). The data model is just two
// tables, so a single pool singleton plus an ensureSchema() helper is all we
// need. ensureSchema() is called at the top of every API route that touches
// the DB, so there is no separate migration step at this scale.

import { Pool } from 'pg';

// Reuse a single Pool across hot-reloads in dev and across warm serverless
// invocations in production. Without this, Next.js dev would open a new pool on
// every module reload and exhaust connections.
let pool = globalThis._ledgerPool;

if (!pool) {
  if (!process.env.DATABASE_URL) {
    // Surface a clear message instead of a cryptic connection error later.
    console.warn(
      '[db] DATABASE_URL is not set. Set it in .env.local (see .env.example).'
    );
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Managed Postgres providers (Neon, Vercel, Supabase) require SSL.
    // Local Postgres usually does not — toggle with PGSSL=disable if needed.
    //
    // KNOWN TRADE-OFF (flagged in Phase 2 security audit, not changed here):
    // rejectUnauthorized: false encrypts the connection but does not verify
    // the DB server's certificate, so it doesn't protect against a
    // man-in-the-middle on the DB connection path. Most managed providers
    // (Neon included) now use publicly-trusted certificates, so
    // `{ rejectUnauthorized: true }` should work — but that wasn't verified
    // against this app's actual production database from this environment,
    // and flipping it blindly risks breaking a live deployment's DB
    // connectivity outright. Verify against the real production
    // DATABASE_URL before changing this.
    ssl:
      process.env.PGSSL === 'disable'
        ? false
        : { rejectUnauthorized: false },
  });

  globalThis._ledgerPool = pool;
}

export { pool };

// Small convenience wrapper so routes can call query() without reaching into
// the pool directly.
export function query(text, params) {
  return pool.query(text, params);
}

// Tracks whether we've already created the tables this process, so we don't run
// the CREATE TABLE statements on every single request.
let schemaReady = globalThis._ledgerSchemaReady || false;

export async function ensureSchema() {
  if (schemaReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                    SERIAL PRIMARY KEY,
      email                 TEXT UNIQUE NOT NULL,
      name                  TEXT,
      password_hash         TEXT,
      failed_login_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until          TIMESTAMPTZ,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Additive migration for brute-force lockout (Phase 2 hardening) — safe
  // no-op on a fresh table, backfills existing deployed tables.
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER NOT NULL DEFAULT 0;
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS progress (
      user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data       JSONB NOT NULL DEFAULT '{}'::jsonb,
      version    INTEGER NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Additive migration for rows created before optimistic-locking existed —
  // ADD COLUMN IF NOT EXISTS is a no-op on a fresh table (already has the
  // column from CREATE TABLE above) and safely backfills existing deployed
  // tables with version=1 for every pre-existing row.
  await pool.query(`
    ALTER TABLE progress ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
  `);

  schemaReady = true;
  globalThis._ledgerSchemaReady = true;
}
