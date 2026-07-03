/**
 * POST /api/transcript
 *
 * Persists voice-session turns and enforces turn quotas + token budgets.
 * Best-effort DB persistence; rate/turn limits return 429 when exceeded.
 */

import { limitsConfig } from '@/config/limits.config';
import {
  validateTranscriptBody,
  moderateTranscriptTurns,
} from '@/lib/guardrails';
import { persistMessages } from '@/lib/transcripts';
import {
  checkRateLimit,
  getClientId,
  rateLimitResponse,
} from '@/lib/ratelimit';
import {
  checkAndIncrementTurn,
  estimateTurnTokens,
  recordUsage,
} from '@/lib/usage';

export const maxDuration = 15;

const TURN_LIMIT_MESSAGES: Record<string, string> = {
  session_turn_limit:
    'Session turn limit reached. Please start a new conversation.',
  daily_turn_limit:
    'Daily conversation limit reached. Please try again tomorrow.',
};

export async function POST(req: Request) {
  try {
    const clientId = getClientId(req);

    const rl = await checkRateLimit(
      'transcript',
      clientId,
      limitsConfig.realtime.transcriptPerMinute,
      60
    );
    if (!rl.success) {
      return Response.json(
        { ok: false, reason: 'rate_limited' },
        {
          status: 429,
          headers: {
            'Retry-After': '30',
            'X-RateLimit-Remaining': String(Math.max(0, rl.remaining)),
          },
        }
      );
    }

    const body = await req.json();
    const validated = validateTranscriptBody(body);
    if (!validated.ok) {
      return Response.json(
        { ok: false, reason: 'invalid_payload', error: validated.error },
        { status: 400 }
      );
    }

    const { conversationId, sessionId, turns } = validated.data;

    const moderation = await moderateTranscriptTurns(turns);
    if (!moderation.allowed) {
      return Response.json(
        {
          ok: false,
          reason: 'content_blocked',
          error: moderation.reason,
        },
        { status: 400 }
      );
    }

    const hasUserTurn = turns.some((t) => t.role === 'user');
    if (hasUserTurn) {
      const turnCheck = await checkAndIncrementTurn(
        sessionId ?? conversationId ?? null,
        clientId
      );
      if (!turnCheck.allowed) {
        return Response.json(
          {
            ok: false,
            reason: 'turn_limit',
            limitReason: turnCheck.reason,
            error: TURN_LIMIT_MESSAGES[turnCheck.reason ?? ''] ?? 'Turn limit reached.',
          },
          { status: 429 }
        );
      }
    }

    const tokens = estimateTurnTokens(turns);
    await recordUsage(clientId, tokens, { route: 'realtime', exact: false });

    const id = await persistMessages(
      conversationId ?? null,
      'voice',
      turns,
      sessionId ?? null
    );

    return Response.json({ ok: true, conversationId: id });
  } catch (error) {
    console.error('Transcript API Error:', error);
    return Response.json({ ok: false }, { status: 200 });
  }
}
