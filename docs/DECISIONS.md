# Decisions and deliberate non-decisions

Things that look like oversights but are choices. Written 2026-07-31 so a future agent
doesn't "helpfully" undo them. Each entry says *why*, so it can be revisited on evidence
rather than reflex.

---

## Architecture

**No database.** Knowledge is served from `config/knowledge.config.ts`. `lib/db.ts` and
`scripts/seed-knowledge.ts` still work but no Postgres is attached to production, and the
user has decided none should be. Never suggest attaching one; never tell someone to run
`npm run db:seed` to publish knowledge changes — pushing to `master` is the publish step.

**WebRTC goes browser → OpenAI direct.** It never touches Vercel compute, which is correct
for ~100 concurrent voice sessions and costs nothing in function time. Do not migrate to
the AI SDK's or AI Gateway's realtime support: both are WebSocket-only (full client
rewrite), still beta/canary-pinned, and Gateway has an **undocumented** per-team concurrent
realtime session ceiling — unacceptable with 100 simultaneous users.

**Quotas key on the browser, not the IP.** See CLAUDE.md. This is the single most important
invariant in the codebase for event day.

---

## Not adopted, because they cost money

The user's constraint was explicit: *implement it if it adds no cost on the Vercel Pro plan.*

| Feature | Why not |
|---|---|
| **AI Gateway** | Zero token markup, but BYOK requires the paid credits tier and it re-routes spend to a new Vercel bill rather than removing it. `/api/chat` is disabled by default anyway, so the value is ~zero. |
| **WAF rate-limit rules** | Metered (~$0.50/1M allowed requests), and Vercel's own docs contradict each other on whether Pro has an included allowance. App-level limits already cover this. |
| **Observability Plus** | $1.20/1M events. Verified **not** currently billing — the upcoming invoice is exactly $20.00, i.e. Pro base only. |
| **BotID Deep Analysis** | $1/1000 `checkBotId()` calls. The code pins `checkLevel: 'basic'` on **both** client and server precisely so enabling Deep Analysis in the dashboard cannot silently start billing this route. |

---

## Held back until after the 7–8 Aug event

Both are committed on branch **`wt/post-event`** (pushed), not on `master`.

**React Compiler** (`01d65ee`). Measured back-to-back on a production build: 59.2 → 60.0
median FPS, identical 7.00 draw calls per frame. That is noise. It does emit 12 memo caches,
so it genuinely changes memoization semantics app-wide — and the payoff would only appear in
re-render work during a live voice session (captions, transcript, voice state), which is
exactly the path that could not be exercised locally. Zero measured benefit against an
unverified risk surface, days before a live event.

**`middleware.ts` → `proxy.ts`** (`86a1ac3`). Next 16 deprecates the `middleware` file
convention; the build warns on every run. The rename was done and verified properly — the
429 still fires with a byte-identical body and the `/api/realtime/:path*` matcher still
intercepts. It was still held back: it is a zero-user-benefit change to the one file
enforcing the event-critical quotas. Merge it the week after the event.

---

## Not enabled in the Vercel dashboard

**Bot Protection** ("challenge requests from non-browser sources") and **AI Bots → Deny**.
Both are free on Pro. Neither was enabled: browser automation could not commit a value in
that dropdown across six attempts and two page loads, and the Firewall REST API returned
403 with the CLI's session token. The user's call was *"leave them given their marginal
value"* — AI Bots blocking only stops crawlers, and Bot Protection is the same class of
mechanism that took the voice route down earlier that day.

**Rolling Releases** (Pro includes 1 project, free) — `/settings/rolling-releases` 404s and
the correct location wasn't found. Worth revisiting; it would let a mid-event fix go to 5%
of traffic first.

---

## Corrections to claims made during this work

Recorded because they were stated confidently and were wrong; someone re-reading the git
history may otherwise re-derive the wrong conclusion.

- **The July 2026 Next.js CVEs do not apply to this app.** Every HIGH requires a
  precondition this codebase lacks: no Server Actions (`grep "use server"` → nothing), no
  `i18n` in `next.config.js`, no `rewrites()`/`redirects()`, no custom server, and the
  `fetch` cache-confusion pair needs the `fetch(new Request(init), otherInit)` shape.
  Patching to 16.2.12 was hygiene, not an emergency.
- **React 18.2.0 was a supported configuration.** `next@16.1.6` declared
  `peerDependencies.react: "^18.2.0 || ^19.0.0"`. The upgrade to 19.2.8 was optional
  modernization, not a correctness fix.
- **`@neondatabase/serverless` is not dead weight** — `lib/usage.ts` imports `lib/db.ts`.
  An earlier plan proposed removing it; don't.

---

## Data provenance for the knowledge base

The source workbook (`AI Forum Aug 2026 - Run Sheet.xlsx`) is the **2025** run sheet with a
partial 2026 update. Both years coexist in it. Only these tabs are 2026-current: the
`Run Sheet` header block, `Mentor List`, and `Registrations_20th July`. The `Agenda` tab,
the `Run Sheet` schedule body ("Friday 15th August"), `Judging Process` (which says the
Summit is "8/9 September in Wellington" — it is **18 September in Auckland**) and all seven
attendee tabs are 2025 and must not be imported.

`Final Teams` is empty: 2026 teams don't exist until Friday night, so per-participant Q&A
cannot be built from this file at all.

Participant data was deliberately excluded — the agent is public and unauthenticated, and
the workbook contains names, emails, phones, student IDs and dietary requirements for
**2025** attendees.
