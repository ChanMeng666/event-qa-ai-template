/**
 * Input validation and OpenAI Moderation guardrails.
 */

import { z } from 'zod';
import { limitsConfig } from '@/config/limits.config';

const turnSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(limitsConfig.realtime.maxTextLength),
});

const transcriptBodySchema = z.object({
  conversationId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  turns: z
    .array(turnSchema)
    .min(1)
    .max(5),
});

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(limitsConfig.chat.maxInputChars),
  id: z.string().optional(),
});

const chatBodySchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(limitsConfig.chat.maxHistoryMessages),
  conversationId: z.string().nullable().optional(),
});

export type TranscriptBody = z.infer<typeof transcriptBodySchema>;
export type ChatBody = z.infer<typeof chatBodySchema>;

export interface ValidationResult<T> {
  ok: true;
  data: T;
}

export interface ValidationError {
  ok: false;
  error: string;
}

export function validateTranscriptBody(
  body: unknown
): ValidationResult<TranscriptBody> | ValidationError {
  const parsed = transcriptBodySchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid transcript payload.' };
  }
  return { ok: true, data: parsed.data };
}

export function validateChatBody(
  body: unknown
): ValidationResult<ChatBody> | ValidationError {
  const parsed = chatBodySchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid chat payload.' };
  }
  return { ok: true, data: parsed.data };
}

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Calls OpenAI Moderation API. Returns allowed=false when flagged.
 * On API failure, allows content (fail-open) to avoid blocking legitimate users.
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  const trimmed = text.trim();
  if (!trimmed) return { allowed: true };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { allowed: true };

  try {
    const res = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'omni-moderation-latest',
        input: trimmed,
      }),
    });

    if (!res.ok) {
      console.error('Moderation API error:', res.status);
      return { allowed: true };
    }

    const data = await res.json();
    const flagged = data?.results?.[0]?.flagged === true;
    if (flagged) {
      return {
        allowed: false,
        reason: 'Content not allowed. Please keep questions event-related.',
      };
    }
    return { allowed: true };
  } catch (err) {
    console.error('Moderation request failed:', err);
    return { allowed: true };
  }
}

/** Moderate all user turns in a transcript batch. */
export async function moderateTranscriptTurns(
  turns: { role: string; content: string }[]
): Promise<ModerationResult> {
  for (const turn of turns) {
    if (turn.role !== 'user') continue;
    const result = await moderateContent(turn.content);
    if (!result.allowed) return result;
  }
  return { allowed: true };
}

/** Moderate the latest user message in chat history. */
export async function moderateChatMessages(
  messages: { role: string; content: string }[]
): Promise<ModerationResult> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return { allowed: true };
  return moderateContent(lastUser.content);
}
