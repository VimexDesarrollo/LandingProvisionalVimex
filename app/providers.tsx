'use client'

import type { ReactNode } from 'react'
import { AppProvider } from '@/context/app-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <AppProvider>{children}</AppProvider>
}
