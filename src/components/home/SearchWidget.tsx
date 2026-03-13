'use client'

import { Button } from '@/design-system/components/Button'
import { Container } from '@/design-system/components/Container'
import { DateRangePicker } from '@/design-system/components/DateRangePicker'
import { GlassPanel } from '@/design-system/components/GlassPanel'
import { GlassSelect } from '@/design-system/components/GlassSelect'
import { GuestDetailsPicker } from '@/design-system/components/GuestDetailsPicker'
import { useSearchWidgetNavigation } from '@/hooks/useSearchWidgetNavigation'
import type { SearchWidgetContent } from '@/types/content'

interface SearchWidgetProps {
  content: SearchWidgetContent
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function SelectFieldIcon({ fieldId }: { fieldId: string }) {
  if (fieldId === 'destination') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="10" r="3.2" />
        <path d="M12 21s6-4.35 6-10a6 6 0 0 0-12 0c0 5.65 6 10 6 10Z" />
      </svg>
    )
  }

  if (fieldId === 'category') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
      </svg>
    )
  }

  if (fieldId === 'beds') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 18v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
        <path d="M3 14h18M7 10v4" />
        <path d="M2 18h20" />
      </svg>
    )
  }

  if (fieldId === 'guests') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8h16M4 16h16" />
      <path d="M9 4v16M15 4v16" />
    </svg>
  )
}

export function SearchWidget({ content }: SearchWidgetProps) {
  const widgetControlSizeClass = 'h-11 text-base'
  const {
    selectedFields,
    selectedDateRange,
    primarySelectFields,
    capacitySelectFields,
    selectedGuests,
    setFieldValue,
    setSelectedDateRange,
    setSelectedGuests,
    handleSearchSubmit,
  } = useSearchWidgetNavigation(content)

  return (
    <div className="relative z-30 -mt-14 mb-[-3.5rem] md:-mt-16 md:mb-[-4.5rem]" aria-label="Search stays widget">
      <Container>
        <GlassPanel
          radius="hero"
          depth="elevated"
          padding="lg"
          className="overflow-visible border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.56)_0%,rgba(236,244,249,0.4)_100%)] supports-[backdrop-filter]:bg-white/42 md:p-7"
        >
          <form className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" role="search" onSubmit={handleSearchSubmit}>
            {primarySelectFields.map((field) => (
              <GlassSelect
                key={field.id}
                name={field.id}
                label={field.placeholder}
                value={selectedFields[field.id] ?? ''}
                placeholder={field.placeholder}
                leftIcon={<SelectFieldIcon fieldId={field.id} />}
                onChange={(value) => setFieldValue(field.id, value)}
                options={field.options.map((option) => ({ label: option, value: option }))}
                triggerClassName={widgetControlSizeClass}
              />
            ))}

            {capacitySelectFields.map((field) => (
              <GlassSelect
                key={field.id}
                name={field.id}
                label={field.placeholder}
                value={selectedFields[field.id] ?? ''}
                placeholder={field.placeholder}
                leftIcon={<SelectFieldIcon fieldId={field.id} />}
                onChange={(value) => setFieldValue(field.id, value)}
                options={field.options.map((option) => ({ label: option, value: option }))}
                triggerClassName={widgetControlSizeClass}
              />
            ))}
            <GuestDetailsPicker
              label="Guests"
              value={selectedGuests}
              leftIcon={<SelectFieldIcon fieldId="guests" />}
              onChange={setSelectedGuests}
              triggerClassName={widgetControlSizeClass}
            />

            <DateRangePicker
              label={content.dateRangeField.placeholder}
              value={selectedDateRange}
              onChange={setSelectedDateRange}
            />

            <div>
              <Button
                type="submit"
                className="h-11 w-full gap-2 text-base uppercase tracking-[0.06em]"
                variant="brand"
                aria-label={content.searchButtonLabel}
              >
                <SearchIcon />
                {content.searchButtonLabel}
              </Button>
            </div>
          </form>

          <a
            href={content.helperHref}
            className="mt-5 inline-flex text-xl font-medium text-accent transition-colors duration-300 hover:text-accent-strong"
          >
            {content.helperText}
          </a>
        </GlassPanel>
      </Container>
    </div>
  )
}
