import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig, brandingConfig } from '@/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: siteConfig.seo.authors,
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: siteConfig.seo.ogType as 'website',
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
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}
