/**
 * Content Configuration
 *
 * This file contains all static content for the event Q&A AI:
 * - Preset FAQ questions (fallback when Notion not configured)
 * - Testimonials from mentors, judges, and organizers
 * - Chat suggestions shown before first message
 *
 * Modify this file to customize your event's content.
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
// Preset FAQ Questions
// ============================================================================

/**
 * These questions are used as fallback when Notion is not configured,
 * and as the initial content for new deployments.
 */
const presetQuestions: PresetQuestion[] = [
  {
    id: 'event-dates',
    category: 'event-info',
    question: 'When and where is the AI Hackathon Festival 2025?',
    answer:
      'The AI Hackathon Festival 2025 takes place on Friday, August 15 to Saturday, August 16, 2025, at AUT City Campus, WG Building (55 Wellesley Street East, Auckland Central, Auckland 1010). Friday events are in WG308, with additional rooms in WA and WG buildings on Saturday.',
  },
  {
    id: 'event-theme',
    category: 'event-info',
    question: 'What is the theme and objective of the hackathon?',
    answer:
      'The theme focuses on solving problems related to the United Nations Sustainable Development Goals (SDGs), such as reducing poverty or improving lives and skills. The objective is to develop strong, evidence-supported conceptual ideas for AI-driven solutions. Due to the short timeframe, a fully functional prototype is not expected.',
  },
  {
    id: 'team-formation',
    category: 'teams',
    question: 'How does team formation work?',
    answer:
      'Approximately 11-12 teams will be formed with 3-6 members each. Seven teams have already been pre-formed. For those without a team, a "speed dating on drugs" style session will be held on Friday evening. Ideal teams mix three personas: The Hacker (technical skills), The Hipster (vision/passion), and The Hustler (time management/motivation).',
  },
  {
    id: 'ai-definition',
    category: 'technical',
    question: 'What counts as "AI" for this hackathon?',
    answer:
      'For this event, "AI" can range from a data-driven prediction tool to a recognition app. The focus is on the data-centric concept. Teams can use mock or synthetic datasets if finding a real one is too time-consuming. The emphasis is on demonstrating the AI concept rather than building a fully functional system.',
  },
  {
    id: 'schedule-overview',
    category: 'schedule',
    question: 'What is the detailed schedule?',
    answer:
      'Friday (Aug 15): 5:00-8:00 PM - Registration, networking, dinner, team formation, and strategy planning. Saturday (Aug 16): 7:30 AM arrival, 8:10 AM-12:14 PM team work, 1:15-2:00 PM pitch practice, 3:30-6:30 PM final presentations, 7:00-7:30 PM winner announcements. Note: Venue closes at 8:00 PM Friday, but teams can continue working remotely.',
  },
  {
    id: 'mentor-help',
    category: 'mentors',
    question: 'How can I get help from mentors?',
    answer:
      'Use the official Discord channel to request help from specific mentors. Mentors will actively circulate among teams, check in every two hours, and provide guidance on technical, business, and presentation aspects. They are available throughout Saturday and will help with pitch practice in the afternoon.',
  },
  {
    id: 'judging-criteria',
    category: 'awards',
    question: 'What are the judging criteria and prizes?',
    answer:
      'Judging is based on: Problem/solution clarity, technical feasibility, potential impact, and meeting the innovation brief (SDGs + AI + technology). Prizes include: $250 for venue winner, free AI Summit entry ($1,499 value) for top 4 national finalists, $1,000 + ArcGIS licenses for national winner, and $5,000 for national Agentic AI winner.',
  },
  {
    id: 'what-to-bring',
    category: 'logistics',
    question: 'What should I bring to the hackathon?',
    answer:
      'Bring your laptop, charger, and any other hardware you might need. Also bring a water bottle. Meals are provided: dinner on Friday evening, and coffee, tea, lunch, and afternoon tea on Saturday. Make sure your dietary requirements are registered. You must wear your lanyard/visitor pass at all times and stay within designated areas.',
  },
];

// ============================================================================
// Testimonials
// ============================================================================

/**
 * Testimonials from mentors, judges, and organizers.
 * These are displayed on the testimonials page.
 */
const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "The AI Hackathon Festival 2025 represents a groundbreaking opportunity for innovators to push the boundaries of what's possible with AI while addressing real-world challenges.",
    author: 'Dr. Sarah Chen',
    role: 'mentor',
    organization: 'AUT School of Computer Science',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    quote:
      'Seeing participants tackle the UN Sustainable Development Goals with AI solutions gives me hope for our future. The creativity and technical skill on display is truly inspiring.',
    author: 'James Mitchell',
    role: 'judge',
    organization: 'AI Forum New Zealand',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    quote:
      "This hackathon is more than a competition—it's a launchpad for the next generation of AI innovators in New Zealand and beyond.",
    author: 'Emma Williams',
    role: 'organizer',
    organization: 'She Sharp',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    quote:
      "The mentorship opportunities here are unparalleled. We're not just teaching technical skills—we're nurturing future leaders in responsible AI development.",
    author: 'Dr. Michael Torres',
    role: 'mentor',
    organization: 'Microsoft Research NZ',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '5',
    quote:
      "What sets this hackathon apart is the focus on ethical AI and sustainable solutions. Participants don't just build—they think deeply about impact.",
    author: 'Lisa Park',
    role: 'judge',
    organization: 'Tech Futures Lab',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '6',
    quote:
      "The energy and innovation at this event is incredible. Every year, I'm amazed by the fresh perspectives participants bring to complex problems.",
    author: 'David Chen',
    role: 'mentor',
    organization: 'Google Cloud NZ',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '7',
    quote:
      'As an organizer, watching teams go from an idea to a working prototype in just 48 hours never gets old. The spirit of collaboration here is infectious.',
    author: 'Rachel Thompson',
    role: 'organizer',
    organization: 'AUT Ventures',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '8',
    quote:
      'The quality of AI solutions addressing climate change and sustainability has been exceptional. These young innovators are solving problems that matter.',
    author: 'Professor Alan Wright',
    role: 'judge',
    organization: 'Auckland AI Institute',
    avatarUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '9',
    quote:
      "This hackathon has become a cornerstone event for New Zealand's AI community. It's where talent meets opportunity and ideas become reality.",
    author: 'Sophie Anderson',
    role: 'mentor',
    organization: 'AWS New Zealand',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '10',
    quote:
      'Every participant leaves with more than just new skills—they leave with connections, confidence, and a clearer vision for their future in tech.',
    author: 'Marcus Lee',
    role: 'organizer',
    organization: 'AI Forum New Zealand',
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '11',
    quote:
      'The diversity of participants—from students to industry professionals—creates an incredible learning environment for everyone involved.',
    author: 'Dr. Priya Sharma',
    role: 'mentor',
    organization: 'University of Auckland',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '12',
    quote:
      'Judging this hackathon is both challenging and rewarding. The level of innovation continues to exceed our expectations year after year.',
    author: 'Thomas Nguyen',
    role: 'judge',
    organization: 'Callaghan Innovation',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '13',
    quote:
      'She Sharp is proud to support events that bring diverse voices into AI development. Representation matters in building technology for everyone.',
    author: 'Nina Roberts',
    role: 'organizer',
    organization: 'She Sharp',
    avatarUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '14',
    quote:
      'The practical application of AI to UN SDGs shows that technology can be a powerful force for good. These teams understand that responsibility.',
    author: 'Dr. Robert Kim',
    role: 'judge',
    organization: 'Ministry of Business Innovation & Employment',
    avatarUrl:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '15',
    quote:
      'Mentoring at this hackathon reminds me why I got into tech. The enthusiasm and creativity of these participants is truly energizing.',
    author: 'Jennifer Walsh',
    role: 'mentor',
    organization: 'Datacom',
    avatarUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
  },
];

// ============================================================================
// Chat Suggestions
// ============================================================================

/**
 * Suggestions shown in the chat interface before the first message.
 * Icon names should match Lucide React icon names.
 */
const chatSuggestions: ChatSuggestion[] = [
  {
    icon: 'Calendar',
    text: "What's the schedule for the hackathon?",
    category: 'Schedule',
  },
  {
    icon: 'Users',
    text: 'How do I form a team?',
    category: 'Teams',
  },
  {
    icon: 'Award',
    text: 'What are the judging criteria?',
    category: 'Awards',
  },
  {
    icon: 'HelpCircle',
    text: 'What should I bring to the event?',
    category: 'Logistics',
  },
  {
    icon: 'MessageCircle',
    text: 'How can I get help from mentors?',
    category: 'Support',
  },
];

// ============================================================================
// Category and Role Definitions
// ============================================================================

/**
 * Display names for question categories.
 */
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

/**
 * Role definitions for testimonials with display names and badge colors.
 */
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
