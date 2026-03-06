import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ResidencesResultsToolbar } from '@/components/residences/ResidencesResultsToolbar'
import { DEFAULT_GUEST_DETAILS } from '@/types/guests'
import type { SearchDateRangeValue } from '@/types/search'

// Mock complex design-system controls so they don't break in jsdom
vi.mock('@/design-system/components/GuestDetailsPicker', () => ({
  GuestDetailsPicker: () => null,
}))
vi.mock('@/design-system/components/DateRangePicker', () => ({
  DateRangePicker: ({ value, onChange }: { value: SearchDateRangeValue; onChange: (value: SearchDateRangeValue) => void }) => (
    <button type="button" aria-label="Date range picker" onClick={() => onChange({ from: '2026-03-10', to: '2026-03-13' })}>
      {value.from ?? 'no-checkin'}-{value.to ?? 'no-checkout'}
    </button>
  ),
}))

const baseProps = {
  isLoading: false,
  totalResults: 12,
  activeFiltersCount: 0,
  destinationOptions: ['Playa del Carmen', 'Tulum', 'Akumal'],
  selectedDestination: '',
  guestDetails: DEFAULT_GUEST_DETAILS,
  dateRange: {},
  onOpenFilters: vi.fn(),
  onDestinationChange: vi.fn(),
  onGuestDetailsChange: vi.fn(),
  onDateRangeChange: vi.fn(),
}

describe('ResidencesResultsToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('results count text', () => {
    it('shows "Loading residences..." when isLoading is true', () => {
      render(<ResidencesResultsToolbar {...baseProps} isLoading={true} />)
      expect(screen.getByText('Loading residences...')).toBeDefined()
    })

    it('shows the count with plural form when totalResults > 1', () => {
      render(<ResidencesResultsToolbar {...baseProps} totalResults={12} />)
      expect(screen.getByText('Showing 12 residences matching your filters.')).toBeDefined()
    })

    it('uses singular form when totalResults is 1', () => {
      render(<ResidencesResultsToolbar {...baseProps} totalResults={1} />)
      expect(screen.getByText('Showing 1 residence matching your filters.')).toBeDefined()
    })

    it('shows 0 residences when totalResults is 0', () => {
      render(<ResidencesResultsToolbar {...baseProps} totalResults={0} />)
      expect(screen.getByText('Showing 0 residences matching your filters.')).toBeDefined()
    })
  })

  describe('active filters badge', () => {
    it('does not show a badge when activeFiltersCount is 0', () => {
      render(<ResidencesResultsToolbar {...baseProps} activeFiltersCount={0} />)
      expect(screen.queryByText('0')).toBeNull()
    })

    it('shows the badge with the correct count when activeFiltersCount > 0', () => {
      render(<ResidencesResultsToolbar {...baseProps} activeFiltersCount={3} />)
      expect(screen.getByText('3')).toBeDefined()
    })
  })

  describe('Filters button', () => {
    it('calls onOpenFilters when the Filters button is clicked', () => {
      const onOpenFilters = vi.fn()
      render(<ResidencesResultsToolbar {...baseProps} onOpenFilters={onOpenFilters} />)
      fireEvent.click(screen.getByRole('button', { name: /open filters panel/i }))
      expect(onOpenFilters).toHaveBeenCalledOnce()
    })
  })

  describe('location quick filter', () => {
    // Scope all location queries to the quick-filter container to avoid
    // ambiguity if the same destination name appears elsewhere in the DOM.
    function getQuickFilter() {
      return within(screen.getByLabelText('Quick location filter'))
    }

    it('renders All plus each destination as a button', () => {
      render(<ResidencesResultsToolbar {...baseProps} />)
      const qf = getQuickFilter()
      expect(qf.getByRole('button', { name: 'All' })).toBeDefined()
      expect(qf.getByRole('button', { name: 'Playa del Carmen' })).toBeDefined()
      expect(qf.getByRole('button', { name: 'Tulum' })).toBeDefined()
      expect(qf.getByRole('button', { name: 'Akumal' })).toBeDefined()
    })

    it('calls onDestinationChange with the destination name when a location is clicked', () => {
      const onDestinationChange = vi.fn()
      render(<ResidencesResultsToolbar {...baseProps} onDestinationChange={onDestinationChange} />)
      fireEvent.click(getQuickFilter().getByRole('button', { name: 'Tulum' }))
      expect(onDestinationChange).toHaveBeenCalledWith('Tulum')
    })

    it('calls onDestinationChange with empty string when "All" is clicked', () => {
      const onDestinationChange = vi.fn()
      render(<ResidencesResultsToolbar {...baseProps} onDestinationChange={onDestinationChange} />)
      fireEvent.click(getQuickFilter().getByRole('button', { name: 'All' }))
      expect(onDestinationChange).toHaveBeenCalledWith('')
    })

    it('marks the selected destination as active (aria-pressed=true)', () => {
      render(<ResidencesResultsToolbar {...baseProps} selectedDestination="Tulum" />)
      const button = getQuickFilter().getByRole('button', { name: 'Tulum' })
      expect(button.getAttribute('aria-pressed')).toBe('true')
    })
  })

  describe('date range picker', () => {
    it('renders the date range picker next to guest controls', () => {
      render(<ResidencesResultsToolbar {...baseProps} />)
      expect(screen.getByRole('button', { name: 'Date range picker' })).toBeDefined()
    })

    it('calls onDateRangeChange when the date range picker changes', () => {
      const onDateRangeChange = vi.fn()
      render(<ResidencesResultsToolbar {...baseProps} onDateRangeChange={onDateRangeChange} />)
      fireEvent.click(screen.getByRole('button', { name: 'Date range picker' }))
      expect(onDateRangeChange).toHaveBeenCalledWith({ from: '2026-03-10', to: '2026-03-13' })
    })
  })
})
