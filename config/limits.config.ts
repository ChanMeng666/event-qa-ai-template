/**
 * Centralized rate limits, session quotas, and token budgets.
 * Override defaults via env vars without code changes (see .env.example).
 */

function envInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function envBool(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  return raw === '1' || raw.toLowerCase() === 'true';
}

export const limitsConfig = {
  /** Edge middleware burst limit across all AI API routes. */
  apiBurstPerMinute: envInt('LIMITS_API_BURST_PER_MINUTE', 30),

  realtime: {
    sessionsPerMinute: envInt('LIMITS_REALTIME_SESSIONS_PER_MINUTE', 5),
    sessionsPerHour: envInt('LIMITS_REALTIME_SESSIONS_PER_HOUR', 20),
    sessionsPerDay: envInt('LIMITS_REALTIME_SESSIONS_PER_DAY', 50),
    maxSessionMinutes: envInt('LIMITS_REALTIME_MAX_SESSION_MINUTES', 15),
    maxTurnsPerSession: envInt('LIMITS_REALTIME_MAX_TURNS_PER_SESSION', 30),
    maxTurnsPerDay: envInt('LIMITS_REALTIME_MAX_TURNS_PER_DAY', 100),
    maxTextLength: envInt('LIMITS_REALTIME_MAX_TEXT_LENGTH', 500),
    reconnectCooldownSeconds: envInt('LIMITS_REALTIME_RECONNECT_COOLDOWN', 30),
    textSendMinIntervalMs: envInt('LIMITS_REALTIME_TEXT_MIN_INTERVAL_MS', 2000),
    transcriptPerMinute: envInt('LIMITS_TRANSCRIPT_PER_MINUTE', 120),
  },

  chat: {
    enabled: envBool('ENABLE_CHAT_API', false),
    messagesPerMinute: envInt('LIMITS_CHAT_MESSAGES_PER_MINUTE', 20),
    messagesPerHour: envInt('LIMITS_CHAT_MESSAGES_PER_HOUR', 60),
    messagesPerDay: envInt('LIMITS_CHAT_MESSAGES_PER_DAY', 200),
    maxInputChars: envInt('LIMITS_CHAT_MAX_INPUT_CHARS', 2000),
    maxHistoryMessages: envInt('LIMITS_CHAT_MAX_HISTORY_MESSAGES', 20),
  },

  budget: {
    dailyTokenBudget: envInt('LIMITS_DAILY_TOKEN_BUDGET', 500_000),
    perClientDailyTokenBudget: envInt('LIMITS_PER_CLIENT_DAILY_TOKEN_BUDGET', 30_000),
  },
} as const;

export type LimitsConfig = typeof limitsConfig;
