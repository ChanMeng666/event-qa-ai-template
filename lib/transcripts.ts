/**
 * Transcript persistence
 *
 * Best-effort storage of conversation turns in Postgres. Every function is
 * safe to call when the DB is unconfigured (it simply no-ops) and never throws
 * into the request path.
 */

import { getSql, ensureSchema, isDbConfigured } from './db';

export interface TurnInput {
  role: string;
  content: string;
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

/**
 * Ensures a conversation row exists, creating one if `conversationId` is null.
 * Returns the conversation id, or null if persistence is unavailable.
 */
export async function ensureConversation(
  conversationId: string | null,
  mode: 'text' | 'voice',
  sessionId?: string | null
): Promise<string | null> {
  if (!isDbConfigured()) return null;
  try {
    const ok = await ensureSchema();
    if (!ok) return null;
    const sql = getSql();
    if (!sql) return null;

    const id = conversationId || newId();
    await sql`
      INSERT INTO conversations (id, session_id, mode)
      VALUES (${id}, ${sessionId ?? null}, ${mode})
      ON CONFLICT (id) DO NOTHING
    `;
    return id;
  } catch (err) {
    console.error('ensureConversation failed:', err);
    return null;
  }
}

/**
 * Persists an array of turns for a conversation. Creates the conversation if
 * needed. Returns the conversation id used, or null when unavailable.
 */
export async function persistMessages(
  conversationId: string | null,
  mode: 'text' | 'voice',
  turns: TurnInput[],
  sessionId?: string | null
): Promise<string | null> {
  if (!isDbConfigured() || turns.length === 0) return conversationId;
  try {
    const id = await ensureConversation(conversationId, mode, sessionId);
    if (!id) return null;
    const sql = getSql();
    if (!sql) return null;

    for (const turn of turns) {
      const content = (turn.content ?? '').trim();
      if (!content) continue;
      await sql`
        INSERT INTO messages (conversation_id, role, content)
        VALUES (${id}, ${turn.role}, ${content})
      `;
    }
    return id;
  } catch (err) {
    console.error('persistMessages failed:', err);
    return conversationId;
  }
}
