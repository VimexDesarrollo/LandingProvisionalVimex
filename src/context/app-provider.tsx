import type { ReactNode } from 'react'
import { AuthProvider } from '@/context/auth-context'
import { BookingProvider } from '@/context/booking-context'
import { UIProvider } from '@/context/ui-context'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <UIProvider>
      <AuthProvider>
        <BookingProvider>{children}</BookingProvider>
      </AuthProvider>
    </UIProvider>
  )
}
