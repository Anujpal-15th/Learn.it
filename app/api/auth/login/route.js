// POST /api/auth/login
// Look up by email -> bcrypt.compare -> sign JWT -> set cookie -> return user.
// Auth errors are honest (Rules.md): we distinguish "no account" from
// "incorrect password" — this is a personal-scale app, not a bank.

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ensureSchema, query } from '@/lib/db';
import { signToken, COOKIE_NAME, sessionCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Enter both your email and password.' },
        { status: 400 }
      );
    }

    await ensureSchema();

    const found = await query(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email]
    );
    if (found.rowCount === 0) {
      return NextResponse.json(
        { error: 'No account found with that email.' },
        { status: 401 }
      );
    }

    const row = found.rows[0];

    // Account created via Google only — no password set.
    if (!row.password_hash) {
      return NextResponse.json(
        { error: 'This account uses Google sign-in. Continue with Google.' },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const user = { id: row.id, email: row.email, name: row.name };
    const token = signToken(user);
    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not log in.' },
      { status: 500 }
    );
  }
}
