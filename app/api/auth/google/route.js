// GET /api/auth/google
// Kicks off the OAuth flow: redirect the browser to Google's consent screen.
// A random state value is round-tripped via an httpOnly cookie and checked
// in the callback to guard against CSRF.

import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Google sign-in is not configured on this server.' },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = new URL('/api/auth/google/callback', request.url).toString();

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  const res = NextResponse.redirect(authUrl.toString());
  res.cookies.set('ledger_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600, // 10 minutes — only needs to survive the round trip to Google
  });
  return res;
}
