// /api/progress
//   GET  -> current user's saved data { progress, growth }
//   POST -> upsert the full data object for the current user
//
// The user is always re-derived from the session cookie (Rules.md) — the
// request body never carries a user id. Data is a single jsonb blob per user
// in the shape { progress: {"<id>": true}, growth: {"YYYY-MM-DD": count} }.

import { NextResponse } from 'next/server';
import { ensureSchema, query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const EMPTY = { progress: {}, growth: {} };

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    await ensureSchema();

    const { rows } = await query('SELECT data FROM progress WHERE user_id = $1', [
      user.id,
    ]);
    const data = rows[0]?.data || EMPTY;
    return NextResponse.json({
      progress: data.progress || {},
      growth: data.growth || {},
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not load progress.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    // Normalize to the expected shape so we never persist junk.
    const data = {
      progress:
        body && typeof body.progress === 'object' && body.progress ? body.progress : {},
      growth:
        body && typeof body.growth === 'object' && body.growth ? body.growth : {},
    };

    await ensureSchema();

    await query(
      `INSERT INTO progress (user_id, data, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (user_id)
       DO UPDATE SET data = $2::jsonb, updated_at = now()`,
      [user.id, JSON.stringify(data)]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not save progress.' },
      { status: 500 }
    );
  }
}
