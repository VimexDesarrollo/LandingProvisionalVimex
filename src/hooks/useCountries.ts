import { useEffect, useState } from 'react'
import { bookingRequestService } from '@/services/bookingRequestService'
import type { CountryOption } from '@/types/booking'

interface UseCountriesResult {
  countries: CountryOption[]
  isLoading: boolean
  error: boolean
}

export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(false)

    bookingRequestService.getCountries(controller.signal)
      .then((nextCountries) => {
        if (controller.signal.aborted) {
          return
        }
        setCountries(nextCountries)
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return
        }
        setCountries([])
        setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [])

  return { countries, isLoading, error }
}
