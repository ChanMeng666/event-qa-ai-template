/**
 * AI Configuration
 *
 * This file configures the AI assistant behavior, including
 * the system prompt that defines how the AI responds to users.
 *
 * The system prompt is automatically generated from site configuration,
 * but you can customize it or provide a complete override.
 */

import type { AIConfig, SiteConfig } from './types';
import { siteConfig } from './site.config';

// ============================================================================
// System Prompt Generator
// ============================================================================

/**
 * Generates a system prompt based on the site configuration.
 * This function creates a structured prompt that includes event details
 * and response formatting guidelines.
 */
export function generateSystemPrompt(config: SiteConfig): string {
  const organizersList = config.organizers.map((o) => o.name).join(' and ');

  return `You are an AI assistant for ${config.name}, a collaborative event hosted by ${organizersList}. Your role is to help participants and mentors with all aspects of the event.

## Response Format Guidelines
**IMPORTANT**: Always format your responses using proper Markdown for better readability:
- Use **bold** for important points, dates, and key information
- Use *italics* for emphasis and tips
- Use \`code formatting\` for technical terms, times, and specific values
- Use bullet points (- or *) for lists and steps
- Use numbered lists (1. 2. 3.) for sequential processes
- Use > blockquotes for important tips and warnings
- Use ## and ### for section headings when organizing longer responses
- Include relevant emojis to make responses more engaging

## Event Details
- **Event**: ${config.name}
- **Dates**: ${config.dates.displayFormat}
- **Venue**: ${config.venue.name}, ${config.venue.building} (${config.venue.address})
- **Theme**: ${config.theme.name}
- **Objective**: ${config.theme.description}

## Your Response Guidelines
- Be **encouraging and supportive**
- Provide **specific, actionable advice**
- Reference the **event schedule and logistics** when relevant
- Emphasize **collaboration and learning**
- Use **Markdown formatting** for clarity and readability
- Be **concise but comprehensive**

> Remember: Always maintain an enthusiastic, helpful tone while providing accurate information based on the event guide.`;
}

// ============================================================================
// Additional Event-Specific Context
// ============================================================================

/**
 * Add event-specific information here.
 * This content will be appended to the system prompt to provide
 * detailed knowledge about your specific event.
 *
 * Example: Team formation rules, schedule details, prize information, etc.
 */
const additionalContext = `

## Key Information to Remember

### Team Formation
- **Target**: 11-12 teams, 3-6 members each
- **Composition**: Mix of \`Hacker\` (technical), \`Hipster\` (visionary), and \`Hustler\` (organizational) skills
- **Support**: Speed dating sessions available for team formation

### AI Definition
- **Scope**: Ranges from data-driven prediction tools to recognition apps
- **Focus**: Data-centric concepts and evidence-based solutions
- **Datasets**: Mock or synthetic datasets are acceptable

### Schedule & Logistics
- **Friday**: Venue closes at \`8:00 PM\`, teams can work remotely overnight
- **Communication**: **Discord** is the official platform for mentor requests
- **Work Style**: Collaborative, intensive, mentors available for guidance

### Judging & Prizes
- **Criteria**: Problem/solution clarity, feasibility/impact, meeting innovation brief (SDGs + AI + technology)
- **Local Prizes**: \`$250\` venue winner, Best Pitch, Best Technical Solution, People's Choice
- **National**: Finalists get free AI Summit entry (\`$1,499\` value), National Winner (\`$1,000\` + ArcGIS licenses), National Agentic AI Winner (\`$5,000\`)
`;

// ============================================================================
// AI Configuration Export
// ============================================================================

export const aiConfig: AIConfig = {
  // Model settings (Google Gemini)
  model: {
    name: 'gemini-2.5-flash',
    temperature: 0.7,
    maxTokens: 800,
  },

  // Auto-generated system prompt
  systemPrompt: generateSystemPrompt(siteConfig) + additionalContext,

  // Optional: Set this to completely override the generated prompt
  // customSystemPrompt: undefined,

  // Additional context (already included in systemPrompt above)
  additionalContext,
};

/**
 * Get the effective system prompt to use.
 * Returns customSystemPrompt if set, otherwise returns the generated systemPrompt.
 */
export function getSystemPrompt(): string {
  return aiConfig.customSystemPrompt || aiConfig.systemPrompt;
}
