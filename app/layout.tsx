import type { Metadata } from 'next'
import { Inter, Orbitron, Space_Grotesk } from 'next/font/google'
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
      <body className={`${inter.className} ${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}>
        {children}
        {/* Developer brand credit — Chan Meng */}
        <a
          href="https://github.com/ChanMeng666"
          target="_blank"
          rel="noopener noreferrer"
          title="Built by Chan Meng — need a custom app like this one? chanmeng.dev@gmail.com"
          style={{
            position: 'fixed',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.8)',
            textDecoration: 'none',
            fontSize: '12px',
          }}
        >
          <img src="/images/chan_logo.svg" alt="Chan Meng" style={{ width: '18px', height: '18px' }} />
          <span>Built by Chan Meng</span>
        </a>
      </body>
    </html>
  )
}
