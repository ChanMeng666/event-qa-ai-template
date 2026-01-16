import { google } from '@ai-sdk/google';
import { convertToCoreMessages, streamText } from 'ai';
import { getSystemPrompt, aiConfig } from '@/config';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Clean messages and filter system messages
    const cleanedMessages = messages
      .filter((msg: any) => msg.id !== 'system')
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

    // Use model from configuration
    const model = google(aiConfig.model.name);

    const result = await streamText({
      model,
      system: getSystemPrompt(),
      messages: convertToCoreMessages(cleanedMessages),
      temperature: aiConfig.model.temperature,
      maxTokens: aiConfig.model.maxTokens,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
