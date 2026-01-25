# Event Q&A AI Template - Claude Code Guidelines

## Project Overview

This is a **reusable template** for creating AI-powered Q&A assistants for events. Built with Next.js 16, React, and TypeScript, featuring a full-screen chat interface powered by OpenAI GPT-4o-mini and a community-driven FAQ voting system backed by Notion database.

**Template Documentation**: See **[docs/TEMPLATE-SETUP.md](docs/TEMPLATE-SETUP.md)** for quick start guide.

**Current Example**: AI Hackathon Festival 2025 (New Zealand)

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (customized) + Radix UI primitives
- **Animation**: Framer Motion v12
- **AI**: OpenAI GPT-4o-mini via Vercel AI SDK v4.3
- **Backend**: Notion API (@notionhq/client ^2.3.0) for FAQ voting & statistics

## Configuration System

This template uses a centralized configuration system. **All event-specific content is in the `config/` directory**:

```
config/
├── index.ts              # Unified exports
├── types.ts              # TypeScript type definitions
├── site.config.ts        # Event info (name, dates, venue, organizers)
├── ai.config.ts          # AI system prompt and model settings
├── content.config.ts     # FAQ, testimonials, chat suggestions
└── branding.config.ts    # Logos, developer credits
```

### Key Configuration Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `site.config.ts` | Event name, dates, venue, organizers, SEO | Setting up new event |
| `ai.config.ts` | AI knowledge base, response style | Customizing AI behavior |
| `content.config.ts` | FAQ questions, testimonials, suggestions | Adding content |
| `branding.config.ts` | Logos, developer info, project links | Branding changes |

### Using Configuration in Components

```typescript
import { siteConfig, brandingConfig, contentConfig, aiConfig } from '@/config';

// Access event info
const eventName = siteConfig.name;

// Access logos
const logo = brandingConfig.logos.main;

// Access FAQ questions
const questions = contentConfig.presetQuestions;
```

## UI Design System

**IMPORTANT**: This project uses a custom "Stagger" design system. Before making any UI changes, review the full design documentation:

📖 **[docs/UI-DESIGN-SYSTEM.md](docs/UI-DESIGN-SYSTEM.md)**

### Critical Design Rules

1. **NO ROUNDED CORNERS** - Do not use `rounded-*` classes. All elements should have sharp corners.

2. **STAGGER SHADOWS** - Use the custom stagger shadow system instead of standard shadows:
   - `shadow-stagger-sm` - Small elements
   - `shadow-stagger` - Default cards/containers
   - `shadow-stagger-lg` - Modals/dialogs
   - `shadow-stagger-primary` - Primary color shadows
   - For blue backgrounds: `shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]`

3. **BORDER WIDTH** - Always use `border-2` for visible borders, not `border`.

4. **CLIP-PATH + SHADOW CONFLICT** - `clip-path` and `box-shadow` CANNOT be used together. The clip-path will clip the shadow making it invisible. Choose one or use a wrapper element approach.

5. **BLUE GRADIENT BACKGROUNDS** - For sections like FAQ and modals:
   ```tsx
   className="bg-gradient-to-br from-primary via-primary to-blue-700"
   ```

6. **WHITE/OPACITY ON BLUE** - Use `text-white/90`, `border-white/30`, `bg-white/10` patterns on blue backgrounds.

### Quick Reference

```tsx
// Standard card
className="bg-card border-2 border-border shadow-stagger"

// Card on blue background
className="bg-white/95 border-2 border-white/50 shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]"

// Modal container
className="bg-gradient-to-br from-primary to-blue-700 border-2 border-white/20 shadow-stagger-lg-primary clip-corner-sm"

// Button on blue background (active)
className="bg-white text-primary border-white"

// Button on blue background (inactive)
className="border-white/30 text-white/80 bg-transparent hover:bg-white/20"
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── chat/            # AI chat streaming endpoint (OpenAI)
│   │   └── faq/             # FAQ endpoints
│   │       ├── questions/   # GET - Fetch FAQ with stats
│   │       ├── vote/        # POST - Record up/down votes
│   │       └── view/        # POST - Track view counts
│   ├── chat/                # Main chat page (70/30 layout)
│   ├── testimonials/        # Testimonials page
│   └── page.tsx             # Home/landing page
├── config/                  # ⭐ TEMPLATE CONFIGURATION
│   ├── index.ts             # Unified exports
│   ├── types.ts             # Type definitions
│   ├── site.config.ts       # Event information
│   ├── ai.config.ts         # AI system prompt
│   ├── content.config.ts    # FAQ, testimonials, suggestions
│   └── branding.config.ts   # Logos, credits
├── components/
│   ├── chat/                # EmbeddedChat, ChatSuggestions
│   ├── chatbot/             # Chatbot, ChatMessage, QuickActions, types
│   ├── faq/                 # FAQList, FAQCard (voting UI)
│   ├── layout/              # FloatingInfoButton, InfoModal, FooterContent
│   └── ui/                  # shadcn/ui base components
├── docs/                    # Documentation
│   ├── TEMPLATE-SETUP.md    # Quick start guide
│   ├── UI-DESIGN-SYSTEM.md  # Full UI design guide
│   └── NOTION-INTEGRATION.md # Notion backend documentation
├── hooks/
│   ├── use-faq-voting.ts    # FAQ voting logic with Notion sync
│   └── use-scroll-direction.ts  # Header visibility on scroll
├── lib/
│   ├── notion-faq.ts        # Notion client & FAQ operations
│   ├── testimonials-data.ts # Wrapper for config testimonials
│   └── utils.ts             # cn() utility function
└── public/images/           # Static assets
    ├── event/               # Event logos
    ├── organizers/          # Organizer logos
    └── developer/           # Developer logo (optional)
```

## Key Files

### Template Configuration
- `config/site.config.ts` - Event name, dates, venue, organizers
- `config/ai.config.ts` - AI system prompt generator
- `config/content.config.ts` - FAQ, testimonials, chat suggestions
- `config/branding.config.ts` - Logos, developer credits

### Core Application
- `app/globals.css` - CSS variables, stagger shadow utilities
- `tailwind.config.js` - Tailwind configuration with stagger shadows
- `components/ui/button.tsx` - Button variants including stagger styles

### AI Chat
- `app/api/chat/route.ts` - OpenAI streaming endpoint (uses `aiConfig`)
- `components/chat/embedded-chat.tsx` - Full-screen chat interface
- `components/chatbot/chat-message.tsx` - Markdown message renderer

### Notion Integration
- `lib/notion-faq.ts` - Notion client, CRUD operations, caching
- `hooks/use-faq-voting.ts` - Client-side voting with optimistic updates
- `components/chatbot/types.ts` - TypeScript interfaces (FAQStats, FAQVote, etc.)

## Development Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
```

## Environment Variables

Required in `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NOTION_TOKEN` | Notion Integration token | Yes (for FAQ) |
| `NOTION_FAQ_DATABASE_ID` | Notion FAQ database ID | Yes (for FAQ) |

> **Note**: If Notion is not configured, the app falls back to static preset questions from `config/content.config.ts`.

## Architecture Overview

### Data Flow

```
Chat Flow:
User Input → EmbeddedChat → /api/chat → OpenAI GPT-4o-mini → Streaming Response
                                ↓
                         config/ai.config.ts (system prompt)

FAQ Flow:
Page Load → useFAQVoting → /api/faq/questions → Notion DB (or static fallback)
                                                      ↓
                                         config/content.config.ts (fallback)

Configuration Flow:
config/*.config.ts → Components import from @/config → Dynamic content
```

### Key Features
- **AI Chat**: Real-time streaming, 50-message history in localStorage
- **FAQ Voting**: Upvote/downvote with Notion persistence, 5-min client cache
- **Responsive**: Desktop 70/30 split layout, mobile tabbed interface
- **Fallback**: Static questions when Notion unavailable
- **Configurable**: All event-specific content in `config/` directory

For detailed Notion architecture, see: [docs/NOTION-INTEGRATION.md](docs/NOTION-INTEGRATION.md)

## Best Practices

1. **Read TEMPLATE-SETUP.md** first when setting up a new event
2. **Edit config files** instead of hardcoding event information
3. **Always read UI-DESIGN-SYSTEM.md** before making visual changes
4. **Read NOTION-INTEGRATION.md** before modifying FAQ/voting features
5. Use existing component patterns from the codebase
6. Maintain the stagger shadow aesthetic throughout
7. Test on both desktop and mobile layouts
8. Use Framer Motion for animations following existing patterns
