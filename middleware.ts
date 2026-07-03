/**
 * Edge middleware: coarse burst rate limit across AI API routes.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { limitsConfig } from '@/config/limits.config';
import { checkRateLimit, getClientId, isRateLimitEnabled } from '@/lib/ratelimit';

const AI_API_PREFIXES = [
  '/api/realtime',
  '/api/chat',
  '/api/transcript',
];

function isAiApiRoute(pathname: string): boolean {
  return AI_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (!isAiApiRoute(pathname)) {
    return NextResponse.next();
  }

  if (!isRateLimitEnabled()) {
    return NextResponse.next();
  }

  const clientId = getClientId(request);
  const rl = await checkRateLimit(
    'api-burst',
    clientId,
    limitsConfig.apiBurstPerMinute,
    60
  );

  if (!rl.success) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please slow down.',
        reason: 'rate_limited',
      },
      {
        status: 429,
        headers: {
          'Retry-After': '30',
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': String(Math.max(0, rl.remaining)),
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/realtime/:path*', '/api/chat', '/api/transcript'],
};
