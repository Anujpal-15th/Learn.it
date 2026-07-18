// Phase 1 verification route. Confirms the DB connection works and that
// ensureSchema() creates the two tables. Visit /api/health after setting
// DATABASE_URL. This is a dev diagnostic, not a product feature — safe to
// remove once the app is fully built.

import { ensureSchema, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSchema();

    // Confirm both tables now exist in the current database.
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
    return Response.json(
      {
        ok: false,
        error: err.message || 'Database health check failed.',
      },
      { status: 500 }
    );
  }
}
