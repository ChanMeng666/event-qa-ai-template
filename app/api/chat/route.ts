/**
 * POST /api/chat
 *
 * Text chat with the event agent. Disabled by default (ENABLE_CHAT_API=false)
 * because the live UI uses Realtime for typed input. When enabled, applies
 * multi-window rate limits, guardrails, and usage tracking.
 */

import { openai } from '@ai-sdk/openai';
import {
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type ModelMessage,
} from 'ai';
import { aiConfig, limitsConfig } from '@/config';
import { getChatInstructions } from '@/lib/knowledge';
import { persistMessages } from '@/lib/transcripts';
import {
  checkMultiWindowLimit,
  getClientKey,
  rateLimitResponse,
} from '@/lib/ratelimit';
import {
  validateChatBody,
  moderateChatMessages,
} from '@/lib/guardrails';
import { checkBudget, recordUsage } from '@/lib/usage';

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!limitsConfig.chat.enabled) {
    return new Response('Chat API is disabled.', { status: 403 });
  }

  try {
    const { key: clientId } = getClientKey(req);

    const budget = await checkBudget(clientId);
    if (!budget.allowed) {
      const message =
        budget.reason === 'global_budget'
          ? 'Daily usage limit reached for this event. Please try again tomorrow.'
          : 'Your daily usage limit has been reached. Please try again tomorrow.';
      return new Response(message, { status: 429 });
    }

    const { chat } = limitsConfig;
    const rl = await checkMultiWindowLimit('chat', clientId, [
      { limit: chat.messagesPerMinute, windowSeconds: 60 },
      { limit: chat.messagesPerHour, windowSeconds: 3600 },
      { limit: chat.messagesPerDay, windowSeconds: 86400 },
    ]);

    if (!rl.success) {
      return rateLimitResponse(rl, 'Too many messages. Please slow down.');
    }

    const body = await req.json();
    const validated = validateChatBody(body);
    if (!validated.ok) {
      return new Response(validated.error, { status: 400 });
    }

    const { messages, conversationId } = validated.data;

    const moderation = await moderateChatMessages(messages);
    if (!moderation.allowed) {
      return new Response(
        moderation.reason ?? 'Content not allowed.',
        { status: 400 }
      );
    }

    // Already plain {role, content} pairs, i.e. valid ModelMessages -- no
    // UIMessage conversion needed (nothing on the client uses useChat).
    const cleanedMessages: ModelMessage[] = messages
      .filter((msg) => msg.id !== 'system')
      .map((msg) => ({ role: msg.role, content: msg.content }) as ModelMessage);

    const instructions = await getChatInstructions();
    const model = openai(aiConfig.model.name);

    const lastUser = [...cleanedMessages]
      .reverse()
      .find((m) => m.role === 'user');

    const result = streamText({
      model,
      instructions,
      messages: cleanedMessages,
      temperature: aiConfig.model.temperature,
      maxOutputTokens: aiConfig.model.maxTokens,
      // v7: onEnd replaces onFinish, and its `usage` is cumulative across all
      // steps (what v6 called `totalUsage`). Token fields are inputTokens /
      // outputTokens; lib/usage.ts keeps its own prompt/completion naming to
      // match the usage_events columns.
      onEnd: async ({ text, usage }) => {
        const totalTokens =
          usage?.totalTokens ??
          (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0);

        if (totalTokens > 0) {
          await recordUsage(clientId, totalTokens, {
            route: 'chat',
            exact: true,
            promptTokens: usage?.inputTokens,
            completionTokens: usage?.outputTokens,
          });
        }

        await persistMessages(conversationId ?? null, 'text', [
          ...(lastUser
            ? [{ role: 'user', content: String(lastUser.content) }]
            : []),
          { role: 'assistant', content: text },
        ]);
      },
    });

    // v7 deprecates result.toUIMessageStreamResponse() in favour of the
    // standalone helpers over result.stream (v7 renamed fullStream -> stream).
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
