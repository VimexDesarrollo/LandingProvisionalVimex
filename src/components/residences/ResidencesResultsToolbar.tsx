import { FiSliders, FiUser } from 'react-icons/fi'
import { ResidencesLocationQuickFilter } from '@/components/residences/ResidencesLocationQuickFilter'
import { DateRangePicker } from '@/design-system/components/DateRangePicker'
import { GuestDetailsPicker } from '@/design-system/components/GuestDetailsPicker'
import { Typography } from '@/design-system/components/Typography'
import type { SearchDateRangeValue } from '@/types/search'
import type { GuestDetails } from '@/types/guests'

interface ResidencesResultsToolbarProps {
  isLoading: boolean
  totalResults: number
  activeFiltersCount: number
  destinationOptions: string[]
  selectedDestination: string
  guestDetails: GuestDetails
  dateRange: SearchDateRangeValue
  onOpenFilters: () => void
  onDestinationChange: (value: string) => void
  onGuestDetailsChange: (value: GuestDetails) => void
  onDateRangeChange: (value: SearchDateRangeValue) => void
}

export function ResidencesResultsToolbar({
  isLoading,
  totalResults,
  activeFiltersCount,
  destinationOptions,
  selectedDestination,
  guestDetails,
  dateRange,
  onOpenFilters,
  onDestinationChange,
  onGuestDetailsChange,
  onDateRangeChange,
}: ResidencesResultsToolbarProps) {
  const toolbarControlSizeClass = 'h-11 text-base'

  return (
    <header className="relative z-40 rounded-xl border border-white/60 bg-white/58 p-4 shadow-soft backdrop-blur-xl md:p-5">
      <h2 className="sr-only">Search results</h2>
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-[15rem] space-y-0.5">
          <Typography className="max-w-[28ch] text-base leading-tight text-ink-soft">
            {isLoading
              ? 'Loading residences...'
              : `Showing ${totalResults} residence${totalResults === 1 ? '' : 's'} matching your filters.`}
          </Typography>
        </div>
        <div />
      </div>
      <div className="mt-3 flex flex-col gap-2 border-t border-white/50 pt-3 md:flex-row md:items-center md:justify-between">
        <ResidencesLocationQuickFilter
          options={destinationOptions}
          selectedLocation={selectedDestination}
          onSelectLocation={onDestinationChange}
        />
        <button
          type="button"
          className="liquid-click liquid-click--hero inline-flex items-center gap-2 self-start rounded-pill bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-strong md:self-auto"
          aria-label="Open filters panel"
          onClick={onOpenFilters}
        >
          <FiSliders aria-hidden className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 ? (
            <span className="rounded-full bg-white/24 px-2 py-[2px] text-xs font-semibold text-white">{activeFiltersCount}</span>
          ) : null}
        </button>
      </div>
      <div className="mt-2 border-t border-white/50 pt-3">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="space-y-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
            Guests
            <GuestDetailsPicker
              label="Guests"
              value={guestDetails}
              placeholder="Guests"
              leftIcon={<FiUser aria-hidden className="h-5 w-5 text-ink-soft" />}
              onChange={onGuestDetailsChange}
              triggerClassName={toolbarControlSizeClass}
            />
          </div>
          <div className="space-y-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
            Dates
            <DateRangePicker
              label="Dates"
              value={dateRange}
              onChange={onDateRangeChange}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
