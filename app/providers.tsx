'use client'

import type { ReactNode } from 'react'
import { AppProvider } from '@/context/app-provider'
import { LocaleProvider } from '@/i18n/LocaleContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LocaleProvider>
      <AppProvider>{children}</AppProvider>
    </LocaleProvider>
  )
}
