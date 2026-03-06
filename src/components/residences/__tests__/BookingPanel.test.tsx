import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BookingPanel } from '@/components/residences/BookingPanel'

vi.mock('@/design-system/components/GuestDetailsPicker', () => ({
  GuestDetailsPicker: () => null,
}))
vi.mock('@/design-system/components/DateRangePicker', () => ({
  DateRangePicker: () => null,
}))

const baseProps = {
  nightlyRateUsd: 200,
  promotionalNightlyRateUsd: undefined,
  maxGuests: 8,
  selectedRange: { from: '2026-08-10', to: '2026-08-13' },
  selectedGuestDetails: {
    adults: 3,
    children: 1,
    infants: 0,
    pets: false,
  },
  onGuestDetailsChange: vi.fn(),
  pricing: null,
  isPricingLoading: false,
}

describe('BookingPanel', () => {
  it('shows selected guests inside the tariff breakdown module', () => {
    render(<BookingPanel {...baseProps} />)

    const guestsRow = screen.getByText('Guests').closest('div')
    expect(guestsRow).not.toBeNull()

    if (!guestsRow) {
      throw new Error('Guests row not found')
    }

    expect(within(guestsRow).getByText('4')).toBeDefined()
  })

  it('renders promotional pricing with highlighted current rate and strikethrough original rate', () => {
    render(
      <BookingPanel
        {...baseProps}
        nightlyRateUsd={300}
        promotionalNightlyRateUsd={240}
      />,
    )

    expect(screen.getByText('Promotional price')).toBeDefined()
    expect(screen.getByText('$240')).toBeDefined()
    expect(screen.getByText('$300').className).toContain('line-through')
  })

  it('disables booking when selected range does not satisfy minimum nights', () => {
    render(
      <BookingPanel
        {...baseProps}
        selectedRange={{ from: '2026-08-10', to: '2026-08-12' }}
        minNights={3}
      />,
    )

    expect(screen.getByText('Minimum stay for this residence is 3 nights.')).toBeDefined()
    const button = screen.getByRole('button', { name: 'Select dates to book' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })
})
