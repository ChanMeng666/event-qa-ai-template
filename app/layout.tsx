import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Hackathon Festival 2025 - AI Assistant',
  description: 'Get instant answers about the AI Hackathon Festival 2025. Learn about schedules, team formation, judging criteria, and more.',
  keywords: ['AI Hackathon', 'Festival 2025', 'AUT', 'AI Forum', 'She Sharp', 'Auckland', 'Sustainable Development Goals'],
  authors: [{ name: 'AI Hackathon Festival 2025 Team' }],
  openGraph: {
    title: 'AI Hackathon Festival 2025 - AI Assistant',
    description: 'Get instant answers about the AI Hackathon Festival 2025',
    type: 'website',
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
        <link rel="icon" href="/images/AI-Hackathon-logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}
