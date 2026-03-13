import { DayPicker, type DateRange } from 'react-day-picker'
import { useEffect, useMemo, useState } from 'react'

interface CalendarMonthsProps {
  selectedRange: DateRange | undefined
  blockedDateKeys?: string[]
  onSelectDate: (date: Date) => void
}

function parseDateKey(value: string): Date {
  const [yearText, monthText, dayText] = value.split('-')
  return new Date(Number(yearText), Number(monthText) - 1, Number(dayText))
}

export function CalendarMonths({ selectedRange, blockedDateKeys = [], onSelectDate }: CalendarMonthsProps) {
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined)
  const disabledDates = useMemo(() => blockedDateKeys.map(parseDateKey), [blockedDateKeys])
  const checkInTime = selectedRange?.from ? new Date(
    selectedRange.from.getFullYear(),
    selectedRange.from.getMonth(),
    selectedRange.from.getDate(),
  ).getTime() : undefined
  const checkOutTime = selectedRange?.to ? new Date(
    selectedRange.to.getFullYear(),
    selectedRange.to.getMonth(),
    selectedRange.to.getDate(),
  ).getTime() : undefined
  const hasOnlyCheckIn = Boolean(
    checkInTime !== undefined
      && (checkOutTime === undefined || checkOutTime <= checkInTime),
  )

  const hoverTime = useMemo(() => {
    if (!hoverDate) {
      return undefined
    }
    return new Date(
      hoverDate.getFullYear(),
      hoverDate.getMonth(),
      hoverDate.getDate(),
    ).getTime()
  }, [hoverDate])

  const hasPreviewRange = Boolean(
    hasOnlyCheckIn
      && checkInTime !== undefined
      && hoverTime !== undefined
      && hoverTime > checkInTime,
  )

  useEffect(() => {
    if (selectedRange?.to) {
      setHoverDate(undefined)
    }
  }, [selectedRange?.to])

  return (
    <div className="flex w-full justify-center">
      <DayPicker
        mode="range"
        numberOfMonths={2}
        pagedNavigation
        disabled={disabledDates}
        selected={selectedRange}
        onDayClick={onSelectDate}
        onDayMouseEnter={(date) => {
          if (hasOnlyCheckIn) {
            setHoverDate(date)
          }
        }}
        onDayMouseLeave={() => {
          if (hasOnlyCheckIn) {
            setHoverDate(undefined)
          }
        }}
        className="rdp-vimex mx-auto"
        classNames={{
          months: 'rdp-months mx-auto flex justify-center',
          month: 'rdp-month rounded-xl bg-white p-2',
        }}
        modifiers={{
          preview_middle: (day) => {
            if (!hasPreviewRange || checkInTime === undefined || hoverTime === undefined) {
              return false
            }
            const dayTime = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime()
            return dayTime > checkInTime && dayTime < hoverTime
          },
          preview_end: (day) => {
            if (!hasPreviewRange || hoverTime === undefined) {
              return false
            }
            const dayTime = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime()
            return dayTime === hoverTime
          },
        }}
        modifiersClassNames={{
          selected: 'vimex-selected-day',
          range_start: 'vimex-range-start',
          range_middle: 'vimex-range-middle',
          range_end: 'vimex-range-end',
          preview_middle: 'vimex-range-middle',
          preview_end: 'vimex-range-end',
        }}
      />
    </div>
  )
}
