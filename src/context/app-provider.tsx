import type { ReactNode } from 'react'
import { BookingProvider } from '@/context/booking-context'
import { UIProvider } from '@/context/ui-context'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <UIProvider>
      <BookingProvider>{children}</BookingProvider>
    </UIProvider>
  )
}
