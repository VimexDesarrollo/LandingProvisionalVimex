'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { gsap } from '@/animations/gsap'
import { useFloatingPanelDirection } from '@/hooks/useFloatingPanelDirection'
import { useUI } from '@/hooks/useUI'
import { cn } from '@/lib/cn'
import { formatGuestSummary, normalizeGuestDetails } from '@/lib/guestDetails'
import type { GuestDetails } from '@/types/guests'

interface GuestDetailsPickerProps {
  label: string
  value: GuestDetails
  onChange: (nextValue: GuestDetails) => void
  placeholder?: string
  leftIcon?: ReactNode
  className?: string
  triggerClassName?: string
}

interface GuestRow {
  key: 'adults' | 'children' | 'infants'
  label: string
  hint: string
  min: number
}

const guestRows: GuestRow[] = [
  { key: 'adults', label: 'Adults', hint: 'Ages 13 or above', min: 1 },
  { key: 'children', label: 'Children', hint: 'Ages 2-12', min: 0 },
  { key: 'infants', label: 'Infants', hint: 'Under 2', min: 0 },
]

export function GuestDetailsPicker({
  label,
  value,
  onChange,
  placeholder = 'Guests',
  leftIcon,
  className,
  triggerClassName,
}: GuestDetailsPickerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const panelId = useId()
  const { prefersReducedMotion } = useUI()
  const openUpward = useFloatingPanelDirection({
    isOpen,
    anchor: wrapperRef.current,
    estimatedPanelHeight: 360,
  })
  const normalizedValue = normalizeGuestDetails(value)
  const selectedLabel = formatGuestSummary(normalizedValue, placeholder)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || prefersReducedMotion || !panelRef.current) {
      return
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -10, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
          immediateRender: false,
          clearProps: 'transform,opacity',
        },
      )
    }, wrapperRef)

    return () => context.revert()
  }, [isOpen, prefersReducedMotion])

  const updateCount = (key: GuestRow['key'], delta: number, min: number) => {
    const nextValue = Math.max(min, normalizedValue[key] + delta)
    onChange({
      ...normalizedValue,
      [key]: nextValue,
    })
  }

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        className={cn(
          'booking-field booking-field--control relative flex h-11 items-center justify-between px-3 text-base',
          leftIcon ? 'pl-10' : '',
          triggerClassName,
        )}
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="pointer-events-none ml-2 text-ink-soft">▾</span>
        {leftIcon ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</span> : null}
      </button>

      {isOpen ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={label}
          data-direction={openUpward ? 'up' : 'down'}
          className={cn(
            'absolute left-0 z-[120] w-full min-w-[18rem] rounded-xl border border-white/95 bg-white p-3 shadow-soft',
            openUpward ? 'bottom-[calc(100%+0.45rem)]' : 'top-[calc(100%+0.45rem)]',
          )}
        >
          <div className="space-y-2.5">
            {guestRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-3 rounded-lg border border-white/70 bg-white/72 px-2.5 py-2">
                <div>
                  <p className="text-sm font-semibold text-ink">{row.label}</p>
                  <p className="text-xs text-ink-soft">{row.hint}</p>
                </div>
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease ${row.label}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-white text-lg leading-none text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={normalizedValue[row.key] <= row.min}
                    onClick={() => updateCount(row.key, -1, row.min)}
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-ink">{normalizedValue[row.key]}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${row.label}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-white text-lg leading-none text-ink-soft transition-colors hover:border-accent hover:text-accent"
                    onClick={() => updateCount(row.key, 1, row.min)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/70 bg-white/72 px-2.5 py-2">
              <div>
                <p className="text-sm font-semibold text-ink">Pets</p>
                <p className="text-xs text-ink-soft">Traveling with pets</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={normalizedValue.pets}
                onChange={(event) =>
                  onChange({
                    ...normalizedValue,
                    pets: event.currentTarget.checked,
                  })
                }
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  )
}
