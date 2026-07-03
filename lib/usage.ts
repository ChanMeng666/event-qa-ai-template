/**
 * Token usage tracking and budget circuit breakers (KV + optional Postgres).
 */

import { limitsConfig } from '@/config/limits.config';
import {
  getCounter,
  incrementCounter,
  incrementCounterBy,
  setJsonWithTtl,
  getJson,
} from '@/lib/ratelimit';
import { getSql, ensureSchema, isDbConfigured } from '@/lib/db';

const COUNTER_TTL = 48 * 60 * 60; // 48 hours
const SESSION_TTL = 24 * 60 * 60; // 24 hours

export interface SessionRecord {
  clientId: string;
  startedAt: string;
  turnCount: number;
}

export interface BudgetCheckResult {
  allowed: boolean;
  reason?: 'global_budget' | 'client_budget';
}

export interface TurnCheckResult {
  allowed: boolean;
  reason?: 'session_turn_limit' | 'daily_turn_limit';
}

export interface RecordUsageOptions {
  route: 'realtime' | 'chat';
  exact?: boolean;
  promptTokens?: number;
  completionTokens?: number;
}

/** Rough token estimate (~4 chars per token). */
export function estimateTokens(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return Math.ceil(trimmed.length / 4);
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function globalUsageKey(date = todayKey()): string {
  return `usage:global:daily:${date}`;
}

function clientUsageKey(clientId: string, date = todayKey()): string {
  return `usage:client:${clientId}:${date}`;
}

function clientTurnsKey(clientId: string, date = todayKey()): string {
  return `turns:client:${clientId}:${date}`;
}

function sessionTurnsKey(sessionId: string): string {
  return `turns:session:${sessionId}`;
}

function sessionMetaKey(sessionId: string): string {
  return `session:${sessionId}`;
}

export async function registerSession(
  sessionId: string,
  clientId: string
): Promise<void> {
  const record: SessionRecord = {
    clientId,
    startedAt: new Date().toISOString(),
    turnCount: 0,
  };
  await setJsonWithTtl(sessionMetaKey(sessionId), record, SESSION_TTL);
}

export async function getSession(
  sessionId: string
): Promise<SessionRecord | null> {
  return getJson<SessionRecord>(sessionMetaKey(sessionId));
}

/** Check global and per-client daily token budgets before minting/chat. */
export async function checkBudget(clientId: string): Promise<BudgetCheckResult> {
  const { dailyTokenBudget, perClientDailyTokenBudget } = limitsConfig.budget;

  const globalUsed = await getCounter(globalUsageKey());
  if (globalUsed >= dailyTokenBudget) {
    return { allowed: false, reason: 'global_budget' };
  }

  const clientUsed = await getCounter(clientUsageKey(clientId));
  if (clientUsed >= perClientDailyTokenBudget) {
    return { allowed: false, reason: 'client_budget' };
  }

  return { allowed: true };
}

/**
 * Check turn quotas and increment counters for a user turn.
 */
export async function checkAndIncrementTurn(
  sessionId: string | null,
  clientId: string
): Promise<TurnCheckResult> {
  const { maxTurnsPerSession, maxTurnsPerDay } = limitsConfig.realtime;

  const dailyTurns = await getCounter(clientTurnsKey(clientId));
  if (dailyTurns >= maxTurnsPerDay) {
    return { allowed: false, reason: 'daily_turn_limit' };
  }

  if (sessionId) {
    const sessionTurns = await getCounter(sessionTurnsKey(sessionId));
    if (sessionTurns >= maxTurnsPerSession) {
      return { allowed: false, reason: 'session_turn_limit' };
    }
  }

  await incrementCounter(clientTurnsKey(clientId), COUNTER_TTL);
  if (sessionId) {
    await incrementCounter(sessionTurnsKey(sessionId), SESSION_TTL);
  }

  return { allowed: true };
}

/** Best-effort Postgres audit row for usage analytics. */
async function persistUsageEvent(
  clientId: string,
  tokens: number,
  options: RecordUsageOptions
): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    const ok = await ensureSchema();
    if (!ok) return;
    const sql = getSql();
    if (!sql) return;

    await sql`
      INSERT INTO usage_events (
        client_id,
        route,
        prompt_tokens,
        completion_tokens,
        estimated
      )
      VALUES (
        ${clientId},
        ${options.route},
        ${options.exact ? (options.promptTokens ?? 0) : 0},
        ${options.exact ? (options.completionTokens ?? tokens) : tokens},
        ${options.exact ? false : true}
      )
    `;
  } catch (err) {
    console.error('persistUsageEvent failed:', err);
  }
}

/** Record token usage in KV counters and optionally Postgres. */
export async function recordUsage(
  clientId: string,
  tokens: number,
  options: RecordUsageOptions
): Promise<void> {
  if (tokens <= 0) return;

  await incrementCounterBy(globalUsageKey(), tokens, COUNTER_TTL);
  await incrementCounterBy(clientUsageKey(clientId), tokens, COUNTER_TTL);
  await persistUsageEvent(clientId, tokens, options);
}

/** Sum estimated tokens from transcript turns. */
export function estimateTurnTokens(
  turns: { role: string; content: string }[]
): number {
  return turns.reduce((sum, t) => sum + estimateTokens(t.content ?? ''), 0);
}
