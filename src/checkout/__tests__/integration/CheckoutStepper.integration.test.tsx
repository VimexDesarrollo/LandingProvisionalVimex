import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckoutStepper } from '../../CheckoutStepper'
import type { BookingQuote, CheckoutSession } from '@/types/booking'
import type { BookingRequestResponse } from '@/types/booking'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockPush    = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useParams:       () => ({ slug: 'villa-azul' }),
  useRouter:       () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => new URLSearchParams('checkoutSession=session-tok-1'),
}))

const mockUseCheckoutSession = vi.fn()
const mockUseBookingQuote    = vi.fn()
const mockUseCountries       = vi.fn()
const mockUseResidenceDetail = vi.fn()
const mockCreateBookingRequest = vi.fn()

vi.mock('@/hooks/useCheckoutSession',  () => ({ useCheckoutSession:  (...args: unknown[]) => mockUseCheckoutSession(...args) }))
vi.mock('@/hooks/useBookingQuote',     () => ({ useBookingQuote:     (...args: unknown[]) => mockUseBookingQuote(...args) }))
vi.mock('@/hooks/useCountries',        () => ({ useCountries:        ()                  => mockUseCountries() }))
vi.mock('@/hooks/useResidenceDetail',  () => ({ useResidenceDetail:  (...args: unknown[]) => mockUseResidenceDetail(...args) }))

vi.mock('@/services/bookingRequestService', () => ({
  bookingRequestService: {
    createBookingRequest: (...args: unknown[]) => mockCreateBookingRequest(...args),
  },
  getBookingConflict: () => null,
}))

// Simplify design system components
vi.mock('@/design-system/components/Container',  () => ({ Container:  ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('@/design-system/components/GlassPanel', () => ({ GlassPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('@/design-system/components/Button',     () => ({
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}))
vi.mock('@/design-system/components/Typography', () => ({
  Typography: ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id}>{children}</h2>,
}))
vi.mock('@/components/booking-request/CountryCombobox', () => ({
  CountryCombobox: ({ label, onChange }: { label: string; onChange: (v: string) => void }) => (
    <button
      data-testid={`combobox-${label}`}
      onClick={() => onChange(label === 'Phone country code' ? '+52' : 'MX')}
    >
      {label}
    </button>
  ),
}))
vi.mock('../../components/BookingSummaryCard', () => ({ BookingSummaryCard: () => <div data-testid="summary" /> }))
vi.mock('../../components/PriceBreakdown',     () => ({ PriceBreakdown:     () => <div data-testid="price" /> }))
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <img alt={alt} /> }))
vi.mock('next/link',  () => ({ default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SESSION: CheckoutSession = {
  token:             'session-tok-1',
  residenceSlug:     'villa-azul',
  checkIn:           '2026-03-10',
  checkOut:          '2026-03-12',
  guests:            2,
  firstName:         '',
  lastName:          '',
  phone:             '',
  identityEmail:     '',
  quotedNights:      2,
  quotedSubtotal:    500,
  quotedCleaningFee: 80,
  quotedServiceFee:  45,
  quotedTotal:       625,
  currency:          'USD',
  accessState:       'guest',
  expiresAt:         '2026-04-01T00:00:00Z',
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
  id:       'res-1',
  name:     'Villa Azul',
  slug:     'villa-azul',
  location: 'Tulum, Mexico',
  imageUrl: '',
  imageGallery: [],
  nightlyRateUsd: 250,
  promotionalNightlyRateUsd: null,
  guests: 6,
  beds: 3,
  minNights: 2,
  roomDetailsSection: { items: [] },
}

const COUNTRIES = [
  { code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' },
]

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  mockUseCheckoutSession.mockReturnValue({ checkoutSession: SESSION, isLoading: false, error: null })
  mockUseBookingQuote.mockReturnValue({ quote: QUOTE, isLoading: false, error: null, setQuote: vi.fn(), refetch: vi.fn() })
  mockUseCountries.mockReturnValue({ countries: COUNTRIES, isLoading: false, error: false })
  mockUseResidenceDetail.mockReturnValue({ residence: RESIDENCE, isLoading: false, error: null })
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fillAndAdvanceStep1() {
  fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), { target: { value: 'Juan' } })
  fireEvent.change(screen.getByRole('textbox', { name: /last name/i }),  { target: { value: 'Pérez' } })
  fireEvent.change(screen.getByRole('textbox', { name: /email/i }),      { target: { value: 'juan@example.com' } })
  fireEvent.change(screen.getByRole('textbox', { name: /phone number/i }), { target: { value: '3312345678' } })
  fireEvent.click(screen.getByTestId('combobox-Phone country code'))
  fireEvent.click(screen.getByTestId('combobox-Country of residence'))
  fireEvent.click(screen.getByRole('button', { name: /continue/i }))
  await waitFor(() => {
    expect(screen.getByRole('checkbox', { name: /policies/i })).toBeInTheDocument()
  })
}

// ---------------------------------------------------------------------------
// Initial render
// ---------------------------------------------------------------------------

describe('CheckoutStepper — initial state', () => {
  it('renders the step indicator', () => {
    render(<CheckoutStepper />)
    expect(screen.getByRole('navigation', { name: /checkout progress/i })).toBeInTheDocument()
  })

  it('starts on step 1 (guest information)', () => {
    render(<CheckoutStepper />)
    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument()
  })

  it('shows a loading skeleton when data is loading', () => {
    mockUseCheckoutSession.mockReturnValue({ checkoutSession: null, isLoading: true, error: null })
    render(<CheckoutStepper />)
    // Skeleton elements (animated pulses) — no form fields
    expect(screen.queryByRole('textbox', { name: /first name/i })).not.toBeInTheDocument()
  })

  it('shows an error when the session fails to load', () => {
    mockUseCheckoutSession.mockReturnValue({ checkoutSession: null, isLoading: false, error: 'Session expired.' })
    render(<CheckoutStepper />)
    expect(screen.getByText(/checkout unavailable/i)).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Navigation: step 1 → step 2
// ---------------------------------------------------------------------------

describe('CheckoutStepper — step 1 to step 2', () => {
  it('advances to review step after filling valid guest info', async () => {
    render(<CheckoutStepper />)
    await fillAndAdvanceStep1()
    expect(screen.getByRole('checkbox', { name: /policies/i })).toBeInTheDocument()
  })

  it('does NOT advance if any required field is missing', async () => {
    render(<CheckoutStepper />)
    // Click continue without filling anything
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
    expect(screen.queryByRole('checkbox', { name: /policies/i })).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Navigation: back from step 2 preserves state
// ---------------------------------------------------------------------------

describe('CheckoutStepper — back navigation preserves state', () => {
  it('goes back to step 1 and retains the filled values', async () => {
    render(<CheckoutStepper />)
    await fillAndAdvanceStep1()

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('textbox', { name: /first name/i })).toHaveValue('Juan')
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('juan@example.com')
  })
})

// ---------------------------------------------------------------------------
// Submit flow
// ---------------------------------------------------------------------------

describe('CheckoutStepper — full submit flow', () => {
  it('calls createBookingRequest with the correct payload', async () => {
    const bookingResponse: BookingRequestResponse = {
      id:                'req-abc',
      residenceSlug:     'villa-azul',
      bookingId:         'book-1',
      checkIn:           '2026-03-10',
      checkOut:          '2026-03-12',
      guests:            2,
      firstName:         'Juan',
      lastName:          'Pérez',
      email:             'juan@example.com',
      phone:             '+52 3312345678',
      country:           'Mexico',
      specialNotes:      '',
      quotedNights:      2,
      quotedSubtotal:    500,
      quotedCleaningFee: 80,
      quotedServiceFee:  45,
      quotedTotal:       625,
      currency:          'USD',
      status:            'submitted',
      createdAt:         '2026-03-10T10:00:00Z',
    }
    mockCreateBookingRequest.mockResolvedValue(bookingResponse)

    render(<CheckoutStepper />)
    await fillAndAdvanceStep1()

    fireEvent.click(screen.getByRole('checkbox', { name: /policies/i }))
    fireEvent.click(screen.getByRole('button', { name: /send booking/i }))

    await waitFor(() => {
      expect(mockCreateBookingRequest).toHaveBeenCalledOnce()
    })

    const payload = mockCreateBookingRequest.mock.calls[0][0]
    expect(payload.checkoutSessionToken).toBe('session-tok-1')
    expect(payload.firstName).toBe('Juan')
    expect(payload.email).toBe('juan@example.com')
    expect(payload.phone).toBe('+52 3312345678')
  })

  it('advances to confirmation step after successful submit', async () => {
    mockCreateBookingRequest.mockResolvedValue({
      id: 'req-xyz', residenceSlug: 'villa-azul', bookingId: 'book-1',
      checkIn: '2026-03-10', checkOut: '2026-03-12', guests: 2,
      firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com',
      phone: '+52 3312345678', country: 'Mexico', specialNotes: '',
      quotedNights: 2, quotedSubtotal: 500, quotedCleaningFee: 80,
      quotedServiceFee: 45, quotedTotal: 625, currency: 'USD',
      status: 'submitted', createdAt: '2026-03-10T10:00:00Z',
    })

    render(<CheckoutStepper />)
    await fillAndAdvanceStep1()
    fireEvent.click(screen.getByRole('checkbox', { name: /policies/i }))
    fireEvent.click(screen.getByRole('button', { name: /send booking/i }))

    await waitFor(() => {
      expect(screen.getByText(/booking request sent/i)).toBeInTheDocument()
    })
  })

  it('shows an error when createBookingRequest fails', async () => {
    mockCreateBookingRequest.mockRejectedValue(new Error('Network error'))

    render(<CheckoutStepper />)
    await fillAndAdvanceStep1()
    fireEvent.click(screen.getByRole('checkbox', { name: /policies/i }))
    fireEvent.click(screen.getByRole('button', { name: /send booking/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.queryByText(/booking request sent/i)).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Step guard — bypass attempt
// ---------------------------------------------------------------------------

describe('CheckoutStepper — step guard bypass', () => {
  it('step indicator does NOT allow clicking on inaccessible steps', () => {
    render(<CheckoutStepper />)
    // Step 3 (confirmation) button should be disabled
    const buttons = screen.getAllByRole('button')
    const step4Button = buttons.find((b) => b.textContent?.includes('Confirmation'))
    // It's either disabled or the click is a no-op (step 3 is not accessible without bookingRequestId)
    if (step4Button && !step4Button.hasAttribute('disabled')) {
      fireEvent.click(step4Button)
      // Still on step 1 (no navigation happened)
      expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument()
    }
  })
})
