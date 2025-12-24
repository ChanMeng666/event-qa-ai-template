import { NextResponse } from 'next/server';
import { updateVoteInNotion } from '@/lib/notion-faq';

interface VoteRequest {
  questionId: string;
  voteType: 'up' | 'down';
  previousVote: 'up' | 'down' | null;
}

export async function POST(request: Request) {
  try {
    // Check if Notion is configured
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_FAQ_DATABASE_ID) {
      return NextResponse.json({
        success: false,
        message: 'Notion is not configured',
      }, { status: 503 });
    }

    const body: VoteRequest = await request.json();
    const { questionId, voteType, previousVote } = body;

    // Validate input
    if (!questionId || !voteType) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: questionId and voteType',
      }, { status: 400 });
    }

    if (voteType !== 'up' && voteType !== 'down') {
      return NextResponse.json({
        success: false,
        message: 'Invalid voteType: must be "up" or "down"',
      }, { status: 400 });
    }

    const result = await updateVoteInNotion(questionId, voteType, previousVote);

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Question not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}
