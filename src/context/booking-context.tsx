'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_GUEST_DETAILS, type GuestDetails } from '@/types/guests'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BookingRange {
  from?: string  // ISO date "2025-12-20"
  to?: string    // ISO date "2025-12-25"
}

interface BookingContextValue {
  selectedRange: BookingRange
  selectedGuestDetails: GuestDetails
  setSelectedRange: (range: BookingRange) => void
  setSelectedGuestDetails: (details: GuestDetails) => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const BookingContext = createContext<BookingContextValue | undefined>(undefined)

interface BookingProviderProps {
  children: ReactNode
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [selectedRange, setSelectedRange] = useState<BookingRange>({})
  const [selectedGuestDetails, setSelectedGuestDetails] = useState<GuestDetails>(DEFAULT_GUEST_DETAILS)

  const value = useMemo(
    () => ({
      selectedRange,
      selectedGuestDetails,
      setSelectedRange,
      setSelectedGuestDetails,
    }),
    [selectedRange, selectedGuestDetails],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return ctx
}
