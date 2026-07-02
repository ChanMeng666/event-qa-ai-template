/**
 * POST /api/transcript
 *
 * Persists voice-session turns (user + assistant transcripts) coming from the
 * realtime agent running in the browser. Best-effort: returns ok even when the
 * database is not configured so the client never has to handle failures.
 */

import { persistMessages, type TurnInput } from '@/lib/transcripts';
import { checkRateLimit, getClientId } from '@/lib/ratelimit';

export const maxDuration = 15;

export async function POST(req: Request) {
  try {
    const clientId = getClientId(req);
    const rl = await checkRateLimit('transcript', clientId, 120, 60);
    if (!rl.success) {
      return Response.json({ ok: false, reason: 'rate_limited' }, { status: 429 });
    }

    const body = await req.json();
    const conversationId: string | null = body.conversationId ?? null;
    const sessionId: string | null = body.sessionId ?? null;
    const turns: TurnInput[] = Array.isArray(body.turns) ? body.turns : [];

    const id = await persistMessages(conversationId, 'voice', turns, sessionId);
    return Response.json({ ok: true, conversationId: id });
  } catch (error) {
    console.error('Transcript API Error:', error);
    return Response.json({ ok: false }, { status: 200 });
  }
}
