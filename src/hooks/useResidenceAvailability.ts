import { useEffect, useState } from 'react'
import { residenceService } from '@/services/residenceService'

interface UseResidenceAvailabilityResult {
  blockedDates: string[]
  isLoading: boolean
}

export function useResidenceAvailability(residenceId: string | null | undefined): UseResidenceAvailabilityResult {
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!residenceId) {
      setBlockedDates([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)

    residenceService.getBlockedDates(residenceId, controller.signal)
      .then((nextBlockedDates) => {
        if (controller.signal.aborted) {
          return
        }
        setBlockedDates(nextBlockedDates)
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return
        }
        setBlockedDates([])
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [residenceId])

  return { blockedDates, isLoading }
}
