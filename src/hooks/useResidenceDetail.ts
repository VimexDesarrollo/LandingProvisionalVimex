import { useEffect, useState } from 'react'
import { residenceService } from '@/services/residenceService'
import type { ResidenceDetail } from '@/types/content'

interface UseResidenceDetailResult {
  residence: ResidenceDetail | null
  isLoading: boolean
  error: boolean
}

export function useResidenceDetail(slug: string | null | undefined): UseResidenceDetailResult {
  const [residence, setResidence] = useState<ResidenceDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(false)

    if (!slug) {
      setIsLoading(false)
      return
    }

    residenceService.getResidenceDetailBySlug(slug)
      .then((residenceData) => {
        if (controller.signal.aborted) return
        setResidence(residenceData)
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
  }, [slug])

  return { residence, isLoading, error }
}
