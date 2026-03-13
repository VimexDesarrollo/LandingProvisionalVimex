import { useEffect, useState } from 'react'
import { ApiError } from '@/services/apiClient'
import { bookingRequestService } from '@/services/bookingRequestService'
import type { CheckoutSession } from '@/types/booking'

interface UseCheckoutSessionResult {
  checkoutSession: CheckoutSession | null
  isLoading: boolean
  error: string | null
}

export function useCheckoutSession(token: string | undefined): UseCheckoutSessionResult {
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setCheckoutSession(null)
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    const loadCheckoutSession = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const nextSession = await bookingRequestService.getCheckoutSession(token, controller.signal)
        setCheckoutSession(nextSession)
      } catch (errorValue) {
        if (controller.signal.aborted) return

        if (errorValue instanceof ApiError && errorValue.body && typeof errorValue.body === 'object') {
          const detail = (errorValue.body as { detail?: string | string[] }).detail
          if (Array.isArray(detail)) {
            setError(detail[0] ?? 'We could not load your checkout session.')
          } else {
            setError(detail ?? 'We could not load your checkout session.')
          }
        } else {
          setError('We could not load your checkout session.')
        }
        setCheckoutSession(null)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadCheckoutSession()

    return () => controller.abort()
  }, [token])

  return { checkoutSession, isLoading, error }
}
