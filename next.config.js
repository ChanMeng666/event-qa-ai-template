/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is stable in Next.js 15, no need for experimental flag
  images: {
    // Logos are trusted, first-party SVGs served from /public.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
