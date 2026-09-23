// POST /api/auth/signup
// Validate input -> hash password -> insert user -> insert empty progress row
// -> sign JWT -> set httpOnly cookie -> return user object (never the hash).

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ensureSchema, query } from '@/lib/db';
import { signToken, COOKIE_NAME, sessionCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
    // Default the name to the part before @ if not provided.
    const name = ((body.name || '').trim() || email.split('@')[0]).slice(0, 100);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    await ensureSchema();

    // Reject duplicates up front with a clear message.
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const inserted = await query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [email, name, passwordHash]
    );
    const user = inserted.rows[0];

    // Give every new user an empty progress row so later reads always find one.
    await query(
      `INSERT INTO progress (user_id, data)
       VALUES ($1, '{}'::jsonb)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    );

    const token = signToken(user);
    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error('[api/auth/signup]', err.message);
    return NextResponse.json({ error: 'Could not create account.' }, { status: 500 });
  }
}
