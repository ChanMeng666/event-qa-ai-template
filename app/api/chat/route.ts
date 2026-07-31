/**
 * POST /api/chat
 *
 * Text chat with the event agent. Disabled by default (ENABLE_CHAT_API=false)
 * because the live UI uses Realtime for typed input. When enabled, applies
 * multi-window rate limits, guardrails, and usage tracking.
 */

import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
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

    const cleanedMessages = messages
      .filter((msg) => msg.id !== 'system')
      .map((msg) => ({ role: msg.role, content: msg.content }));

    const instructions = await getChatInstructions();
    const model = openai(aiConfig.model.name);

    const lastUser = [...cleanedMessages]
      .reverse()
      .find((m) => m.role === 'user');

    const result = await streamText({
      model,
      system: instructions,
      messages: convertToCoreMessages(cleanedMessages),
      temperature: aiConfig.model.temperature,
      maxTokens: aiConfig.model.maxTokens,
      onFinish: async ({ text, usage }) => {
        const totalTokens =
          usage?.totalTokens ??
          (usage?.promptTokens ?? 0) + (usage?.completionTokens ?? 0);

        if (totalTokens > 0) {
          await recordUsage(clientId, totalTokens, {
            route: 'chat',
            exact: true,
            promptTokens: usage?.promptTokens,
            completionTokens: usage?.completionTokens,
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

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
