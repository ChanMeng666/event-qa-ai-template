/**
 * POST /api/realtime/session
 *
 * Mints a short-lived ephemeral client secret for the OpenAI Realtime API so
 * the browser can open a WebRTC voice session WITHOUT ever seeing the real
 * OPENAI_API_KEY. Seeds the session with event instructions, voice, and input
 * transcription so captions work.
 */

import { limitsConfig } from '@/config/limits.config';
import { realtimeConfig } from '@/config/ai.config';
import { getVoiceInstructions } from '@/lib/knowledge';
import {
  checkMultiWindowLimit,
  getClientKey,
  rateLimitResponse,
} from '@/lib/ratelimit';
import { checkBudget, registerSession } from '@/lib/usage';

export const maxDuration = 30;

function newSessionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'OPENAI_API_KEY is not configured.' },
      { status: 500 }
    );
  }

  const { key: clientId, ip } = getClientKey(req);
  const { realtime } = limitsConfig;

  // Kick off instruction loading (may hit Postgres) in parallel with the KV
  // budget/rate checks below. The guard swallows the rejection so an early
  // limit-rejection return can't produce an unhandled rejection; the real
  // error still surfaces when we await instructionsPromise in the try block.
  const instructionsPromise = getVoiceInstructions();
  void instructionsPromise.catch(() => {});

  // The per-client windows are the real quota; the per-IP windows are a much
  // larger anti-abuse ceiling so a single address cannot farm ephemeral
  // OpenAI tokens by rotating a forged x-client-id.
  const [budget, rl, ipRl] = await Promise.all([
    checkBudget(clientId),
    checkMultiWindowLimit('realtime-session', clientId, [
      { limit: realtime.sessionsPerMinute, windowSeconds: 60 },
      { limit: realtime.sessionsPerHour, windowSeconds: 3600 },
      { limit: realtime.sessionsPerDay, windowSeconds: 86400 },
    ]),
    checkMultiWindowLimit('realtime-session-ip', `ip:${ip}`, [
      { limit: realtime.sessionsPerIpPerMinute, windowSeconds: 60 },
      { limit: realtime.sessionsPerIpPerDay, windowSeconds: 86400 },
    ]),
  ]);

  if (!budget.allowed) {
    const message =
      budget.reason === 'global_budget'
        ? 'Daily usage limit reached for this event. Please try again tomorrow.'
        : 'Your daily usage limit has been reached. Please try again tomorrow.';
    return Response.json(
      { error: message, reason: budget.reason },
      { status: 429 }
    );
  }

  if (!rl.success) {
    return rateLimitResponse(
      rl,
      'Too many voice sessions. Please wait a moment and try again.'
    );
  }

  if (!ipRl.success) {
    return rateLimitResponse(
      ipRl,
      'This network is starting too many voice sessions. Please try again shortly.'
    );
  }

  const sessionId = newSessionId();

  try {
    const [, instructions] = await Promise.all([
      registerSession(sessionId, clientId),
      instructionsPromise,
    ]);

    const sessionConfig = {
      session: {
        type: 'realtime',
        model: realtimeConfig.model,
        instructions,
        audio: {
          input: {
            transcription: { model: realtimeConfig.transcribeModel },
            turn_detection: { type: 'server_vad' },
          },
          output: {
            voice: realtimeConfig.voice,
          },
        },
      },
    };

    const response = await fetch(
      'https://api.openai.com/v1/realtime/client_secrets',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Safety-Identifier': `hackathon-agent:${clientId}`,
        },
        body: JSON.stringify(sessionConfig),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error('Realtime session mint failed:', response.status, detail);
      return Response.json(
        { error: 'Failed to create realtime session.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const value: string | undefined = data.value || data?.client_secret?.value;
    if (!value) {
      console.error('Realtime session response missing secret:', data);
      return Response.json(
        { error: 'Malformed realtime session response.' },
        { status: 502 }
      );
    }

    return Response.json({
      value,
      sessionId,
      expires_at: data.expires_at ?? data?.client_secret?.expires_at ?? null,
      model: realtimeConfig.model,
      sessionLimits: {
        maxSessionMinutes: realtime.maxSessionMinutes,
        maxTurnsPerSession: realtime.maxTurnsPerSession,
        maxTextLength: realtime.maxTextLength,
        reconnectCooldownSeconds: realtime.reconnectCooldownSeconds,
        textSendMinIntervalMs: realtime.textSendMinIntervalMs,
      },
    });
  } catch (error) {
    console.error('Realtime session error:', error);
    return Response.json(
      { error: 'Internal error creating realtime session.' },
      { status: 500 }
    );
  }
}
