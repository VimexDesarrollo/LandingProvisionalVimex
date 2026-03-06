import { useEffect, useState } from 'react'
import { residenceService } from '@/services/residenceService'
import type { ResidencePricing } from '@/types/content'

interface UsePricingResult {
  pricing: ResidencePricing | null
  isLoading: boolean
}

export function usePricing(
  slug: string | null | undefined,
  checkin: string | undefined,
  checkout: string | undefined,
): UsePricingResult {
  const [pricing, setPricing] = useState<ResidencePricing | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!slug || !checkin || !checkout) {
      setPricing(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)

    residenceService
      .getPricing(slug, checkin, checkout, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setPricing(result)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setPricing(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [slug, checkin, checkout])

  return { pricing, isLoading }
}
