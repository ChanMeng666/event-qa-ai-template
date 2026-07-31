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
  /**
   * Vercel BotID on the realtime session mint route.
   *
   * DEFAULT OFF, deliberately. When first enabled in production on 2026-07-31
   * it returned 403 to real browsers, not just to scripted callers: the client
   * bundle and the challenge script both loaded, but the solution was not being
   * attached to the mint request, so checkBotId() judged genuine attendees to be
   * bots. Production was restored by setting BOTID_ENABLED=false.
   *
   * Do NOT flip this to true again without first verifying, on a preview
   * deployment, that a real browser can still start a voice session. Enabling it
   * blindly takes the voice agent offline for everyone.
   *
   * The check fails open on error - only an explicit `isBot: true` blocks.
   */
  botid: {
    enabled: envBool('BOTID_ENABLED', false),
  },

  /**
   * Edge middleware burst limit across all AI API routes, per *client*
   * (per-browser `x-client-id`, falling back to IP).
   */
  apiBurstPerMinute: envInt('LIMITS_API_BURST_PER_MINUTE', 60),

  /**
   * Edge middleware ceiling per source IP. Must stay well above
   * `apiBurstPerMinute` because a whole venue shares one NAT address
   * (~100 attendees on AUT campus wifi).
   */
  apiBurstPerIpPerMinute: envInt('LIMITS_API_BURST_PER_IP_PER_MINUTE', 600),

  realtime: {
    sessionsPerMinute: envInt('LIMITS_REALTIME_SESSIONS_PER_MINUTE', 5),
    sessionsPerHour: envInt('LIMITS_REALTIME_SESSIONS_PER_HOUR', 20),
    sessionsPerDay: envInt('LIMITS_REALTIME_SESSIONS_PER_DAY', 40),
    /**
     * Anti-abuse ceiling per source IP, independent of the per-client
     * limits above. A browser-generated client id is trivially forgeable,
     * so one address must not be able to farm ephemeral OpenAI tokens.
     */
    sessionsPerIpPerMinute: envInt('LIMITS_REALTIME_SESSIONS_PER_IP_PER_MINUTE', 120),
    sessionsPerIpPerDay: envInt('LIMITS_REALTIME_SESSIONS_PER_IP_PER_DAY', 800),
    maxSessionMinutes: envInt('LIMITS_REALTIME_MAX_SESSION_MINUTES', 15),
    maxTurnsPerSession: envInt('LIMITS_REALTIME_MAX_TURNS_PER_SESSION', 30),
    maxTurnsPerDay: envInt('LIMITS_REALTIME_MAX_TURNS_PER_DAY', 200),
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
    /** Event-wide ceiling: ~100 attendees x 2 days of Realtime audio. */
    dailyTokenBudget: envInt('LIMITS_DAILY_TOKEN_BUDGET', 10_000_000),
    /** Per-browser ceiling (not per venue) now that quotas key on client id. */
    perClientDailyTokenBudget: envInt('LIMITS_PER_CLIENT_DAILY_TOKEN_BUDGET', 60_000),
  },
} as const;

export type LimitsConfig = typeof limitsConfig;
