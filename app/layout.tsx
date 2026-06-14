import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Project Autopilot - AI-Powered Supply Chain Intelligence',
  description:
    'Real-time supply chain optimization with AI agents. Monitor OTIF, predict disruptions, and automate decisions.',
  keywords: [
    'supply chain',
    'AI',
    'optimization',
    'real-time',
    'forecasting',
    'OTIF',
  ],
  authors: [{ name: 'Project Autopilot' }],
  creator: 'Project Autopilot',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://project-autopilot.com',
    siteName: 'Project Autopilot',
    title: 'Project Autopilot - AI-Powered Supply Chain Intelligence',
    description:
      'Real-time supply chain optimization with AI agents. Monitor OTIF, predict disruptions, and automate decisions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Autopilot',
    description: 'AI-Powered Supply Chain Intelligence',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0a0e27" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
