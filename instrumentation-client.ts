/**
 * Client-side BotID initialisation.
 *
 * /api/realtime/session mints an ephemeral OpenAI Realtime credential, which is
 * the most expensive thing an attacker can farm from this app. BotID issues an
 * invisible client challenge whose solution is attached to requests for the
 * protected paths below; the route validates it with checkBotId().
 *
 * checkLevel is pinned to 'basic' here and in the route handler. Basic is free
 * on every Vercel plan, while Deep Analysis is billed per checkBotId() call, so
 * pinning it keeps the cost at zero regardless of the project-level Deep
 * Analysis toggle in the dashboard (route-level advancedOptions take precedence
 * over project settings).
 *
 * The client and server checkLevel MUST stay identical - a mismatch fails
 * verification and would block real attendees.
 */

import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    {
      path: '/api/realtime/session',
      method: 'POST',
      advancedOptions: { checkLevel: 'basic' },
    },
  ],
});
