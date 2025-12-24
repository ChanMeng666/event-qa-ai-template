import { NextResponse } from 'next/server';
import { incrementViewInNotion } from '@/lib/notion-faq';

interface ViewRequest {
  questionId: string;
}

export async function POST(request: Request) {
  try {
    // Check if Notion is configured
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_FAQ_DATABASE_ID) {
      // Silently succeed if Notion is not configured
      return NextResponse.json({
        success: true,
        message: 'View recorded (local only)',
      });
    }

    const body: ViewRequest = await request.json();
    const { questionId } = body;

    // Validate input
    if (!questionId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required field: questionId',
      }, { status: 400 });
    }

    const result = await incrementViewInNotion(questionId);

    if (!result) {
      // Don't return error for view tracking - just log it
      console.warn(`Failed to record view for questionId: ${questionId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'View recorded successfully',
    });
  } catch (error) {
    console.error('Error recording view:', error);
    // Return success anyway - view tracking should not block UX
    return NextResponse.json({
      success: true,
      message: 'View recording attempted',
    });
  }
}
