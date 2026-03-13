'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarModalHeader } from '@/components/calendar/CalendarModalHeader'
import { CalendarModalOverlay } from '@/components/calendar/CalendarModalOverlay'
import { CalendarMonths } from '@/components/calendar/CalendarMonths'
import type { DateRange } from 'react-day-picker'

interface CalendarModalProps {
  id: string
  selectedRange: DateRange | undefined
  blockedDateKeys?: string[]
  onSelectDate: (date: Date) => void
  onClose: () => void
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled'))
}

export function CalendarModal({
  id,
  selectedRange,
  blockedDateKeys = [],
  onSelectDate,
  onClose,
}: CalendarModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const dialog = dialogRef.current
    dialog?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const currentDialog = dialogRef.current
      if (!currentDialog) {
        return
      }

      const nodes = focusableElements(currentDialog)
      if (nodes.length === 0) {
        event.preventDefault()
        return
      }

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (!active || active === first || !currentDialog.contains(active)) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (!active || active === last || !currentDialog.contains(active)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!mounted) {
    return null
  }

  return createPortal(
    <CalendarModalOverlay>
      <div
        id={id}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Date range modal"
        tabIndex={-1}
        data-testid="calendar-modal-content"
        className="calendar-modal-shell w-[min(90vw,56rem)] rounded-2xl border border-white/60 bg-[rgb(246_251_255_/_0.96)] p-5 shadow-soft md:p-6"
      >
        <CalendarModalHeader title="Select dates" onClose={onClose} />
        <CalendarMonths
          selectedRange={selectedRange}
          blockedDateKeys={blockedDateKeys}
          onSelectDate={onSelectDate}
        />
      </div>
    </CalendarModalOverlay>,
    document.body,
  )
}
