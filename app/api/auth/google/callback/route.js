// GET /api/auth/google/callback
// Exchanges the auth code for tokens, fetches the Google profile, upserts a
// user row by email (password_hash stays null for Google-only accounts —
// see login/route.js), then signs our own session cookie exactly like the
// password flow does. Google is only ever used to prove "this email is
// really you" once, up front.

import { NextResponse } from 'next/server';
import { ensureSchema, query } from '@/lib/db';
import { signToken, COOKIE_NAME, sessionCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function fail(request, message) {
  const url = new URL('/login', request.url);
  url.searchParams.set('error', message);
  return NextResponse.redirect(url);
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = request.cookies.get('ledger_oauth_state')?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return fail(request, 'Google sign-in failed (invalid state). Try again.');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return fail(request, 'Google sign-in is not configured on this server.');
  }

  try {
    const redirectUri = new URL('/api/auth/google/callback', request.url).toString();

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      return fail(request, 'Could not verify Google sign-in. Try again.');
    }
    const tokens = await tokenRes.json();

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!profileRes.ok) {
      return fail(request, 'Could not read your Google profile. Try again.');
    }
    const profile = await profileRes.json();

    if (!profile.email || !profile.email_verified) {
      return fail(request, 'Your Google account has no verified email.');
    }
    const email = profile.email.toLowerCase();
    const name = profile.name || email.split('@')[0];

    await ensureSchema();

    const existing = await query('SELECT id, email, name FROM users WHERE email = $1', [email]);
    let user;
    if (existing.rowCount > 0) {
      user = existing.rows[0];
    } else {
      const inserted = await query(
        'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name',
        [email, name]
      );
      user = inserted.rows[0];
    }

    const token = signToken(user);
    const res = NextResponse.redirect(new URL('/', request.url));
    res.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    res.cookies.delete('ledger_oauth_state');
    return res;
  } catch (err) {
    return fail(request, 'Google sign-in failed. Try again.');
  }
}
