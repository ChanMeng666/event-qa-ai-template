import { PresetQuestion, FAQStats } from '@/components/chatbot/types';

const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Fetch helper for Notion REST API (uses native fetch, compatible with Cloudflare Workers)
async function notionFetch(endpoint: string, options: { method?: string; body?: unknown } = {}) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error('NOTION_TOKEN environment variable is not set');
  }

  const res = await fetch(`${NOTION_API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Notion API error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

// Helper to safely get property values
function getTitle(props: Record<string, unknown>, key: string): string {
  const prop = props[key] as { title?: Array<{ plain_text: string }> } | undefined;
  return prop?.title?.[0]?.plain_text || '';
}

function getRichText(props: Record<string, unknown>, key: string): string {
  const prop = props[key] as { rich_text?: Array<{ plain_text: string }> } | undefined;
  return prop?.rich_text?.[0]?.plain_text || '';
}

function getSelect(props: Record<string, unknown>, key: string): string {
  const prop = props[key] as { select?: { name: string } | null } | undefined;
  return prop?.select?.name || '';
}

function getNumber(props: Record<string, unknown>, key: string): number {
  const prop = props[key] as { number?: number | null } | undefined;
  return prop?.number || 0;
}

// Fetch all active FAQ questions with stats from Notion
export async function fetchFAQQuestionsFromNotion(): Promise<{
  questions: PresetQuestion[];
  stats: FAQStats[];
}> {
  const databaseId = process.env.NOTION_FAQ_DATABASE_ID;

  if (!databaseId) {
    throw new Error('NOTION_FAQ_DATABASE_ID environment variable is not set');
  }

  const response = await notionFetch(`/databases/${databaseId}/query`, {
    method: 'POST',
    body: {
      filter: {
        property: 'IsActive',
        checkbox: {
          equals: true,
        },
      },
    },
  });

  const questions: PresetQuestion[] = [];
  const stats: FAQStats[] = [];

  for (const page of response.results) {
    if (!page.properties) continue;

    const props = page.properties as Record<string, unknown>;
    const questionId = getRichText(props, 'QuestionID') || page.id;
    const upVotes = getNumber(props, 'UpVotes');
    const downVotes = getNumber(props, 'DownVotes');

    questions.push({
      id: questionId,
      question: getTitle(props, 'Title'),
      answer: getRichText(props, 'Answer'),
      category: (getSelect(props, 'Category') as PresetQuestion['category']) || 'general',
    });

    stats.push({
      questionId,
      upVotes,
      downVotes,
      totalViews: getNumber(props, 'TotalViews'),
      score: upVotes - downVotes,
    });
  }

  return { questions, stats };
}

// Find a page by QuestionID
async function findPageByQuestionId(questionId: string): Promise<string | null> {
  const databaseId = process.env.NOTION_FAQ_DATABASE_ID;

  if (!databaseId) {
    throw new Error('NOTION_FAQ_DATABASE_ID environment variable is not set');
  }

  const response = await notionFetch(`/databases/${databaseId}/query`, {
    method: 'POST',
    body: {
      filter: {
        property: 'QuestionID',
        rich_text: {
          equals: questionId,
        },
      },
    },
  });

  if (response.results.length > 0) {
    return response.results[0].id;
  }

  return null;
}

// Update vote counts for a question
export async function updateVoteInNotion(
  questionId: string,
  voteType: 'up' | 'down',
  previousVote: 'up' | 'down' | null
): Promise<boolean> {
  const pageId = await findPageByQuestionId(questionId);
  if (!pageId) {
    console.error(`Page not found for questionId: ${questionId}`);
    return false;
  }

  // Get current vote counts
  const page = await notionFetch(`/pages/${pageId}`);
  if (!page.properties) return false;

  const props = page.properties as Record<string, unknown>;
  let upVotes = getNumber(props, 'UpVotes');
  let downVotes = getNumber(props, 'DownVotes');

  // Remove previous vote if exists
  if (previousVote === 'up') upVotes--;
  if (previousVote === 'down') downVotes--;

  // Add new vote if different from previous
  if (previousVote !== voteType) {
    if (voteType === 'up') upVotes++;
    if (voteType === 'down') downVotes++;
  }

  // Update the page
  await notionFetch(`/pages/${pageId}`, {
    method: 'PATCH',
    body: {
      properties: {
        UpVotes: { number: Math.max(0, upVotes) },
        DownVotes: { number: Math.max(0, downVotes) },
      },
    },
  });

  return true;
}

// Increment view count for a question
export async function incrementViewInNotion(questionId: string): Promise<boolean> {
  const pageId = await findPageByQuestionId(questionId);
  if (!pageId) {
    console.error(`Page not found for questionId: ${questionId}`);
    return false;
  }

  // Get current view count
  const page = await notionFetch(`/pages/${pageId}`);
  if (!page.properties) return false;

  const props = page.properties as Record<string, unknown>;
  const currentViews = getNumber(props, 'TotalViews');

  // Update the page
  await notionFetch(`/pages/${pageId}`, {
    method: 'PATCH',
    body: {
      properties: {
        TotalViews: { number: currentViews + 1 },
      },
    },
  });

  return true;
}

// Client-side cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let questionsCache: CacheEntry<PresetQuestion[]> | null = null;
let statsCache: CacheEntry<FAQStats[]> | null = null;

// Client-side fetch functions with caching
export async function fetchFAQQuestions(): Promise<PresetQuestion[]> {
  if (questionsCache && Date.now() - questionsCache.timestamp < CACHE_DURATION) {
    return questionsCache.data;
  }

  const response = await fetch('/api/faq/questions');
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch questions');
  }

  questionsCache = { data: result.questions, timestamp: Date.now() };
  statsCache = { data: result.stats, timestamp: Date.now() };

  return result.questions;
}

export async function fetchFAQStats(): Promise<FAQStats[]> {
  if (statsCache && Date.now() - statsCache.timestamp < CACHE_DURATION) {
    return statsCache.data;
  }

  const response = await fetch('/api/faq/questions');
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch stats');
  }

  questionsCache = { data: result.questions, timestamp: Date.now() };
  statsCache = { data: result.stats, timestamp: Date.now() };

  return result.stats;
}

export async function submitVote(
  questionId: string,
  voteType: 'up' | 'down',
  previousVote: 'up' | 'down' | null
): Promise<boolean> {
  const response = await fetch('/api/faq/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, voteType, previousVote }),
  });

  // Invalidate stats cache after voting
  statsCache = null;

  return response.ok;
}

export async function recordView(questionId: string): Promise<boolean> {
  const response = await fetch('/api/faq/view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId }),
  });

  return response.ok;
}

// Clear all caches
export function clearFAQCache(): void {
  questionsCache = null;
  statsCache = null;
}
