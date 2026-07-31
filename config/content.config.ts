/**
 * Content Configuration
 *
 * Static content for the single-page voice agent:
 * - Suggested prompts shown around the orb to help users start
 *
 * Preset questions and testimonials are no longer used by the single-page
 * experience and are kept empty to preserve the configuration shape.
 */

import type {
  ContentConfig,
  PresetQuestion,
  Testimonial,
  ChatSuggestion,
  QuestionCategory,
  TestimonialRole,
} from './types';

// ============================================================================
// Preset FAQ Questions (unused in the single-page experience)
// ============================================================================

// The single page renders only chatSuggestions - nothing reads presetQuestions,
// and the agent answers from config/knowledge.config.ts (the single source of
// truth). A hand-written Q&A list here would be a second, silently drifting
// copy of the same facts, so it is kept empty; the type and the ContentConfig
// shape stay for template users who want the FAQ surface back.
const presetQuestions: PresetQuestion[] = [];

// ============================================================================
// Testimonials (unused in the single-page experience)
// ============================================================================

const testimonials: Testimonial[] = [];

// ============================================================================
// Suggested Prompts (shown around the orb)
// ============================================================================

// Only the first three render around the orb (see components/agent/voice-agent.tsx),
// so the top three carry the highest-value on-the-day questions.
const chatSuggestions: ChatSuggestion[] = [
  { icon: 'Calendar', text: "What's the schedule for each day?", category: 'Schedule' },
  { icon: 'MapPin', text: 'Which rooms are we in, and where do I go?', category: 'Venue' },
  { icon: 'Users', text: 'I have no team - can I still join?', category: 'Teams' },
  { icon: 'HeartHandshake', text: 'Who are the mentors?', category: 'Mentors' },
  { icon: 'Lightbulb', text: 'What are the challenge themes?', category: 'Themes' },
  { icon: 'Award', text: 'Who are the judges?', category: 'Judges' },
  { icon: 'Target', text: 'How are pitches scored?', category: 'Judging' },
  { icon: 'Trophy', text: 'What are the prizes?', category: 'Prizes' },
  { icon: 'Ticket', text: 'How do I register?', category: 'Register' },
];

// ============================================================================
// Category and Role Definitions
// ============================================================================

const categories: Record<QuestionCategory, string> = {
  'event-info': 'Event Information',
  teams: 'Team Formation',
  technical: 'Technical Details',
  schedule: 'Schedule & Timeline',
  mentors: 'Mentors & Support',
  awards: 'Judging & Awards',
  logistics: 'Logistics & Preparation',
  general: 'General Questions',
};

const roles: Record<TestimonialRole, { display: string; badgeColor: string }> = {
  mentor: { display: 'Mentor', badgeColor: 'bg-blue-50 text-blue-600' },
  judge: { display: 'Judge', badgeColor: 'bg-purple-50 text-purple-600' },
  organizer: { display: 'Organizer', badgeColor: 'bg-green-50 text-green-600' },
};

// ============================================================================
// Export Configuration
// ============================================================================

export const contentConfig: ContentConfig = {
  presetQuestions,
  testimonials,
  chatSuggestions,
  categories,
  roles,
};
