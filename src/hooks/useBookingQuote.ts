import { useCallback, useEffect, useState } from 'react'
import { bookingRequestService, getBookingConflict } from '@/services/bookingRequestService'
import type { BookingApiConflict, BookingQuote } from '@/types/booking'

interface UseBookingQuoteResult {
  quote: BookingQuote | null
  isLoading: boolean
  error: BookingApiConflict | null
  setQuote: (quote: BookingQuote) => void
  refetch: () => Promise<void>
}

export function useBookingQuote(
  residenceSlug: string | undefined,
  checkIn: string | undefined,
  checkOut: string | undefined,
  guests: number,
): UseBookingQuoteResult {
  const [quote, setQuoteState] = useState<BookingQuote | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<BookingApiConflict | null>(null)

  const fetchQuote = useCallback(async () => {
    if (!residenceSlug || !checkIn || !checkOut || guests < 1) {
      setQuoteState(null)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const nextQuote = await bookingRequestService.getQuote({ residenceSlug, checkIn, checkOut, guests })
      setQuoteState(nextQuote)
    } catch (errorValue) {
      setQuoteState(null)
      setError(
        getBookingConflict(errorValue) ?? {
          code: 'DATES_UNAVAILABLE',
          detail: 'We could not validate your stay. Please review your dates and try again.',
        },
      )
    } finally {
      setIsLoading(false)
    }
  }, [checkIn, checkOut, guests, residenceSlug])

  useEffect(() => {
    void fetchQuote()
  }, [fetchQuote])

  return {
    quote,
    isLoading,
    error,
    setQuote: setQuoteState,
    refetch: fetchQuote,
  }
}
