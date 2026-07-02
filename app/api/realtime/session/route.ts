/**
 * POST /api/realtime/session
 *
 * Mints a short-lived ephemeral client secret for the OpenAI Realtime API so
 * the browser can open a WebRTC voice session WITHOUT ever seeing the real
 * OPENAI_API_KEY. Seeds the session with the 2026 event instructions, voice,
 * and input transcription so captions work.
 *
 * GA flow: server -> POST https://api.openai.com/v1/realtime/client_secrets
 * (browser then POSTs its SDP offer to /v1/realtime/calls with this secret).
 */

import { realtimeConfig } from '@/config/ai.config';
import { getVoiceInstructions } from '@/lib/knowledge';
import { checkRateLimit, getClientId } from '@/lib/ratelimit';

export const maxDuration = 30;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'OPENAI_API_KEY is not configured.' },
      { status: 500 }
    );
  }

  // Protect Realtime spend: limit token minting per client.
  const clientId = getClientId(req);
  const rl = await checkRateLimit('realtime-session', clientId, 10, 60);
  if (!rl.success) {
    return Response.json(
      { error: 'Too many voice sessions. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  try {
    const instructions = await getVoiceInstructions();

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
    // GA returns { value, expires_at, session }. Support legacy shape too.
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
      expires_at: data.expires_at ?? data?.client_secret?.expires_at ?? null,
      model: realtimeConfig.model,
    });
  } catch (error) {
    console.error('Realtime session error:', error);
    return Response.json(
      { error: 'Internal error creating realtime session.' },
      { status: 500 }
    );
  }
}
