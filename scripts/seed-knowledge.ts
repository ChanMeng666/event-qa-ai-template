/**
 * Seed the `knowledge` table with the 2026 event content.
 *
 * The knowledge itself lives in config/knowledge.config.ts (the single source
 * of truth shared with the AI system prompt). This script only upserts those
 * sections into Postgres and prunes any rows that are no longer defined there.
 *
 * Usage:
 *   1. Ensure DATABASE_URL / POSTGRES_URL is set (Vercel Postgres / Neon).
 *      Locally you can run:  vercel env pull .env.local  then
 *      node --env-file=.env.local ./node_modules/tsx/dist/cli.mjs scripts/seed-knowledge.ts
 *      or simply: npm run db:seed   (with the env var exported in your shell)
 *   2. Re-running is safe: sections are upserted by name, and sections removed
 *      from config/knowledge.config.ts are pruned from the table.
 */

import { neon } from '@neondatabase/serverless';
import { knowledgeSections as sections } from '../config/knowledge.config';

const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

async function main() {
  if (!CONNECTION_STRING) {
    console.error(
      'No database connection string found. Set DATABASE_URL or POSTGRES_URL (e.g. run `vercel env pull .env.local` and use `node --env-file=.env.local`).'
    );
    process.exit(1);
  }

  const sql = neon(CONNECTION_STRING);

  await sql`
    CREATE TABLE IF NOT EXISTS knowledge (
      id SERIAL PRIMARY KEY,
      section TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  for (const s of sections) {
    await sql`
      INSERT INTO knowledge (section, content, sort_order, updated_at)
      VALUES (${s.section}, ${s.content}, ${s.sort}, now())
      ON CONFLICT (section)
      DO UPDATE SET content = EXCLUDED.content, sort_order = EXCLUDED.sort_order, updated_at = now()
    `;
    console.log(`Seeded: ${s.section}`);
  }

  // Prune any DB rows whose section is no longer in the source of truth. This
  // is deliberate: some sections are retired each round (e.g. "Two-day format",
  // "Tickets & pricing", "Overview") and must not linger in the DB, which fully
  // replaces the static config when it has rows.
  const keepSections = sections.map((s) => s.section);
  const pruned = (await sql`
    DELETE FROM knowledge
    WHERE section <> ALL(${keepSections})
    RETURNING section
  `) as { section: string }[];

  if (pruned.length > 0) {
    console.log(`\nPruned ${pruned.length} stale section(s):`);
    for (const row of pruned) {
      console.log(`  - ${row.section}`);
    }
  } else {
    console.log('\nNo stale sections to prune.');
  }

  console.log(`\nDone. Seeded ${sections.length} knowledge sections.`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
