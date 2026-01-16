# Event Q&A AI Template - Quick Start Guide

This project is a reusable template for creating AI-powered Q&A assistants for events. Follow this guide to customize it for your own event.

## Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key
- (Optional) Notion account for dynamic FAQ

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-username/event-qa-template.git
cd event-qa-template
npm install
```

### 2. Environment Setup

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Required: Google Gemini API key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Optional: Notion integration for dynamic FAQ
NOTION_TOKEN=your_notion_token
NOTION_FAQ_DATABASE_ID=your_database_id
```

### 3. Configure Your Event

Edit the configuration files in the `config/` directory:

#### Site Configuration (`config/site.config.ts`)

Update your event's basic information:

```typescript
export const siteConfig: SiteConfig = {
  name: 'Your Event Name 2025',
  shortName: 'Event 2025',
  tagline: 'Interactive Assistant',
  description: 'Get instant answers about Your Event.',

  dates: {
    start: '2025-08-15',
    end: '2025-08-16',
    displayFormat: 'Aug 15-16, 2025',
  },

  venue: {
    name: 'Venue Name',
    building: 'Building A',
    address: '123 Main Street, City',
    city: 'City',
    country: 'Country',
    mapEmbed: 'https://www.google.com/maps/embed?...',
  },

  organizers: [
    {
      name: 'Organization 1',
      shortName: 'Org1',
      url: 'https://org1.com',
      logo: '/images/organizers/org1.svg',
    },
    // Add more organizers...
  ],

  theme: {
    name: 'Your Event Theme',
    description: 'What your event is about',
  },

  // ... other settings
};
```

#### AI Configuration (`config/ai.config.ts`)

Customize the AI assistant's knowledge:

```typescript
// The additionalContext variable contains event-specific information
// that the AI will use to answer questions
const additionalContext = `
## Key Information

### Schedule
- Day 1: Registration and opening
- Day 2: Main activities

### Rules
- Your event rules here

### Prizes
- Prize information
`;
```

#### Content Configuration (`config/content.config.ts`)

Customize FAQ questions, testimonials, and chat suggestions:

```typescript
const presetQuestions: PresetQuestion[] = [
  {
    id: 'event-dates',
    category: 'event-info',
    question: 'When and where is the event?',
    answer: 'Your event takes place on...',
  },
  // Add more questions...
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'This is an amazing event!',
    author: 'John Doe',
    role: 'mentor',
    organization: 'Company X',
    avatarUrl: 'https://...',
  },
  // Add more testimonials...
];

const chatSuggestions: ChatSuggestion[] = [
  {
    icon: 'Calendar',  // Lucide icon name
    text: 'What is the schedule?',
    category: 'Schedule',
  },
  // Add more suggestions...
];
```

#### Branding Configuration (`config/branding.config.ts`)

Set up your logos and developer credits:

```typescript
export const brandingConfig: BrandingConfig = {
  logos: {
    main: '/images/event/logo.svg',
    full: '/images/event/logo-full.svg',
    favicon: '/images/event/logo.svg',
  },

  // Set to false to hide developer section
  showDeveloper: true,

  developer: {
    name: 'Your Name',
    url: 'https://github.com/yourname',
    description: 'Developer',
    logo: '/images/developer/logo.svg',
  },

  project: {
    repository: 'https://github.com/your/repo',
    deployment: 'https://your-app.vercel.app/',
  },
};
```

### 4. Add Brand Assets

Place your images in the following structure:

```
public/images/
├── event/
│   ├── logo.svg          # Main logo (header, icons)
│   └── logo-full.svg     # Full logo (landing page)
├── organizers/
│   ├── org1.svg          # Organizer logos
│   ├── org2.svg
│   └── ...
└── developer/
    └── logo.svg          # Your logo (optional)
```

### 5. Customize Colors (Optional)

Edit `app/globals.css` to change the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Change this for main color */
  --primary-foreground: 210 40% 98%;
  /* ... other colors */
}
```

### 6. Run and Deploy

```bash
# Development
npm run dev

# Build
npm run build

# Deploy to Vercel
vercel
```

## Configuration Reference

| File | Purpose |
|------|---------|
| `config/site.config.ts` | Event name, dates, venue, organizers |
| `config/ai.config.ts` | AI system prompt and knowledge base |
| `config/content.config.ts` | FAQ, testimonials, chat suggestions |
| `config/branding.config.ts` | Logos, developer credits |
| `app/globals.css` | Color scheme (CSS variables) |

## Optional: Notion Integration

For dynamic FAQ management, connect to Notion:

1. Create a Notion integration
2. Create a database with these properties:
   - Title (title)
   - Answer (rich_text)
   - Category (select)
   - UpVotes (number)
   - DownVotes (number)
   - TotalViews (number)
   - IsActive (checkbox)
3. Share the database with your integration
4. Add the credentials to `.env.local`

See `docs/NOTION-INTEGRATION.md` for detailed setup.

## Support

For issues and feature requests, please open an issue on GitHub.
