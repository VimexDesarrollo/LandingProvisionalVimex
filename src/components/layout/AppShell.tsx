'use client'

import type { ReactNode } from 'react'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { NotificationToaster } from '@/components/layout/NotificationToaster'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { useLocale } from '@/i18n/LocaleContext'
import type { HomePageContent } from '@/types/content'

interface AppShellProps {
  content: HomePageContent
  children: ReactNode
}

export function AppShell({ content, children }: AppShellProps) {
  const { t } = useLocale()
  return (
    <>
      <div className="relative z-[60] bg-red-600 py-1.5 text-center text-xs font-semibold uppercase tracking-widest text-white">
        {t.banner}
      </div>
      <SiteHeader
        content={content.header}
        ctas={{ primary: content.hero.primaryCta, secondary: content.hero.secondaryCta }}
      />
      <NotificationToaster />
      {children}
      <SiteFooter content={content.footer} />
      <WhatsAppButton contact={content.footer.contact} />
      <CookieBanner />
    </>
  )
}
