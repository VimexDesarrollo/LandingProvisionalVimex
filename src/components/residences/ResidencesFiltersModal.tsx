import { useCallback, useEffect, useRef } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import { gsap } from '@/animations/gsap'
import { Typography } from '@/design-system/components/Typography'
import { ResidencesFiltersForm } from '@/components/residences/ResidencesFiltersForm'
import { useUI } from '@/hooks/useUI'
import type { ResidenceFilters } from '@/services/residenceService'
import type { GuestDetails } from '@/types/guests'

interface ResidencesFiltersModalProps {
  isOpen: boolean
  filters: ResidenceFilters
  availablePrices: number[]
  filteredResultsCount: number
  isLoadingResults: boolean
  destinationOptions: string[]
  categoryOptions: string[]
  updateSingleParam: (key: string, value: string) => void
  updateGuestParams: (value: GuestDetails) => void
  updatePriceRangeParams: (nextRange: { min?: number; max?: number }) => void
  updateMultiParam: (key: 'amenity' | 'quick', value: string, checked: boolean) => void
  clearAllFilters: () => void
  onClose: () => void
}

export function ResidencesFiltersModal({
  isOpen,
  filters,
  availablePrices,
  filteredResultsCount,
  isLoadingResults,
  destinationOptions,
  categoryOptions,
  updateSingleParam,
  updateGuestParams,
  updatePriceRangeParams,
  updateMultiParam,
  clearAllFilters,
  onClose,
}: ResidencesFiltersModalProps) {
  const { prefersReducedMotion } = useUI()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const isClosingRef = useRef<boolean>(false)

  const handleRequestClose = useCallback(() => {
    if (isClosingRef.current) {
      return
    }

    if (prefersReducedMotion) {
      onClose()
      return
    }

    isClosingRef.current = true

    const overlay = overlayRef.current
    const dialog = dialogRef.current

    if (!overlay || !dialog) {
      onClose()
      return
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(dialog, {
        y: 24,
        opacity: 0,
        scale: 0.985,
        duration: 0.2,
        ease: 'power2.in',
      })
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        0,
      )
  }, [onClose, prefersReducedMotion])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    isClosingRef.current = false

    if (prefersReducedMotion) {
      return
    }

    const overlay = overlayRef.current
    const dialog = dialogRef.current

    if (!overlay || !dialog) {
      return
    }

    const context = gsap.context(() => {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out', immediateRender: false })
      gsap.fromTo(
        dialog,
        { y: 22, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.26,
          ease: 'power2.out',
          immediateRender: false,
          clearProps: 'transform,opacity',
        },
      )
    }, overlay)

    return () => context.revert()
  }, [isOpen, prefersReducedMotion])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleRequestClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [handleRequestClose, isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] bg-ink/55 px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
      onClick={handleRequestClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_32px_80px_-35px_rgba(13,31,74,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-card-border px-5 py-4">
          <div className="inline-flex items-center gap-2">
            <FiFilter aria-hidden className="h-5 w-5 text-ink-soft" />
            <Typography as="h2" variant="h3" className="text-3xl text-ink">
              Search Filters
            </Typography>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label="Close filters panel"
            onClick={handleRequestClose}
          >
            <FiX aria-hidden className="h-5 w-5" />
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4">
          <ResidencesFiltersForm
            filters={filters}
            availablePrices={availablePrices}
            filteredResultsCount={filteredResultsCount}
            isLoadingResults={isLoadingResults}
            destinationOptions={destinationOptions}
            categoryOptions={categoryOptions}
            updateSingleParam={updateSingleParam}
            updateGuestParams={updateGuestParams}
            updatePriceRangeParams={updatePriceRangeParams}
            updateMultiParam={updateMultiParam}
            clearAllFilters={clearAllFilters}
            closeFilters={handleRequestClose}
          />
        </div>
      </div>
    </div>
  )
}
