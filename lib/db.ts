/**
 * Database layer (Vercel Postgres / Neon)
 *
 * Replaces the previous Notion backend. Uses the Neon serverless driver, which
 * works well inside Vercel functions. Everything degrades gracefully: if no
 * connection string is configured, `isDbConfigured()` returns false and callers
 * fall back to static config (knowledge) or simply skip persistence
 * (transcripts).
 */

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Vercel's Neon integration injects one of these. Support the common names.
const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

let sqlClient: NeonQueryFunction<false, false> | null = null;

export function isDbConfigured(): boolean {
  return CONNECTION_STRING.length > 0;
}

/**
 * Returns a cached Neon SQL tagged-template client, or null when unconfigured.
 */
export function getSql(): NeonQueryFunction<false, false> | null {
  if (!isDbConfigured()) return null;
  if (!sqlClient) {
    sqlClient = neon(CONNECTION_STRING);
  }
  return sqlClient;
}

let schemaReady = false;

/**
 * Idempotently creates the tables used by the app. Safe to call on every
 * request path; the create statements are `IF NOT EXISTS` and we cache success.
 */
export async function ensureSchema(): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  if (schemaReady) return true;

  await sql`
    CREATE TABLE IF NOT EXISTS knowledge (
      id SERIAL PRIMARY KEY,
      section TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      mode TEXT NOT NULL DEFAULT 'text',
      started_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS usage_events (
      id SERIAL PRIMARY KEY,
      client_id TEXT NOT NULL,
      route TEXT NOT NULL,
      prompt_tokens INT NOT NULL DEFAULT 0,
      completion_tokens INT NOT NULL DEFAULT 0,
      estimated BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  schemaReady = true;
  return true;
}
