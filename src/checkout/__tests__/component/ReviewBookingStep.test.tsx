import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ReviewBookingStep } from '../../steps/ReviewBookingStep'
import type { BookingQuote } from '@/types/booking'
import type { ResidenceDetail } from '@/types/content'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/design-system/components/GlassPanel', () => ({
  GlassPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/design-system/components/Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    'aria-busy': ariaBusy,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    'aria-busy'?: boolean
  }) => (
    <button onClick={onClick} disabled={disabled} aria-busy={ariaBusy}>
      {children}
    </button>
  ),
}))

vi.mock('@/design-system/components/Typography', () => ({
  Typography: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2 id={id}>{children}</h2>
  ),
}))

vi.mock('../../components/BookingSummaryCard', () => ({
  BookingSummaryCard: () => <div data-testid="booking-summary-card" />,
}))

vi.mock('../../components/PriceBreakdown', () => ({
  PriceBreakdown: ({ quote }: { quote: BookingQuote }) => (
    <div data-testid="price-breakdown">Total: ${quote.quotedTotal}</div>
  ),
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const GUEST_INFO = {
  firstName:        'Juan',
  lastName:         'Pérez',
  email:            'juan@example.com',
  phoneCountryCode: '+52',
  phone:            '3312345678',
  country:          'MX',
  specialNotes:     '',
}

const QUOTE: BookingQuote = {
  residenceSlug:     'villa-azul',
  checkIn:           '2026-03-10',
  checkOut:          '2026-03-12',
  guests:            2,
  quotedNights:      2,
  quotedSubtotal:    500,
  quotedCleaningFee: 80,
  quotedServiceFee:  45,
  quotedTotal:       625,
  currency:          'USD',
  nightlyRates:      [],
}

const RESIDENCE = {
  id:               'res-1',
  name:             'Villa Azul',
  slug:             'villa-azul',
  location:         'Tulum, Mexico',
  imageUrl:         'https://example.com/img.jpg',
  imageGallery:     [],
  nightlyRateUsd:   250,
  promotionalNightlyRateUsd: null,
  guests:           6,
  beds:             3,
  minNights:        2,
  roomDetailsSection: { items: [] },
} as unknown as ResidenceDetail

function renderReviewStep(overrides: Partial<Parameters<typeof ReviewBookingStep>[0]> = {}) {
  const onSubmit       = vi.fn()
  const onBack         = vi.fn()
  const onPolicyChange = vi.fn()
  render(
    <ReviewBookingStep
      guestInformation={GUEST_INFO}
      residence={RESIDENCE}
      quote={QUOTE}
      checkIn="2026-03-10"
      checkOut="2026-03-12"
      guests={2}
      policyAccepted={false}
      submissionError={null}
      isSubmitting={false}
      onPolicyChange={onPolicyChange}
      onSubmit={onSubmit}
      onBack={onBack}
      {...overrides}
    />,
  )
  return { onSubmit, onBack, onPolicyChange }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('ReviewBookingStep — rendering', () => {
  it('renders the booking summary card', () => {
    renderReviewStep()
    expect(screen.getByTestId('booking-summary-card')).toBeInTheDocument()
  })

  it('renders the price breakdown', () => {
    renderReviewStep()
    expect(screen.getByTestId('price-breakdown')).toBeInTheDocument()
  })

  it('renders the guest details', () => {
    renderReviewStep()
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('juan@example.com')).toBeInTheDocument()
  })

  it('renders the policy checkbox', () => {
    renderReviewStep()
    expect(screen.getByRole('checkbox', { name: /policies/i })).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    renderReviewStep()
    expect(screen.getByRole('button', { name: /send booking/i })).toBeInTheDocument()
  })

  it('renders the back button', () => {
    renderReviewStep()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Policy acceptance gate
// ---------------------------------------------------------------------------

describe('ReviewBookingStep — policy acceptance', () => {
  it('shows a policy error if submit is clicked without accepting', async () => {
    const { onSubmit } = renderReviewStep({ policyAccepted: false })
    fireEvent.click(screen.getByRole('button', { name: /send booking/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit when policy is accepted and button clicked', () => {
    const { onSubmit } = renderReviewStep({ policyAccepted: true })
    fireEvent.click(screen.getByRole('button', { name: /send booking/i }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('calls onPolicyChange when checkbox is toggled', () => {
    const { onPolicyChange } = renderReviewStep()
    fireEvent.click(screen.getByRole('checkbox', { name: /policies/i }))
    expect(onPolicyChange).toHaveBeenCalledWith(true)
  })
})

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe('ReviewBookingStep — loading state', () => {
  it('disables the submit button while submitting', () => {
    renderReviewStep({ policyAccepted: true, isSubmitting: true })
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
  })

  it('shows "Sending request…" while submitting', () => {
    renderReviewStep({ isSubmitting: true })
    expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument()
  })

  it('disables the back button while submitting', () => {
    renderReviewStep({ isSubmitting: true })
    expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// Submission error
// ---------------------------------------------------------------------------

describe('ReviewBookingStep — submission error', () => {
  it('shows the submission error message', () => {
    renderReviewStep({
      submissionError: 'Dates are no longer available.',
      policyAccepted:  true,
    })
    expect(screen.getByRole('alert')).toHaveTextContent(/dates are no longer available/i)
  })
})

// ---------------------------------------------------------------------------
// Back navigation
// ---------------------------------------------------------------------------

describe('ReviewBookingStep — back navigation', () => {
  it('calls onBack when the back button is clicked', () => {
    const { onBack } = renderReviewStep()
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
