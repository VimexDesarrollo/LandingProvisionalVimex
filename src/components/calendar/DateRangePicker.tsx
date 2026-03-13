'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { CalendarModal } from '@/components/calendar/CalendarModal'
import { DateRangeField } from '@/components/calendar/DateRangeField'
import { cn } from '@/lib/cn'
import type { SearchDateRangeValue } from '@/types/search'

interface DateRangePickerProps {
  label: string
  value: SearchDateRangeValue
  onChange: (nextRange: SearchDateRangeValue) => void
  className?: string
  blockedDateKeys?: string[]
}

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(value: string): Date {
  const [yearText, monthText, dayText] = value.split('-')
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  return new Date(year, month - 1, day)
}

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

function formatDateLabel(value?: string): string | null {
  if (!value) {
    return null
  }

  return shortDateFormatter.format(parseDateKey(value))
}

function buildFieldValue(range: SearchDateRangeValue): string {
  const startLabel = formatDateLabel(range.from)
  const endLabel = formatDateLabel(range.to)

  if (!startLabel) {
    return 'Select dates'
  }

  if (!endLabel) {
    return startLabel
  }

  return `${startLabel} — ${endLabel}`
}

function toDayPickerRange(range: SearchDateRangeValue): DateRange | undefined {
  if (!range.from && !range.to) {
    return undefined
  }
  return {
    from: range.from ? parseDateKey(range.from) : undefined,
    to: range.to ? parseDateKey(range.to) : undefined,
  }
}

function hasCompletedValue(range: SearchDateRangeValue): boolean {
  return Boolean(range.from && range.to && range.to > range.from)
}

function applySelectionRule(currentRange: SearchDateRangeValue, clickedDate: string): SearchDateRangeValue {
  const currentCheckIn = currentRange.from
  const currentCheckOut = currentRange.to

  if (!currentCheckIn) {
    return { from: clickedDate, to: undefined }
  }

  if (!currentCheckOut) {
    if (clickedDate > currentCheckIn) {
      return { from: currentCheckIn, to: clickedDate }
    }
    return { from: clickedDate, to: undefined }
  }

  return { from: clickedDate, to: undefined }
}

export function DateRangePicker({ label, value, onChange, className, blockedDateKeys = [] }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const modalId = useId()
  const [draftValue, setDraftValue] = useState<SearchDateRangeValue | null>(null)

  const displayRange = isOpen ? (draftValue ?? value) : value
  const fieldValue = useMemo(() => buildFieldValue(displayRange), [displayRange])
  const selectedRange = useMemo(() => toDayPickerRange(value), [value])
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(selectedRange)

  useEffect(() => {
    if (!isOpen) {
      setDraftRange(selectedRange)
      setDraftValue(null)
    }
  }, [isOpen, selectedRange])

  return (
    <div className={cn('relative', className)}>
      <DateRangeField
        label={label}
        value={fieldValue}
        expanded={isOpen}
        controlsId={modalId}
        onOpen={() => {
          // Start a new draft selection flow, without committing yet.
          setDraftRange(undefined)
          setDraftValue({})
          setIsOpen(true)
        }}
      />

      {isOpen ? (
        <CalendarModal
          id={modalId}
          selectedRange={draftRange}
          blockedDateKeys={blockedDateKeys}
          onSelectDate={(date) => {
            const nextValue = applySelectionRule(draftValue ?? {}, toDateKey(date))
            setDraftRange(toDayPickerRange(nextValue))
            setDraftValue(nextValue)
            if (hasCompletedValue(nextValue)) {
              onChange(nextValue)
              setIsOpen(false)
            }
          }}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </div>
  )
}
