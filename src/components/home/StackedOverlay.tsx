'use client'

import { useEffect, useRef } from 'react'
import { animateStackedOverlay } from '@/animations/homeAnimations'
import { useUI } from '@/hooks/useUI'

interface StackedOverlayProps {
  baseSection: React.ReactNode
  overlaySection: React.ReactNode
}

/**
 * Pins baseSection while overlaySection scrolls up and covers it.
 * Section A scales down + blurs as section B slides in.
 */
export function StackedOverlay({ baseSection, overlaySection }: StackedOverlayProps) {
  const sectionARef = useRef<HTMLDivElement>(null)
  const sectionBRef = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion } = useUI()

  useEffect(() => {
    const a = sectionARef.current
    const b = sectionBRef.current
    if (!a || !b) return
    return animateStackedOverlay(a, b, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return (
    <div className="relative">
      {/* Section A — sticky base, will scale down as B covers it */}
      <div ref={sectionARef} className="sticky top-0 min-h-screen will-change-transform">
        {baseSection}
      </div>

      {/* Section B — rises from below, rounded top for premium card feel */}
      <div
        ref={sectionBRef}
        className="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.18)] will-change-transform"
      >
        {overlaySection}
      </div>
    </div>
  )
}
