# AI Hackathon Assistant 2025 - Claude Code Guidelines

## Project Overview

This is an AI-powered assistant for the AI Hackathon Festival 2025 event. Built with Next.js 15, React, and TypeScript, featuring a chat interface powered by Google Gemini and a FAQ voting system backed by Notion.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (customized)
- **Animation**: Framer Motion
- **AI**: Google Gemini Pro via Vercel AI SDK
- **Database**: Notion API (for FAQ voting)

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
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes (chat, FAQ)
│   ├── chat/            # Chat page
│   └── page.tsx         # Home page
├── components/
│   ├── chat/            # Chat-related components
│   ├── chatbot/         # Chatbot core components
│   ├── faq/             # FAQ components
│   ├── layout/          # Layout components (header, footer, modals)
│   └── ui/              # shadcn/ui base components
├── docs/                # Documentation
│   └── UI-DESIGN-SYSTEM.md  # Full UI design guide
├── hooks/               # Custom React hooks
├── lib/                 # Utilities
└── public/images/       # Static assets
```

## Key Files

- `app/globals.css` - CSS variables, stagger shadow utilities
- `tailwind.config.js` - Tailwind configuration with stagger shadows
- `components/ui/button.tsx` - Button variants including stagger styles

## Development Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
```

## Environment Variables

Required in `.env.local`:
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API key
- `NOTION_API_KEY` - Notion API key for FAQ voting
- `NOTION_FAQ_DATABASE_ID` - Notion database ID

## Best Practices

1. **Always read UI-DESIGN-SYSTEM.md** before making visual changes
2. Use existing component patterns from the codebase
3. Maintain the stagger shadow aesthetic throughout
4. Test on both desktop and mobile layouts
5. Use Framer Motion for animations following existing patterns
