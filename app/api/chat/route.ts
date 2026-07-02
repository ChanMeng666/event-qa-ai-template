/**
 * POST /api/chat
 *
 * Text chat with the event agent. Uses the Vercel AI SDK with an OpenAI model,
 * seeded with the shared knowledge base (DB-backed, static fallback). Best-effort
 * persists the user turn + assistant reply to Postgres for later insight.
 */

import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { aiConfig } from '@/config';
import { getChatInstructions } from '@/lib/knowledge';
import { persistMessages } from '@/lib/transcripts';
import { checkRateLimit, getClientId } from '@/lib/ratelimit';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const clientId = getClientId(req);
    const rl = await checkRateLimit('chat', clientId, 40, 60);
    if (!rl.success) {
      return new Response('Too many messages. Please slow down.', {
        status: 429,
      });
    }

    const body = await req.json();
    const { messages, conversationId } = body;

    const cleanedMessages = (messages || [])
      .filter((msg: any) => msg.id !== 'system')
      .map((msg: any) => ({ role: msg.role, content: msg.content }));

    const instructions = await getChatInstructions();
    const model = openai(aiConfig.model.name);

    const lastUser = [...cleanedMessages]
      .reverse()
      .find((m: any) => m.role === 'user');

    const result = await streamText({
      model,
      system: instructions,
      messages: convertToCoreMessages(cleanedMessages),
      temperature: aiConfig.model.temperature,
      maxTokens: aiConfig.model.maxTokens,
      onFinish: async ({ text }) => {
        // Best-effort persistence; never blocks or fails the response.
        await persistMessages(conversationId ?? null, 'text', [
          ...(lastUser ? [{ role: 'user', content: String(lastUser.content) }] : []),
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
