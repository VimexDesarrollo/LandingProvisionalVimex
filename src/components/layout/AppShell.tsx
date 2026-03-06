'use client'

import type { ReactNode } from 'react'
import { NotificationToaster } from '@/components/layout/NotificationToaster'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import type { HomePageContent } from '@/types/content'

interface AppShellProps {
  content: HomePageContent
  children: ReactNode
}

export function AppShell({ content, children }: AppShellProps) {
  return (
    <>
      <SiteHeader
        content={content.header}
        ctas={{ primary: content.hero.primaryCta, secondary: content.hero.secondaryCta }}
      />
      <NotificationToaster />
      {children}
      <SiteFooter content={content.footer} />
    </>
  )
}
