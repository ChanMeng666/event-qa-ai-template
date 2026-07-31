const { withBotId } = require('botid/next/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stable in Next.js 16. Automatically memoizes components so the orb and the
  // Framer Motion tree around it stop re-rendering on unrelated state changes.
  // Uses the Babel transform, which makes builds noticeably slower - that cost
  // is build-time only.
  reactCompiler: true,

  // App directory is stable in Next.js 15, no need for experimental flag
  images: {
    // Logos are trusted, first-party SVGs served from /public.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

// withBotId adds the proxy rewrites BotID needs so the challenge script is
// served from our own origin and cannot be blocked by ad blockers.
module.exports = withBotId(nextConfig)
