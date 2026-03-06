import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResidencesFiltersForm } from '@/components/residences/ResidencesFiltersForm'

// Mock design-system components to isolate ResidencesFiltersForm behaviour
vi.mock('@/design-system/components/GlassSelect', () => ({
  GlassSelect: () => null,
}))
vi.mock('@/design-system/components/GuestDetailsPicker', () => ({
  GuestDetailsPicker: () => null,
}))
vi.mock('@/design-system/components/PriceRangeSlider', () => ({
  PriceRangeSlider: () => null,
}))
vi.mock('@/design-system/components/SelectableIconChip', () => ({
  // Render label as a button so toggling can also be tested
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SelectableIconChip: ({ label, onToggle, selected }: any) => (
    <button type="button" aria-pressed={selected} onClick={() => onToggle(!selected)}>
      {label}
    </button>
  ),
}))
vi.mock('@/design-system/components/Typography', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Typography: ({ children }: any) => <span>{children}</span>,
}))
vi.mock('@/design-system/components/Checkbox', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Checkbox: ({ label, checked, onChange }: any) => (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  ),
}))

const baseProps = {
  filters: {},
  availablePrices: [260, 920],
  filteredResultsCount: 10,
  isLoadingResults: false,
  destinationOptions: ['Playa del Carmen', 'Tulum', 'Akumal'],
  categoryOptions: ['Oceanfront Villa', 'Family Home', 'Penthouse'],
  updateSingleParam: vi.fn(),
  updateGuestParams: vi.fn(),
  updatePriceRangeParams: vi.fn(),
  updateMultiParam: vi.fn(),
  clearAllFilters: vi.fn(),
  closeFilters: vi.fn(),
}

describe('ResidencesFiltersForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('apply button label', () => {
    it('shows "Updating properties..." when isLoadingResults is true', () => {
      render(<ResidencesFiltersForm {...baseProps} isLoadingResults={true} />)
      expect(screen.getByText('Updating properties...')).toBeDefined()
    })

    it('shows plural count when filteredResultsCount > 1', () => {
      render(<ResidencesFiltersForm {...baseProps} filteredResultsCount={8} />)
      expect(screen.getByText('Show 8 properties')).toBeDefined()
    })

    it('uses singular when filteredResultsCount is 1', () => {
      render(<ResidencesFiltersForm {...baseProps} filteredResultsCount={1} />)
      expect(screen.getByText('Show 1 property')).toBeDefined()
    })

    it('shows "Show 0 properties" when there are no results', () => {
      render(<ResidencesFiltersForm {...baseProps} filteredResultsCount={0} />)
      expect(screen.getByText('Show 0 properties')).toBeDefined()
    })
  })

  describe('Clear filters button', () => {
    it('calls clearAllFilters when clicked', () => {
      const clearAllFilters = vi.fn()
      render(<ResidencesFiltersForm {...baseProps} clearAllFilters={clearAllFilters} />)
      fireEvent.click(screen.getByText('Clear filters'))
      expect(clearAllFilters).toHaveBeenCalledOnce()
    })
  })

  describe('apply / close button', () => {
    it('calls closeFilters when the apply button is clicked', () => {
      const closeFilters = vi.fn()
      render(<ResidencesFiltersForm {...baseProps} closeFilters={closeFilters} filteredResultsCount={5} />)
      fireEvent.click(screen.getByText('Show 5 properties'))
      expect(closeFilters).toHaveBeenCalledOnce()
    })

    it('does not render the apply button when closeFilters is not provided', () => {
      render(<ResidencesFiltersForm {...baseProps} closeFilters={undefined} filteredResultsCount={5} />)
      expect(screen.queryByText('Show 5 properties')).toBeNull()
    })
  })

  describe('amenity chips', () => {
    it('renders all amenity options', () => {
      render(<ResidencesFiltersForm {...baseProps} />)
      expect(screen.getByRole('button', { name: 'Air Conditioning' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Kitchen' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Pets Allowed' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Wireless Internet' })).toBeDefined()
    })

    it('renders quick filter options (Pool, Ocean View, Free Internet, Pet Friendly)', () => {
      render(<ResidencesFiltersForm {...baseProps} />)
      expect(screen.getByRole('button', { name: 'Ocean View' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Free Internet' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Pet Friendly' })).toBeDefined()
    })

    it('calls updateMultiParam with amenity key when an amenity chip is toggled on', () => {
      const updateMultiParam = vi.fn()
      render(<ResidencesFiltersForm {...baseProps} updateMultiParam={updateMultiParam} />)
      fireEvent.click(screen.getByRole('button', { name: 'Pets Allowed' }))
      expect(updateMultiParam).toHaveBeenCalledWith('amenity', 'pets-allowed', true)
    })

    it('calls updateMultiParam with quick key when a quick-filter chip is toggled on', () => {
      const updateMultiParam = vi.fn()
      render(<ResidencesFiltersForm {...baseProps} updateMultiParam={updateMultiParam} />)
      fireEvent.click(screen.getByRole('button', { name: 'Ocean View' }))
      expect(updateMultiParam).toHaveBeenCalledWith('quick', 'ocean-view', true)
    })

    it('marks an amenity chip as selected when it appears in filters.amenities', () => {
      render(<ResidencesFiltersForm {...baseProps} filters={{ amenities: ['pool'] }} />)
      // The Pool chip from amenityOptions (not quickFilterOptions)
      const chips = screen.getAllByRole('button', { name: 'Pool' })
      const amenityPoolChip = chips[0]
      expect(amenityPoolChip.getAttribute('aria-pressed')).toBe('true')
    })
  })
})
