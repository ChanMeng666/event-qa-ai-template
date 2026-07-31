/**
 * Rate limiting (Vercel KV / Upstash Redis)
 *
 * Protects AI API routes from abuse. If no KV/Upstash credentials are
 * configured, limiting is disabled (allow-all) for local dev.
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const REST_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const REST_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

/**
 * The Upstash client throws on a malformed URL, and this module is evaluated
 * while Next.js collects page data, so a bad value takes down the whole build
 * rather than just disabling rate limiting. That is not hypothetical: `vercel
 * pull` writes the literal string "[SENSITIVE]" for env vars marked sensitive,
 * which is exactly what CI receives for KV_REST_API_URL.
 *
 * Validate first and degrade to "rate limiting disabled" instead of crashing.
 */
function isUsableRestUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

let redis: Redis | null = null;
if (isUsableRestUrl(REST_URL) && REST_TOKEN) {
  redis = new Redis({ url: REST_URL, token: REST_TOKEN });
} else if (REST_URL || REST_TOKEN) {
  console.warn(
    '[ratelimit] KV credentials present but unusable; rate limiting is DISABLED. ' +
      'Check that KV_REST_API_URL is a https:// URL and is not a sensitive env var.'
  );
}

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, limit: number, windowSeconds: number) {
  if (!redis) return null;
  const key = `${name}:${limit}:${windowSeconds}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      analytics: true,
      prefix: `ratelimit:${name}`,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  /** Window length in seconds for the bucket that rejected (if any). */
  windowSeconds?: number;
}

export interface RateLimitWindow {
  limit: number;
  windowSeconds: number;
}

export function isRateLimitEnabled(): boolean {
  return redis !== null;
}

export function getRedis(): Redis | null {
  return redis;
}

/**
 * Consumes one token for `identifier` under a named bucket.
 */
export async function checkRateLimit(
  name: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const limiter = getLimiter(name, limit, windowSeconds);
  if (!limiter) {
    return { success: true, remaining: limit, limit };
  }
  const res = await limiter.limit(identifier);
  return {
    success: res.success,
    remaining: res.remaining,
    limit,
    windowSeconds: res.success ? windowSeconds : windowSeconds,
  };
}

/**
 * Checks multiple sliding windows; consumes a token in each on success.
 * Stops at the first window that would exceed its limit.
 */
export async function checkMultiWindowLimit(
  name: string,
  identifier: string,
  windows: RateLimitWindow[]
): Promise<RateLimitResult> {
  if (!redis || windows.length === 0) {
    const first = windows[0];
    return {
      success: true,
      remaining: first?.limit ?? 999,
      limit: first?.limit ?? 999,
    };
  }

  let lastResult: RateLimitResult = {
    success: true,
    remaining: windows[0].limit,
    limit: windows[0].limit,
  };

  for (const { limit, windowSeconds } of windows) {
    const res = await checkRateLimit(name, identifier, limit, windowSeconds);
    if (!res.success) {
      return { ...res, windowSeconds };
    }
    lastResult = { ...res, windowSeconds };
  }

  return lastResult;
}

/** Atomic increment by amount with TTL on first write. */
export async function incrementCounterBy(
  key: string,
  amount: number,
  ttlSeconds: number
): Promise<number> {
  if (!redis || amount <= 0) return 0;
  const count = await redis.incrby(key, amount);
  if (count === amount) {
    await redis.expire(key, ttlSeconds);
  }
  return count;
}

/** Atomic increment with TTL (seconds). Returns new count. */
export async function incrementCounter(
  key: string,
  ttlSeconds: number
): Promise<number> {
  return incrementCounterBy(key, 1, ttlSeconds);
}

/** Read counter value; 0 when missing or KV disabled. */
export async function getCounter(key: string): Promise<number> {
  if (!redis) return 0;
  const val = await redis.get<number>(key);
  return typeof val === 'number' ? val : 0;
}

/** Set JSON value with TTL. */
export async function setJsonWithTtl(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
}

/** Get parsed JSON or null. */
export async function getJson<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  const raw = await redis.get<string>(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Strict UUID v4. Anything else is rejected so attacker-controlled text can
 * never reach a Redis key. Must stay in sync with lib/client-id.ts.
 */
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Characters legal in an IPv4/IPv6 literal (incl. zone id and mapped form). */
const IP_CHARS = /[^0-9a-fA-F:.%]/g;
const MAX_IP_LENGTH = 45; // longest legal IPv6 textual form

export interface ClientKey {
  /** Namespaced quota key: `cid:<uuid>` or `ip:<addr>`. */
  key: string;
  /** Sanitized source address, for the per-IP anti-abuse ceiling. */
  ip: string;
  source: 'cid' | 'ip';
}

/**
 * Sanitized source IP from proxy headers. Vercel overwrites
 * `x-forwarded-for`, but the value is treated as untrusted regardless.
 */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  const raw = fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip');
  if (!raw) return 'anonymous';

  const cleaned = raw.trim().replace(IP_CHARS, '').slice(0, MAX_IP_LENGTH);
  return cleaned || 'anonymous';
}

/**
 * Derives the quota key for a request.
 *
 * Prefers the browser's durable `x-client-id` so a shared venue IP does not
 * collapse ~100 attendees into one bucket. Falls back to the source IP when
 * the header is absent or not a well-formed UUID v4. Callers that need an
 * abuse ceiling should additionally limit on `ip` (see the mint route).
 */
export function getClientKey(req: Request): ClientKey {
  const ip = getClientIp(req);
  const cid = req.headers.get('x-client-id');

  if (cid && UUID_V4.test(cid.trim())) {
    return { key: `cid:${cid.trim().toLowerCase()}`, ip, source: 'cid' };
  }

  return { key: `ip:${ip}`, ip, source: 'ip' };
}

/** Retry-After hint from window length (conservative). */
function retryAfterSeconds(windowSeconds?: number): string {
  if (!windowSeconds) return '60';
  return String(Math.max(1, Math.ceil(windowSeconds / 2)));
}

/**
 * Standard 429 JSON response with rate-limit headers.
 */
export function rateLimitResponse(
  result: RateLimitResult,
  message: string,
  extra?: Record<string, unknown>
): Response {
  return Response.json(
    { error: message, reason: 'rate_limited', ...extra },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfterSeconds(result.windowSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
      },
    }
  );
}
