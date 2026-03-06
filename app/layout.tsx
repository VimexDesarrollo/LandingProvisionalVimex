import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/base.css'
import '@/styles/effects.css'
import { AppShell } from '@/components/layout/AppShell'
import { getHomeContent } from '@/services/server/contentService'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Vimex Vacation Rentals',
  description: 'Luxury vacation rentals and concierge services in Playa del Carmen.',
}

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const homeContent = await getHomeContent()

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <AppShell content={homeContent}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
