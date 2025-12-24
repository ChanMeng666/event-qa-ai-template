import { NextResponse } from 'next/server';
import { fetchFAQQuestionsFromNotion } from '@/lib/notion-faq';
import { presetQuestions } from '@/components/chatbot/preset-questions';

export async function GET() {
  try {
    // Check if Notion is configured
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_FAQ_DATABASE_ID) {
      // Fallback to static questions with empty stats
      const stats = presetQuestions.map(q => ({
        questionId: q.id,
        upVotes: 0,
        downVotes: 0,
        totalViews: 0,
        score: 0,
      }));

      return NextResponse.json({
        success: true,
        questions: presetQuestions,
        stats,
        source: 'static',
        timestamp: Date.now(),
      });
    }

    const { questions, stats } = await fetchFAQQuestionsFromNotion();

    return NextResponse.json({
      success: true,
      questions,
      stats,
      source: 'notion',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching FAQ questions:', error);

    // Fallback to static questions on error
    const stats = presetQuestions.map(q => ({
      questionId: q.id,
      upVotes: 0,
      downVotes: 0,
      totalViews: 0,
      score: 0,
    }));

    return NextResponse.json({
      success: true,
      questions: presetQuestions,
      stats,
      source: 'static-fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    });
  }
}
