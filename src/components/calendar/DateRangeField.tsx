'use client'

import { FiCalendar } from 'react-icons/fi'

interface DateRangeFieldProps {
  label: string
  value: string
  expanded: boolean
  controlsId: string
  onOpen: () => void
}

export function DateRangeField({
  label,
  value,
  expanded,
  controlsId,
  onOpen,
}: DateRangeFieldProps) {
  return (
    <button
      type="button"
      className="booking-field booking-field--control relative flex h-11 w-full items-center justify-between px-3 pl-10 text-base"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controlsId}
      aria-haspopup="dialog"
      onClick={onOpen}
    >
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <FiCalendar aria-hidden className="h-5 w-5 text-ink-soft" />
      </span>
      <span className="truncate">{value}</span>
      <span className="pointer-events-none ml-2 text-ink-soft">▾</span>
    </button>
  )
}
