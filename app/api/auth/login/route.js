// POST /api/auth/login
// Look up by email -> bcrypt.compare -> sign JWT -> set cookie -> return user.
//
// Security hardening (Phase 2):
//  - One generic "Invalid email or password" message for both "no account"
//    and "wrong password" — the previous distinct messages let an attacker
//    enumerate which emails have accounts on this site.
//  - A dummy bcrypt.compare runs even when no account is found, so a
//    nonexistent email doesn't respond measurably faster than a real one
//    with a wrong password (closes the timing side-channel the message
//    change alone wouldn't).
//  - Failed attempts are tracked per-account in the database (not in-memory —
//    this runs on serverless, where in-memory state doesn't survive between
//    invocations or across instances) and lock the account out for a cooldown
//    window after too many failures, the same login-route brute-force
//    protection every mainstream auth system applies.

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ensureSchema, query } from '@/lib/db';
import { signToken, COOKIE_NAME, sessionCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const GENERIC_ERROR = 'Invalid email or password.';

// A real bcrypt hash of a string nobody will ever type — used to run a
// compare of the same cost when the account doesn't exist, so the response
// time doesn't reveal whether the email is registered.
const DUMMY_HASH = '$2a$10$C6UzMDM.H6dfI/f/IKcEeOQ0X6oO8QVFmzP6P6vJdDzYs8m6UO5Wa';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const email = (body.email || '').trim().toLowerCase().slice(0, 254);
    const password = (body.password || '').slice(0, 200);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Enter both your email and password.' },
        { status: 400 }
      );
    }

    await ensureSchema();

    const found = await query(
      'SELECT id, email, name, password_hash, failed_login_attempts, locked_until FROM users WHERE email = $1',
      [email]
    );

    if (found.rowCount === 0) {
      // No such account — still run a compare against a dummy hash so this
      // path takes roughly the same time as a real account with a wrong
      // password, then return the same generic error either way.
      await bcrypt.compare(password, DUMMY_HASH);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    const row = found.rows[0];

    if (row.locked_until && new Date(row.locked_until) > new Date()) {
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in a few minutes.` },
        { status: 429 }
      );
    }

    // Account created via Google only — no password set. Still compare
    // against the dummy hash for the same timing reason as above.
    if (!row.password_hash) {
      await bcrypt.compare(password, DUMMY_HASH);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      const attempts = row.failed_login_attempts + 1;
      const lockedUntil =
        attempts >= MAX_FAILED_ATTEMPTS
          ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
          : null;
      await query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [attempts, lockedUntil, row.id]
      );
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    // Successful login clears any prior failed-attempt history.
    await query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
      [row.id]
    );

    const user = { id: row.id, email: row.email, name: row.name };
    const token = signToken(user);
    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error('[api/auth/login]', err.message);
    return NextResponse.json({ error: 'Could not log in.' }, { status: 500 });
  }
}
