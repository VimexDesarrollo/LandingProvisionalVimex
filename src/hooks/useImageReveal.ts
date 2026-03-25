'use client'

import { useEffect, useRef } from 'react'
import { animateImageReveal } from '@/animations/homeAnimations'
import { useUI } from '@/hooks/useUI'

export function useImageReveal<W extends HTMLElement = HTMLDivElement, I extends HTMLElement = HTMLImageElement>() {
  const wrapperRef = useRef<W | null>(null)
  const imgRef = useRef<I | null>(null)
  const { prefersReducedMotion } = useUI()

  useEffect(() => {
    const wrapper = wrapperRef.current
    const img = imgRef.current
    if (!wrapper || !img) return
    return animateImageReveal(wrapper, img, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return { wrapperRef, imgRef }
}
