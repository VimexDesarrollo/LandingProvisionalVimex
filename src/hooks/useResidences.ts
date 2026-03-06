import { useEffect, useState } from 'react'
import { residenceService, type ResidenceFilters } from '@/services/residenceService'
import type { ResidenceListing } from '@/types/content'

interface UseResidencesResult {
  residences: ResidenceListing[]
  isLoading: boolean
  error: boolean
}

export function useResidences(filters: ResidenceFilters): UseResidencesResult {
  const [residences, setResidences] = useState<ResidenceListing[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(false)

    residenceService
      .getResidences(filters, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setResidences(data)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => {
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  return { residences, isLoading, error }
}
