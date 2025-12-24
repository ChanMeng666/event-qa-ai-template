# AI Hackathon Assistant 2025 - Claude Code Guidelines

## Project Overview

This is an AI-powered assistant for the AI Hackathon Festival 2025 event. Built with Next.js 16, React, and TypeScript, featuring a full-screen chat interface powered by Google Gemini 2.5 Flash and a community-driven FAQ voting system backed by Notion database.

For detailed Notion integration documentation, see: **[docs/NOTION-INTEGRATION.md](docs/NOTION-INTEGRATION.md)**

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (customized) + Radix UI primitives
- **Animation**: Framer Motion v12
- **AI**: Google Gemini 2.5 Flash via Vercel AI SDK v4.3
- **Backend**: Notion API (@notionhq/client ^2.3.0) for FAQ voting & statistics

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
│   │   ├── chat/            # AI chat streaming endpoint (Gemini)
│   │   └── faq/             # FAQ endpoints
│   │       ├── questions/   # GET - Fetch FAQ with stats
│   │       ├── vote/        # POST - Record up/down votes
│   │       └── view/        # POST - Track view counts
│   ├── chat/                # Main chat page (70/30 layout)
│   ├── testimonials/        # Testimonials page
│   └── page.tsx             # Home/landing page
├── components/
│   ├── chat/                # EmbeddedChat, ChatSuggestions
│   ├── chatbot/             # Chatbot, ChatMessage, QuickActions, types
│   ├── faq/                 # FAQList, FAQCard (voting UI)
│   ├── layout/              # FloatingInfoButton, InfoModal, FooterContent
│   └── ui/                  # shadcn/ui base components
├── docs/                    # Documentation
│   ├── UI-DESIGN-SYSTEM.md  # Full UI design guide
│   └── NOTION-INTEGRATION.md # Notion backend documentation
├── hooks/
│   ├── use-faq-voting.ts    # FAQ voting logic with Notion sync
│   └── use-scroll-direction.ts  # Header visibility on scroll
├── lib/
│   ├── notion-faq.ts        # Notion client & FAQ operations
│   ├── testimonials-data.ts # Static testimonials data
│   └── utils.ts             # cn() utility function
└── public/images/           # Static assets
```

## Key Files

### Core Configuration
- `app/globals.css` - CSS variables, stagger shadow utilities
- `tailwind.config.js` - Tailwind configuration with stagger shadows
- `components/ui/button.tsx` - Button variants including stagger styles

### AI Chat
- `app/api/chat/route.ts` - Gemini streaming endpoint with system prompt
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
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | Yes |
| `NOTION_TOKEN` | Notion Integration token | Yes (for FAQ) |
| `NOTION_FAQ_DATABASE_ID` | Notion FAQ database ID | Yes (for FAQ) |

> **Note**: If Notion is not configured, the app falls back to static preset questions.

## Architecture Overview

### Data Flow

```
Chat Flow:
User Input → EmbeddedChat → /api/chat → Gemini 2.5 Flash → Streaming Response

FAQ Flow:
Page Load → useFAQVoting → /api/faq/questions → Notion DB (or static fallback)
User Vote → Optimistic UI Update → /api/faq/vote → Notion DB
View Track → /api/faq/view → Notion DB (silent, non-blocking)
```

### Key Features
- **AI Chat**: Real-time streaming, 50-message history in localStorage
- **FAQ Voting**: Upvote/downvote with Notion persistence, 5-min client cache
- **Responsive**: Desktop 70/30 split layout, mobile tabbed interface
- **Fallback**: Static questions when Notion unavailable

For detailed Notion architecture, see: [docs/NOTION-INTEGRATION.md](docs/NOTION-INTEGRATION.md)

## Best Practices

1. **Always read UI-DESIGN-SYSTEM.md** before making visual changes
2. **Read NOTION-INTEGRATION.md** before modifying FAQ/voting features
3. Use existing component patterns from the codebase
4. Maintain the stagger shadow aesthetic throughout
5. Test on both desktop and mobile layouts
6. Use Framer Motion for animations following existing patterns
