/**
 * Configuration Type Definitions
 *
 * This file defines all TypeScript interfaces for the template configuration system.
 * Users should refer to these types when customizing their event Q&A AI.
 */

// ============================================================================
// Site Configuration Types
// ============================================================================

export interface Organizer {
  /** Full organization name */
  name: string;
  /** Abbreviated name for compact displays */
  shortName: string;
  /** Organization website URL */
  url: string;
  /** Path to organization logo (relative to /public) */
  logo: string;
}

export interface SiteConfig {
  /** Full event name */
  name: string;
  /** Abbreviated event name for compact displays */
  shortName: string;
  /** Event tagline (e.g., "Interactive Assistant") */
  tagline: string;
  /** Event description for SEO and introductions */
  description: string;

  /** Event date information */
  dates: {
    /** Start date in ISO format (YYYY-MM-DD) */
    start: string;
    /** End date in ISO format (YYYY-MM-DD) */
    end: string;
    /** Human-readable date format for display (e.g., "Aug 15-16, 2025") */
    displayFormat: string;
  };

  /** Venue information */
  venue: {
    /** Venue name */
    name: string;
    /** Building name or identifier */
    building: string;
    /** Full street address */
    address: string;
    /** City */
    city: string;
    /** Country */
    country: string;
    /** Google Maps embed URL for the venue */
    mapEmbed: string;
  };

  /** List of event organizers/sponsors */
  organizers: Organizer[];

  /** Optional list of supporting partners (shown alongside organizers) */
  partners?: Organizer[];

  /** Event theme/focus */
  theme: {
    /** Theme name */
    name: string;
    /** Theme description/objectives */
    description: string;
  };

  /** External links */
  links: {
    /** Main event website */
    website?: string;
    /** Discord server invite */
    discord?: string;
    /** Registration page */
    registration?: string;
    /** GitHub repository */
    github?: string;
  };

  /** SEO metadata */
  seo: {
    /** Keywords for search engines */
    keywords: string[];
    /** Authors/creators */
    authors: { name: string }[];
    /** OpenGraph type (usually "website") */
    ogType: string;
  };
}

// ============================================================================
// AI Configuration Types
// ============================================================================

export interface AIConfig {
  /** AI model settings */
  model: {
    /** Model identifier (e.g., "gemini-2.5-flash") */
    name: string;
    /** Response randomness (0.0 - 1.0) */
    temperature: number;
    /** Maximum tokens in response */
    maxTokens: number;
  };

  /** Auto-generated system prompt based on site config */
  systemPrompt: string;

  /** Optional custom system prompt to override the generated one */
  customSystemPrompt?: string;

  /** Additional event-specific context to append to system prompt */
  additionalContext: string;
}

// ============================================================================
// Knowledge Configuration Types
// ============================================================================

export interface KnowledgeSection {
  /** Section heading (rendered as an H2 in the knowledge base) */
  section: string;
  /** Section body (markdown-friendly plain text) */
  content: string;
  /** Sort order (ascending); numbered in steps of 10 */
  sort: number;
}

// ============================================================================
// People Configuration Types
// ============================================================================

/** How a person is involved in this venue's event. */
export type PersonRole = 'judge' | 'mentor';

/**
 * Which kind of help a mentor offers, as stated on the venue mentor roster.
 * 'both' and 'all' are kept distinct because the roster does.
 */
export type MentorDomain = 'business' | 'technical' | 'both' | 'all';

export interface Person {
  /** Full display name, exactly as it should be written and spoken. */
  name: string;
  /** Involvement at the AUT City Campus venue. */
  role: PersonRole;
  /** Employer, university, or affiliation. Use '' for independent. */
  organisation: string;
  /** Job title, or for mentors their area of expertise. */
  title?: string;
  /**
   * One-sentence public bio or credential the agent may share. Rendered only
   * when renderPeople is called with includeBio: true, so long bios do not
   * silently inflate the system prompt.
   */
  bio?: string;
  /**
   * Mentors only: the kind of help they offer, from the venue mentor roster.
   * Rendered as a short phrase after the name line.
   */
  domain?: MentorDomain;
  /**
   * Mentors only: which sessions the person is on site for, written out in
   * full (e.g. 'Friday, Saturday morning and Saturday afternoon') so the voice
   * agent reads it naturally.
   */
  availability?: string;
  /** Sort order within the person's group; numbered in steps of 10. */
  sort: number;
}

// ============================================================================
// Content Configuration Types
// ============================================================================

/** FAQ question categories */
export type QuestionCategory =
  | 'event-info'
  | 'teams'
  | 'technical'
  | 'schedule'
  | 'mentors'
  | 'awards'
  | 'logistics'
  | 'general';

export interface PresetQuestion {
  /** Unique identifier */
  id: string;
  /** Question category for filtering */
  category: QuestionCategory;
  /** The question text */
  question: string;
  /** The answer text */
  answer: string;
}

/** Testimonial roles */
export type TestimonialRole = 'mentor' | 'judge' | 'organizer';

export interface Testimonial {
  /** Unique identifier */
  id: string;
  /** Quote text */
  quote: string;
  /** Person's name */
  author: string;
  /** Person's role */
  role: TestimonialRole;
  /** Organization/affiliation */
  organization: string;
  /** Avatar image URL */
  avatarUrl: string;
}

export interface ChatSuggestion {
  /** Lucide icon name (e.g., "Calendar", "Users") */
  icon: string;
  /** Suggestion text to display */
  text: string;
  /** Category label for the suggestion */
  category: string;
}

export interface RoleDefinition {
  /** Display name for the role */
  display: string;
  /** Tailwind CSS classes for the badge */
  badgeColor: string;
}

export interface ContentConfig {
  /** Preset FAQ questions (fallback when Notion not configured) */
  presetQuestions: PresetQuestion[];

  /** Testimonials from mentors, judges, organizers */
  testimonials: Testimonial[];

  /** Chat suggestions shown before first message */
  chatSuggestions: ChatSuggestion[];

  /** Category display names */
  categories: Record<QuestionCategory, string>;

  /** Role definitions for testimonials */
  roles: Record<TestimonialRole, RoleDefinition>;
}

// ============================================================================
// Branding Configuration Types
// ============================================================================

export interface DeveloperInfo {
  /** Developer name */
  name: string;
  /** Developer website/profile URL */
  url: string;
  /** Short description/title */
  description: string;
  /** Path to developer logo (relative to /public) */
  logo: string;
}

export interface BrandingConfig {
  /** Logo paths */
  logos: {
    /** Main logo for headers and navigation */
    main: string;
    /** Full logo for landing pages */
    full: string;
    /** Favicon */
    favicon: string;
  };

  /** Developer credit information (optional) */
  developer?: DeveloperInfo;

  /** Whether to show developer section in footer */
  showDeveloper: boolean;

  /** Project repository and deployment links */
  project: {
    /** GitHub repository URL */
    repository: string;
    /** Live deployment URL */
    deployment: string;
  };
}

// ============================================================================
// Combined Configuration Type
// ============================================================================

export interface SiteConfiguration {
  site: SiteConfig;
  ai: AIConfig;
  content: ContentConfig;
  branding: BrandingConfig;
}
