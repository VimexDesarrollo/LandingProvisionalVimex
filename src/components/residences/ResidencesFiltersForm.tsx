import { Checkbox } from '@/design-system/components/Checkbox'
import { GlassSelect } from '@/design-system/components/GlassSelect'
import { GuestDetailsPicker } from '@/design-system/components/GuestDetailsPicker'
import { PriceRangeSlider } from '@/design-system/components/PriceRangeSlider'
import { SelectableIconChip } from '@/design-system/components/SelectableIconChip'
import { Typography } from '@/design-system/components/Typography'
import { getAmenityIcon } from '@/components/residences/amenity.meta'
import { amenityOptions, quickFilterOptions } from '@/components/residences/filters.constants'
import type { ResidenceFilters } from '@/services/residenceService'
import { DEFAULT_GUEST_DETAILS, type GuestDetails } from '@/types/guests'

const IconPin = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z" />
    <circle cx="12" cy="10" r="2.7" />
  </svg>
)

const IconHome = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="m4 11 8-7 8 7" />
    <path d="M6 11v9h12v-9" />
  </svg>
)

const IconBed = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 18v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
    <path d="M3 14h18" />
    <path d="M7 10v4" />
    <path d="M2 18h20" />
  </svg>
)

const IconUser = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
)

interface ResidencesFiltersFormProps {
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
  closeFilters?: () => void
}

export function ResidencesFiltersForm({
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
  closeFilters,
}: ResidencesFiltersFormProps) {
  const applyFiltersLabel = isLoadingResults
    ? 'Updating properties...'
    : `Show ${filteredResultsCount} ${filteredResultsCount === 1 ? 'property' : 'properties'}`

  return (
    <div className="space-y-4 pb-20">
      <Checkbox
        className="mt-3"
        checked={Boolean(filters.flexibleCheckin)}
        label="Flexible Check-in"
        labelClassName="font-semibold"
        onChange={(checked) => updateSingleParam('flexibleCheckin', checked ? 'true' : '')}
      />

      <Typography as="h3" className="mt-6 border-t border-card-border pt-4 text-base font-semibold text-ink">
        Filter properties by
      </Typography>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="space-y-1 text-sm font-semibold text-ink-soft">
          Bedrooms
          <GlassSelect
            label="Bedrooms"
            value={filters.bedsMin ? `${filters.bedsMin}+` : 'All'}
            onChange={(value) => updateSingleParam('beds', value)}
            leftIcon={<IconBed />}
            options={[
              { label: 'All', value: 'All' },
              { label: '1+', value: '1+' },
              { label: '2+', value: '2+' },
              { label: '3+', value: '3+' },
              { label: '4+', value: '4+' },
            ]}
          />
        </div>
        <div className="space-y-1 text-sm font-semibold text-ink-soft">
          Guests
          <GuestDetailsPicker
            label="Guests"
            value={filters.guestDetails ?? DEFAULT_GUEST_DETAILS}
            onChange={updateGuestParams}
            leftIcon={<IconUser />}
          />
        </div>
        <div className="space-y-1 text-sm font-semibold text-ink-soft">
          Destinations
          <GlassSelect
            label="Destinations"
            value={filters.destination ?? 'All'}
            onChange={(value) => updateSingleParam('destination', value)}
            leftIcon={<IconPin />}
            options={[{ label: 'All', value: 'All' }, ...destinationOptions.map((option) => ({ label: option, value: option }))]}
          />
        </div>

        <div className="space-y-1 text-sm font-semibold text-ink-soft">
          Categories
          <GlassSelect
            label="Categories"
            value={filters.category ?? 'All'}
            onChange={(value) => updateSingleParam('category', value)}
            leftIcon={<IconHome />}
            options={[{ label: 'All', value: 'All' }, ...categoryOptions.map((option) => ({ label: option, value: option }))]}
          />
        </div>
      </div>

      <div className="mt-4 border-t border-card-border pt-3">
        <Typography as="h4" className="text-sm font-semibold uppercase tracking-[0.06em] text-ink-soft">
          Amenities
        </Typography>
        <div className="mt-3 flex flex-wrap gap-2">
          {amenityOptions.map((option) => (
            <SelectableIconChip
              key={option.value}
              label={option.label}
              selected={Boolean(filters.amenities?.includes(option.value))}
              icon={getAmenityIcon(option.value)}
              onToggle={(nextSelected) => updateMultiParam('amenity', option.value, nextSelected)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-card-border pt-3">
        <Typography as="h4" className="text-sm font-semibold uppercase tracking-[0.06em] text-ink-soft">
          Booking Options
        </Typography>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickFilterOptions.map((option) => (
            <SelectableIconChip
              key={option.value}
              label={option.label}
              selected={Boolean(filters.quickFilters?.includes(option.value))}
              icon={getAmenityIcon(option.value)}
              onToggle={(nextSelected) => updateMultiParam('quick', option.value, nextSelected)}
            />
          ))}
        </div>
      </div>

      <PriceRangeSlider
        prices={availablePrices}
        selectedMin={filters.priceMin}
        selectedMax={filters.priceMax}
        onChange={updatePriceRangeParams}
      />

      <div className="sticky bottom-0 z-30 mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-card-border bg-white/95 py-4 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90">
        <button
          type="button"
          className="text-sm font-semibold uppercase tracking-[0.06em] text-ink-soft transition-colors hover:text-ink"
          onClick={clearAllFilters}
        >
          Clear filters
        </button>
        {closeFilters ? (
          <button
            type="button"
            className="liquid-click liquid-click--hero rounded-pill bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
            onClick={closeFilters}
          >
            {applyFiltersLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
