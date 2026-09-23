// /api/progress
//   GET  -> current user's saved data { progress, growth, meta, version }
//   POST -> optimistic-locked upsert: body must include `version` (the
//           version the client last read). Succeeds and returns the new
//           version, or responds 409 with the current server-side state if
//           someone else (another tab/device) saved in between.
//
// The user is always re-derived from the session cookie (Rules.md) — the
// request body never carries a user id. Data is a single jsonb blob per user
// in the shape { progress: {"<id>": true}, growth: {"YYYY-MM-DD": count},
// meta: { selectedCareer } }.
//
// Concurrency: two tabs/devices can both read the same version and then both
// try to save. Without a version check, whichever POST lands second would
// silently overwrite the first tab's change (a classic lost update) — the
// same key-value blob gets replaced wholesale, so anything the first write
// added that the second write's stale copy didn't know about is gone with no
// error. The UPDATE below is gated on `version = $3` so only the request that
// was actually based on the current row succeeds; the loser gets a 409 and
// the caller (useProgress.js) re-applies its specific change on top of the
// fresh state and retries, instead of the change being silently dropped.

import { NextResponse } from 'next/server';
import { ensureSchema, query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const EMPTY = { progress: {}, growth: {}, meta: {} };

// Generous caps — real usage is a few hundred keys at most across the whole
// app. These exist to bound storage/memory from a misbehaving or malicious
// authenticated client, not to accommodate any real usage pattern.
const MAX_BODY_BYTES = 256 * 1024; // 256KB
const MAX_MAP_KEYS = 5000;

function genericError(status, message) {
  return NextResponse.json({ error: message }, { status });
}

// Validates shape and value types without trusting anything about content —
// progress values must be boolean, growth values must be small non-negative
// integers, meta must be a flat string/boolean/number map. Returns null if
// valid, or an error message string if not.
function validateData(data) {
  for (const [key, val] of Object.entries(data.progress)) {
    if (typeof key !== 'string' || key.length > 200) return 'Invalid progress key.';
    if (typeof val !== 'boolean') return 'Invalid progress value.';
  }
  if (Object.keys(data.progress).length > MAX_MAP_KEYS) return 'Too many progress entries.';

  for (const [key, val] of Object.entries(data.growth)) {
    if (typeof key !== 'string' || key.length > 40) return 'Invalid growth key.';
    if (typeof val !== 'number' || !Number.isFinite(val) || val < 0 || val > 100000) {
      return 'Invalid growth value.';
    }
  }
  if (Object.keys(data.growth).length > 2000) return 'Too many growth entries.';

  for (const [key, val] of Object.entries(data.meta)) {
    if (typeof key !== 'string' || key.length > 100) return 'Invalid meta key.';
    if (val !== null && !['string', 'boolean', 'number'].includes(typeof val)) {
      return 'Invalid meta value.';
    }
  }
  if (Object.keys(data.meta).length > 50) return 'Too many meta entries.';

  return null;
}

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return genericError(401, 'Not authenticated.');
    }

    await ensureSchema();

    const { rows } = await query(
      'SELECT data, version FROM progress WHERE user_id = $1',
      [user.id]
    );
    const data = rows[0]?.data || EMPTY;
    return NextResponse.json({
      progress: data.progress || {},
      growth: data.growth || {},
      meta: data.meta || {},
      version: rows[0]?.version || 0,
    });
  } catch (err) {
    console.error('[api/progress GET]', err.message);
    return genericError(500, 'Could not load progress.');
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return genericError(401, 'Not authenticated.');
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return genericError(413, 'Request body too large.');
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return genericError(400, 'Invalid request body.');
    }

    if (!body || typeof body !== 'object') {
      return genericError(400, 'Invalid request body.');
    }

    // Normalize to the expected shape so we never persist junk.
    const data = {
      progress:
        body.progress && typeof body.progress === 'object' ? body.progress : {},
      growth: body.growth && typeof body.growth === 'object' ? body.growth : {},
      meta: body.meta && typeof body.meta === 'object' ? body.meta : {},
    };

    const validationError = validateData(data);
    if (validationError) {
      return genericError(400, validationError);
    }

    const clientVersion = Number.isInteger(body.version) ? body.version : 0;
    const serialized = JSON.stringify(data);
    if (Buffer.byteLength(serialized, 'utf8') > MAX_BODY_BYTES) {
      return genericError(413, 'Request body too large.');
    }

    await ensureSchema();

    // ON CONFLICT ... DO UPDATE ... WHERE only applies the update (and
    // returns a row) when the stored version still matches what the client
    // last read. A brand-new user has no existing row, so the INSERT branch
    // always succeeds regardless of clientVersion.
    const { rows } = await query(
      `INSERT INTO progress (user_id, data, version, updated_at)
       VALUES ($1, $2::jsonb, 1, now())
       ON CONFLICT (user_id) DO UPDATE
         SET data = $2::jsonb, version = progress.version + 1, updated_at = now()
         WHERE progress.version = $3
       RETURNING version`,
      [user.id, serialized, clientVersion]
    );

    if (rows.length === 0) {
      // Version mismatch: someone else (another tab/device) saved in
      // between this client's last read and this write. Hand back the
      // current server state so the caller can re-apply its change on top
      // of it and retry, instead of either silently losing data (this
      // client's change) or silently clobbering the other write.
      const current = await query(
        'SELECT data, version FROM progress WHERE user_id = $1',
        [user.id]
      );
      const currentData = current.rows[0]?.data || EMPTY;
      return NextResponse.json(
        {
          error: 'Progress was updated elsewhere. Please retry.',
          current: {
            progress: currentData.progress || {},
            growth: currentData.growth || {},
            meta: currentData.meta || {},
            version: current.rows[0]?.version || 0,
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true, version: rows[0].version });
  } catch (err) {
    console.error('[api/progress POST]', err.message);
    return genericError(500, 'Could not save progress.');
  }
}
