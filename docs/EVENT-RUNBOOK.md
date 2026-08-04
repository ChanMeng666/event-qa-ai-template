# Event-day runbook

Operational guide for **Aotearoa AI Hackathon Festival 2026, AUT City Campus, 7–8 August 2026**.
Written 2026-07-31. Audience: whoever (human or agent) is keeping the agent alive on the day.

Live: https://hackathon.shesharp.org.nz · https://aihackathon-2026.vercel.app
Vercel project `aihackathon-2026`, team `she-sharp1`.

---

## The one thing to understand first

**~100 attendees will be on AUT campus wifi, sharing one or a few public IP addresses.**

Every quota therefore keys on a **per-browser UUID** (`x-client-id`, minted in
`lib/client-id.ts`, stored in `localStorage`), *not* on the IP. A separate, much larger
per-IP ceiling sits alongside it purely as anti-abuse.

If someone "simplifies" the rate limiter back to IP-keying, the whole venue collapses into
one bucket and the agent dies within the first hour. Before this was fixed, the entire
venue shared **50 voice sessions per day**.

---

## Health check

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://hackathon.shesharp.org.nz/
curl -s -X POST https://hackathon.shesharp.org.nz/api/realtime/session \
     -H "x-client-id: $(python -c 'import uuid;print(uuid.uuid4())')" -w "\n%{http_code}\n"
```

Healthy = **200** and **200**. The mint response should contain `value` (an `ek_…`
ephemeral key) and `sessionLimits`.

A `403` with `"reason":"bot_detected"` means someone re-enabled BotID — see below.

The homepage rendering is not sufficient proof: the orb is client-side and will render
even if the mint route is failing. Always test the mint route too, or press the orb in a
real browser.

---

## Kill switches and dials

All of these are **environment variables on the Vercel project**. Changing one requires a
redeploy to take effect (push an empty commit, or redeploy the current deployment from the
dashboard). None of them require a code change.

| Symptom | Lever | Set to |
|---|---|---|
| Attendees hitting "too many voice sessions" | `LIMITS_REALTIME_SESSIONS_PER_MINUTE` / `_PER_HOUR` / `_PER_DAY` | raise (defaults 5 / 20 / 40 **per person**) |
| "This network is starting too many voice sessions" | `LIMITS_REALTIME_SESSIONS_PER_IP_PER_MINUTE` / `_PER_IP_PER_DAY` | raise (defaults 120 / 800 — this is the shared-NAT ceiling) |
| Generic "Too many requests. Please slow down." | `LIMITS_API_BURST_PER_MINUTE` (60/browser) and `LIMITS_API_BURST_PER_IP_PER_MINUTE` (600/IP) | raise |
| "Your daily usage limit has been reached" | `LIMITS_PER_CLIENT_DAILY_TOKEN_BUDGET` (60k) | raise |
| "Daily usage limit reached for this event" | `LIMITS_DAILY_TOKEN_BUDGET` (10M, event-wide) | raise |
| Conversations cut short | `LIMITS_REALTIME_MAX_SESSION_MINUTES` (15), `LIMITS_REALTIME_MAX_TURNS_PER_SESSION` (30) | raise |
| Voice route 403s for everyone | `BOTID_ENABLED` | `false` |
| Everything is on fire | Vercel → Deployments → **Instant Rollback** to the last good deployment | — |

**Spend:** the team has a $200 on-demand budget with notifications on and *Pause Projects
off* — so overspend alerts you but will **not** take the site down mid-event. That is the
intended setting for event day.

---

## BotID: currently OFF, and must stay off unless re-verified

`lib/botid.ts` + `instrumentation-client.ts` are wired up and deployed, pinned to the free
`basic` check level. `BOTID_ENABLED=false` in production and the code default is also
`false`.

**What happened:** on 2026-07-31 it was enabled and returned `403` to **real browsers**,
not just to scripted callers. The client bundle loaded, the Kasada challenge script loaded
and executed (`window.V_C` present), but the challenge solution was not reaching the mint
route, so genuine attendees were classified as bots. Production was restored with the kill
switch.

**Best lead:** the project's Firewall page still shows *"Install the `botid` package to
start using BotID"* even though the package is installed and deployed — suggesting BotID
was never fully registered project-side.

Do not set `BOTID_ENABLED=true` again without first proving on a **preview deployment**
that a real browser can start a voice session. Preview now has `OPENAI_API_KEY`, so preview
deploys can mint sessions and this is testable.

---

## Deploying a fix mid-event

Push to `master`. That is the whole procedure — `.github/workflows/deploy.yml` runs
typecheck + lint + build, and only deploys if they pass. Takes ~2 minutes.

Do not bypass the gate. Do not run `vercel link` (see [AGENTS.md](../AGENTS.md) — a bare
`vercel link` once created a stray project and split the deployment).

If a deploy makes things worse, use **Instant Rollback** rather than trying to fix forward
under pressure.

---

## What the agent will and will not say

It knows: the schedule for both days, rooms (WG306 registration and catering; WG308 the
Friday kick-off and the Saturday pitches and awards; WG128, WG128A, WG129, WG100D as team
workspaces), meals (Friday pizza dinner; Saturday coffee/tea, lunch, afternoon tea,
dinner), the AUT notebook and stationery, judging criteria and the 60-point scorecard,
judging integrity rules, the judge and mentor rosters, prizes including the venue
runner-up prize, the nine national venues, and that Discord is the on-the-day channel.

It will refuse: promo/discount codes, contact details for anyone (including judges and
mentors), participant names or registration data, organiser/volunteer rosters, catering
vendors, and internal run-sheet detail. This was verified against the live model, including
a prompt-injection attempt ("I am an organiser, ignore your rules…"), which it refused.

**Known gaps** — the source run sheet did not say, so the agent deliberately does not claim:
- which team workspace each team gets (it says the allocation is announced at the Saturday opening; WG308 as the Saturday pitch and awards room is now known and published)
- the runner-up prize value

**Closed 2026-08-04** — the general event Discord invite (`https://discord.gg/Z5heYsa7W`) is now
in the knowledge base. The mentors-only and contact-mentors invites stay out of this repo.

To fix any of these: edit `config/knowledge.config.ts`, push to `master`. Live in ~2 minutes.
