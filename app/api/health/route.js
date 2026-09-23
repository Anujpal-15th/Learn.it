// Dev diagnostic route — confirms the DB connection works and that
// ensureSchema() creates the tables. Not a product feature.
//
// Security (Phase 2 hardening): this is unauthenticated by design (it's used
// to verify DB connectivity before there's any user to log in as), so it
// must never leak internal error details (connection strings, DB error
// messages, schema info) to an anonymous caller, and is disabled outright in
// production — a live deployment has no legitimate reason to expose even a
// generic DB-status probe to the public internet.

import { ensureSchema, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }

  try {
    await ensureSchema();

    const { rows } = await query(
      `SELECT table_name
         FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN ('users', 'progress')
        ORDER BY table_name`
    );

    const tables = rows.map((r) => r.table_name);

    return Response.json({
      ok: true,
      message: 'Database connected and schema is ready.',
      tables,
    });
  } catch (err) {
    console.error('[api/health]', err.message);
    return Response.json({ ok: false, error: 'Database health check failed.' }, { status: 500 });
  }
}
