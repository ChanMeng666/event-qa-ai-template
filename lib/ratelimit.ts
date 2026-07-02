/**
 * Rate limiting (Vercel KV / Upstash Redis)
 *
 * Protects the realtime token endpoint (which spends OpenAI Realtime credits)
 * and the chat endpoint. If no KV/Upstash credentials are configured, limiting
 * is disabled (allow-all) so local development and unprovisioned previews work.
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const REST_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const REST_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

let redis: Redis | null = null;
if (REST_URL && REST_TOKEN) {
  redis = new Redis({ url: REST_URL, token: REST_TOKEN });
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
}

/**
 * Consumes one token for `identifier` under a named bucket. Returns success
 * true (allow) when limiting is disabled.
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
  return { success: res.success, remaining: res.remaining, limit };
}

/**
 * Best-effort client identifier from request headers.
 */
export function getClientId(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'anonymous';
}
