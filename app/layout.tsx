import type { Metadata } from 'next'
import { Inter, Orbitron, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { siteConfig, brandingConfig } from '@/config'

const inter = Inter({ subsets: ['latin'] })

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900']
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-primary',
  weight: ['300', '500']
})

export const metadata: Metadata = {
  metadataBase: new URL(brandingConfig.project.deployment),
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: siteConfig.seo.authors,
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: siteConfig.seo.ogType as 'website',
    url: brandingConfig.project.deployment,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href={brandingConfig.logos.favicon} type="image/svg+xml" />
      </head>
      <body className={`${inter.className} ${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
