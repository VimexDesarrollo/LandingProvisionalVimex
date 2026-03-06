'use client'

import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useBooking } from '@/context/booking-context'
import { writeGuestDetailsToSearchParams } from '@/lib/guestDetails'
import type { SearchWidgetContent, SearchSelectField } from '@/types/content'
import type { GuestDetails } from '@/types/guests'
import type { SearchDateRangeValue, SearchFieldValues } from '@/types/search'

const PRIMARY_FIELD_IDS = new Set<string>(['destination', 'category'])
const GUEST_FIELD_ID = 'guests'

interface UseSearchWidgetNavigationResult {
  selectedFields: SearchFieldValues
  selectedDateRange: SearchDateRangeValue
  primarySelectFields: SearchSelectField[]
  capacitySelectFields: SearchSelectField[]
  selectedGuests: GuestDetails
  setFieldValue: (fieldId: string, value: string) => void
  setSelectedDateRange: (nextRange: SearchDateRangeValue) => void
  setSelectedGuests: (nextValue: GuestDetails) => void
  handleSearchSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function buildSearchWidgetQuery(
  content: SearchWidgetContent,
  selectedFields: SearchFieldValues,
  selectedDateRange: SearchDateRangeValue,
  selectedGuests: GuestDetails,
): URLSearchParams {
  const query = new URLSearchParams()

  content.selectFields.forEach((field) => {
    if (field.id === GUEST_FIELD_ID) {
      return
    }

    const selectedValue = selectedFields[field.id]
    if (selectedValue) {
      query.set(field.id, selectedValue)
    }
  })

  if (selectedDateRange.from) {
    query.set(content.dateRangeField.startFieldName, selectedDateRange.from)
  }

  if (selectedDateRange.to) {
    query.set(content.dateRangeField.endFieldName, selectedDateRange.to)
  }

  writeGuestDetailsToSearchParams(query, selectedGuests)

  return query
}

export function useSearchWidgetNavigation(content: SearchWidgetContent): UseSearchWidgetNavigationResult {
  const router = useRouter()
  const {
    selectedGuestDetails: selectedGuests,
    setSelectedGuestDetails: setSelectedGuests,
  } = useBooking()
  const [selectedFields, setSelectedFields] = useState<SearchFieldValues>({})
  const [selectedDateRange, setSelectedDateRange] = useState<SearchDateRangeValue>({})

  const primarySelectFields = useMemo(
    () => content.selectFields.filter((field) => PRIMARY_FIELD_IDS.has(field.id)),
    [content.selectFields],
  )

  const capacitySelectFields = useMemo(
    () => content.selectFields.filter((field) => !PRIMARY_FIELD_IDS.has(field.id) && field.id !== GUEST_FIELD_ID),
    [content.selectFields],
  )

  const setFieldValue = useCallback((fieldId: string, value: string) => {
    setSelectedFields((current) => ({ ...current, [fieldId]: value }))
  }, [])

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const query = buildSearchWidgetQuery(content, selectedFields, selectedDateRange, selectedGuests)
      const queryString = query.toString()
      const nextUrl = queryString ? `${content.helperHref}?${queryString}` : content.helperHref
      router.push(nextUrl)
    },
    [content, router, selectedDateRange, selectedFields, selectedGuests],
  )

  return {
    selectedFields,
    selectedDateRange,
    primarySelectFields,
    capacitySelectFields,
    selectedGuests,
    setFieldValue,
    setSelectedDateRange: (nextRange: SearchDateRangeValue) => setSelectedDateRange(nextRange),
    setSelectedGuests: (nextGuests: GuestDetails) => setSelectedGuests(nextGuests),
    handleSearchSubmit,
  }
}
