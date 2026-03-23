'use client'

import type { ReactNode } from 'react'
import { NotificationToaster } from '@/components/layout/NotificationToaster'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import type { HomePageContent } from '@/types/content'

interface AppShellProps {
  content: HomePageContent
  children: ReactNode
}

export function AppShell({ content, children }: AppShellProps) {
  return (
    <>
      <div className="relative z-[60] bg-red-600 py-1.5 text-center text-xs font-semibold uppercase tracking-widest text-white">
        🚧 Provisional page — under construction
      </div>
      <SiteHeader
        content={content.header}
        ctas={{ primary: content.hero.primaryCta, secondary: content.hero.secondaryCta }}
      />
      <NotificationToaster />
      {children}
      <SiteFooter content={content.footer} />
      <WhatsAppButton contact={content.footer.contact} />
    </>
  )
}
