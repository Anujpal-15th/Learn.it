// lib/auth.js — session helpers: sign/verify JWTs and derive the current user
// from the httpOnly session cookie.
//
// Security baseline (Rules.md):
//  - session token lives in an httpOnly cookie, never in localStorage
//  - every mutating route re-derives the user from this cookie server-side,
//    never trusting a user id sent in the request body.

import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'ledger_session';

// 7 days, in seconds — used for both the JWT expiry and the cookie maxAge.
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET is not set. Add it to .env.local (see .env.example).'
    );
  }
  return secret;
}

// Sign a session token. We keep id/email/name in the payload so identity checks
// don't need a DB round-trip on every request.
export function signToken(user) {
  return jwt.sign(
    { uid: user.id, email: user.email, name: user.name },
    getSecret(),
    { expiresIn: SESSION_MAX_AGE }
  );
}

// Verify a token string. Returns the decoded payload, or null if invalid.
export function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

// Cookie options for the session cookie. Secure in production only, so it still
// works over http://localhost in dev.
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

// Read + verify the session cookie off an incoming request (NextRequest).
// Returns { id, email, name } or null. This is the single source of truth for
// "who is making this request."
export function getUserFromRequest(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = verifyToken(token);
  if (!payload) return null;
  return { id: payload.uid, email: payload.email, name: payload.name };
}
