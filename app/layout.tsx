// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'BOS Systems — Le systeme d\'exploitation des PME marocaines', template: '%s | BOS Systems' },
  description: 'Automatisez votre relation client avec l\'IA. Rendez-vous, rappels, WhatsApp — BOS Systems gere tout pendant que vous grandissez.',
  keywords: ['CRM Maroc', 'gestion client', 'IA WhatsApp', 'PME Maroc', 'rendez-vous automatique', 'BOS Systems'],
  authors: [{ name: 'BOS Systems' }],
  creator: 'BOS Systems',
  publisher: 'BOS Systems',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://bossystems.ma'),
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://bossystems.ma',
    title: 'BOS Systems — Le systeme d\'exploitation des PME marocaines',
    description: 'Automatisez votre relation client avec l\'IA.',
    siteName: 'BOS Systems',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'BOS Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOS Systems',
    description: 'L\'IA qui gere vos clients 24h/24',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0C0E12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  )
}
