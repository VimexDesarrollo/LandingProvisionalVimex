import { useEffect, useState } from 'react'

interface UseFloatingPanelDirectionOptions {
  isOpen: boolean
  anchor: HTMLElement | null
  estimatedPanelHeight: number
  gap?: number
}

export function useFloatingPanelDirection({
  isOpen,
  anchor,
  estimatedPanelHeight,
  gap = 8,
}: UseFloatingPanelDirectionOptions) {
  const [openUpward, setOpenUpward] = useState(false)

  useEffect(() => {
    if (!isOpen || !anchor || typeof window === 'undefined') {
      return
    }

    const updateDirection = () => {
      const rect = anchor.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const shouldOpenUpward = spaceBelow < estimatedPanelHeight + gap && spaceAbove > spaceBelow
      setOpenUpward(shouldOpenUpward)
    }

    updateDirection()
    window.addEventListener('resize', updateDirection)
    window.addEventListener('scroll', updateDirection, true)

    return () => {
      window.removeEventListener('resize', updateDirection)
      window.removeEventListener('scroll', updateDirection, true)
    }
  }, [anchor, estimatedPanelHeight, gap, isOpen])

  return openUpward
}
