'use client'

import { useEffect, useRef } from 'react'
import { animateSectionReveal } from '@/animations/homeAnimations'
import { useUI } from '@/hooks/useUI'

export function useSectionReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const { prefersReducedMotion } = useUI()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    return animateSectionReveal(node, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return ref
}
