/**
 * Vercel BotID verification for the realtime session mint route.
 *
 * Why: /api/realtime/session hands out a short-lived OpenAI Realtime
 * credential. Rate limits bound how fast that can be farmed, but they cannot
 * tell a browser from a script. BotID's invisible client challenge can.
 *
 * Cost: `checkLevel` is pinned to 'basic', which is free on every Vercel plan.
 * Deep Analysis is billed per checkBotId() call, and route-level advancedOptions
 * take precedence over the project-level dashboard toggle, so pinning it here
 * means enabling Deep Analysis in the dashboard cannot silently start charging
 * for this route. The same checkLevel is pinned client-side in
 * instrumentation-client.ts - the two MUST match or verification fails.
 *
 * Safety: this fails OPEN. A thrown error, a timeout, or anything other than an
 * explicit `isBot: true` lets the request through. Blocking real attendees on
 * the day is far worse than letting a bot through, and the rate limits and token
 * budget still apply either way.
 */

import { checkBotId } from 'botid/server';
import { limitsConfig } from '@/config/limits.config';

/**
 * Returns true only when BotID positively identifies the caller as a bot.
 * Never throws.
 *
 * Note: in local development checkBotId() always reports `isBot: false`, so this
 * is effectively inert outside a Vercel deployment.
 */
export async function isBotRequest(): Promise<boolean> {
  if (!limitsConfig.botid.enabled) return false;

  try {
    const verification = await checkBotId({
      advancedOptions: { checkLevel: 'basic' },
    });
    return verification.isBot === true;
  } catch (error) {
    // Fail open - never let a BotID outage take the voice agent down.
    console.error('BotID check failed, allowing request:', error);
    return false;
  }
}
