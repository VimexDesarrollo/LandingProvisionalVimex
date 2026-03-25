import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import '@/styles/base.css'
import '@/styles/effects.css'
import { AppShell } from '@/components/layout/AppShell'
import { SchemaOrg } from '@/components/layout/SchemaOrg'
import { getHomeContent } from '@/services/server/contentService'
import { Providers } from './providers'

const GTM_ID = 'GTM-MXNRRR3Z'

const SITE_URL = 'https://vimexmx.com'
const OG_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vimex Vacation Rentals | Playa del Carmen, Mexico',
    template: '%s | Vimex Vacation Rentals',
  },
  description:
    'Luxury vacation rentals and property management in Playa del Carmen, Riviera Maya. 20 years connecting guests with private Caribbean homes. Book with confidence.',
  keywords: [
    'vacation rentals Playa del Carmen',
    'Riviera Maya vacation rentals',
    'Playa del Carmen vacation homes',
    'Mexico vacation rentals',
    'Caribbean vacation rentals',
    'property management Playa del Carmen',
    'Vimex vacation rentals',
    'luxury rentals Mexico',
    'Quintana Roo vacation',
  ],
  authors: [{ name: 'Vimex Vacation Rentals', url: SITE_URL }],
  creator: 'Vimex Vacation Rentals',
  publisher: 'Vimex Vacation Rentals',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Vimex Vacation Rentals',
    title: 'Vimex Vacation Rentals | Playa del Carmen, Mexico',
    description:
      'Luxury vacation rentals and property management in Playa del Carmen, Riviera Maya. 20 years of trusted service.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Playa del Carmen beach — Vimex Vacation Rentals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vimex Vacation Rentals | Playa del Carmen, Mexico',
    description:
      'Luxury vacation rentals and property management in Playa del Carmen, Riviera Maya.',
    images: [OG_IMAGE],
  },
  icons: { icon: '/favicon.ico' },
}

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const homeContent = await getHomeContent()

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="gtm"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <SchemaOrg />
        <Providers>
          <AppShell content={homeContent}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
