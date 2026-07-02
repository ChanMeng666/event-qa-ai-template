/**
 * Knowledge layer
 *
 * Single source of truth for the agent's event knowledge and instructions,
 * shared by the text chat route and the realtime voice session.
 *
 * Knowledge is loaded from Postgres when available (so it can be edited without
 * a redeploy) and falls back to the static content in `config/`.
 */

import { getSql, ensureSchema, isDbConfigured } from './db';
import {
  generateSystemPrompt,
  additionalContext,
  realtimeConfig,
} from '@/config/ai.config';
import { siteConfig } from '@/config/site.config';

/**
 * The static, always-available base instructions (persona + response style)
 * plus the 2026 knowledge from config. Used directly as the fallback.
 */
export function getStaticInstructions(): string {
  return generateSystemPrompt(siteConfig) + additionalContext;
}

/**
 * Loads editable knowledge sections from the database, ordered. Returns null
 * when the DB is not configured or has no rows, so callers can fall back.
 */
async function loadKnowledgeFromDb(): Promise<string | null> {
  if (!isDbConfigured()) return null;
  try {
    const ok = await ensureSchema();
    if (!ok) return null;
    const sql = getSql();
    if (!sql) return null;
    const rows = (await sql`
      SELECT section, content
      FROM knowledge
      ORDER BY sort_order ASC, id ASC
    `) as { section: string; content: string }[];
    if (!rows || rows.length === 0) return null;
    return rows
      .map((r) => `## ${r.section}\n${r.content}`)
      .join('\n\n');
  } catch (err) {
    console.error('Knowledge load failed, using static fallback:', err);
    return null;
  }
}

/**
 * Builds the effective text-chat instructions: base persona + knowledge.
 * Prefers DB knowledge, falls back to static config.
 */
export async function getChatInstructions(): Promise<string> {
  const dbKnowledge = await loadKnowledgeFromDb();
  if (dbKnowledge) {
    return `${generateSystemPrompt(siteConfig)}\n\n${dbKnowledge}`;
  }
  return getStaticInstructions();
}

/**
 * Builds the realtime (voice) instructions: chat instructions plus spoken-output
 * guidance so replies stay short and natural.
 */
export async function getVoiceInstructions(): Promise<string> {
  const base = await getChatInstructions();
  return `${base}\n\n## Voice Delivery\n${realtimeConfig.voiceGuidance}`;
}
