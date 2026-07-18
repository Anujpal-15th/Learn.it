// GET /api/auth/me
// Returns the current user derived from the session cookie, or 401 if there is
// no valid session. Every authenticated page calls this on mount.

import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  return NextResponse.json({ user });
}
