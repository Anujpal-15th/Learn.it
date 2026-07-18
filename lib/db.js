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
      id            SERIAL PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      name          TEXT,
      password_hash TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS progress (
      user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data       JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  schemaReady = true;
  globalThis._ledgerSchemaReady = true;
}
