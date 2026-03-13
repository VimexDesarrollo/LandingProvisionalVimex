import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/services/apiClient'
import { BookingCheckoutPage } from '@/routes/BookingCheckoutPage'
import type { BookingQuote, BookingRequestResponse } from '@/types/booking'
import type { ResidenceDetail } from '@/types/content'

const pushSpy = vi.fn()

let searchParams = new URLSearchParams(
  'checkin=2026-03-10&checkout=2026-03-12&adults=2&children=1&infants=0&pets=false&checkoutSession=session-1',
)

const mockUseResidenceDetail = vi.fn()
const mockUseBookingQuote = vi.fn()
const mockUseCheckoutSession = vi.fn()
const mockCreateBookingRequest = vi.fn()
const mockUseCountries = vi.fn()

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'villa-azul' }),
  useRouter: () => ({ push: pushSpy }),
  useSearchParams: () => searchParams,
}))

vi.mock('@/hooks/useResidenceDetail', () => ({
  useResidenceDetail: (slug: string | undefined) => mockUseResidenceDetail(slug),
}))

vi.mock('@/hooks/useBookingQuote', () => ({
  useBookingQuote: (slug: string | undefined, checkIn: string | undefined, checkOut: string | undefined, guests: number) =>
    mockUseBookingQuote(slug, checkIn, checkOut, guests),
}))

vi.mock('@/hooks/useCheckoutSession', () => ({
  useCheckoutSession: (token: string | undefined) => mockUseCheckoutSession(token),
}))

vi.mock('@/hooks/useCountries', () => ({
  useCountries: () => mockUseCountries(),
}))

vi.mock('@/services/bookingRequestService', () => ({
  bookingRequestService: {
    createBookingRequest: (payload: unknown) => mockCreateBookingRequest(payload),
  },
  getBookingConflict: (error: unknown) => {
    if (!(error instanceof ApiError) || !error.body || typeof error.body !== 'object') {
      return null
    }

    const body = error.body as {
      code?: 'DATES_UNAVAILABLE' | 'QUOTE_CHANGED'
      detail?: string
      current_quote?: {
        residence_slug: string
        check_in: string
        check_out: string
        guests: number
        quoted_nights: number
        quoted_subtotal: number
        quoted_cleaning_fee: number
        quoted_service_fee: number
        quoted_total: number
        currency: string
        nightly_rates: BookingQuote['nightlyRates']
      }
    }

    if (!body.code || !body.detail) {
      return null
    }

    return {
      code: body.code,
      detail: body.detail,
      currentQuote: body.current_quote
        ? {
            residenceSlug: body.current_quote.residence_slug,
            checkIn: body.current_quote.check_in,
            checkOut: body.current_quote.check_out,
            guests: body.current_quote.guests,
            quotedNights: body.current_quote.quoted_nights,
            quotedSubtotal: body.current_quote.quoted_subtotal,
            quotedCleaningFee: body.current_quote.quoted_cleaning_fee,
            quotedServiceFee: body.current_quote.quoted_service_fee,
            quotedTotal: body.current_quote.quoted_total,
            currency: body.current_quote.currency,
            nightlyRates: body.current_quote.nightly_rates,
          }
        : undefined,
    }
  },
}))

const residenceFixture: ResidenceDetail = {
  id: 'res-1',
  name: 'Villa Azul',
  location: 'Playa del Carmen',
  destination: 'Playa del Carmen',
  category: 'Oceanfront Villa',
  beds: 4,
  guests: 8,
  amenities: [],
  nightlyRateUsd: 480,
  promotionalNightlyRateUsd: 420,
  rating: 4.9,
  imageUrl: 'https://example.com/villa.jpg',
  imageGallery: [],
  slug: 'villa-azul',
  latitude: 20.63,
  longitude: -87.07,
  mapLocationUrl: 'https://maps.google.com',
  minNights: 2,
  descriptionTitle: 'About',
  shortDescription: 'A great place.',
  amenitiesTitle: 'Amenities',
  fullAmenities: ['Pool'],
  locationSection: { title: 'Location', description: 'Near the beach.' },
  reviewsSection: { title: 'Reviews', cta: { label: 'View', href: '#' }, items: [] },
  roomDetailsSection: {
    title: 'Room details',
    items: [
      { id: 'bedrooms', label: 'Bedrooms', value: '3' },
      { id: 'bathrooms', label: 'Bathrooms', value: '2' },
    ],
  },
  mapSection: { title: 'Map', badgeLabel: 'Location', cta: { label: 'Map', href: 'https://maps.google.com' } },
}

const quoteFixture: BookingQuote = {
  residenceSlug: 'villa-azul',
  checkIn: '2026-03-10',
  checkOut: '2026-03-12',
  guests: 3,
  quotedNights: 2,
  quotedSubtotal: 600,
  quotedCleaningFee: 75,
  quotedServiceFee: 72,
  quotedTotal: 747,
  currency: 'USD',
  nightlyRates: [
    { date: '2026-03-10', rate: 300 },
    { date: '2026-03-11', rate: 300 },
  ],
}

const bookingRequestFixture: BookingRequestResponse = {
  id: 'req-1',
  residenceSlug: 'villa-azul',
  bookingId: 'booking-1',
  checkIn: '2026-03-10',
  checkOut: '2026-03-12',
  guests: 3,
  firstName: 'Ana',
  lastName: 'Garcia',
  email: 'ana@example.com',
  phone: '+52 984 123 4567',
  country: 'Mexico',
  specialNotes: 'Late arrival',
  quotedNights: 2,
  quotedSubtotal: 600,
  quotedCleaningFee: 75,
  quotedServiceFee: 72,
  quotedTotal: 747,
  currency: 'USD',
  status: 'submitted',
  createdAt: '2026-03-09T12:00:00Z',
}

async function selectCombobox(label: string, query: string, optionLabel: string) {
  const field = screen.getByRole('combobox', { name: label })
  fireEvent.focus(field)
  fireEvent.change(field, { target: { value: query } })

  const option = await screen.findByRole('option', { name: optionLabel })
  fireEvent.click(option)
}

describe('BookingCheckoutPage', () => {
  beforeEach(() => {
    pushSpy.mockReset()
    mockUseResidenceDetail.mockReset()
    mockUseBookingQuote.mockReset()
    mockUseCheckoutSession.mockReset()
    mockCreateBookingRequest.mockReset()
    mockUseCountries.mockReset()
    searchParams = new URLSearchParams(
      'checkin=2026-03-10&checkout=2026-03-12&adults=2&children=1&infants=0&pets=false&checkoutSession=session-1',
    )

    mockUseResidenceDetail.mockReturnValue({
      residence: residenceFixture,
      isLoading: false,
      error: false,
    })

    mockUseBookingQuote.mockReturnValue({
      quote: quoteFixture,
      isLoading: false,
      error: null,
      setQuote: vi.fn(),
      refetch: vi.fn(),
    })
    mockUseCheckoutSession.mockReturnValue({
      checkoutSession: {
        token: 'session-1',
        residenceSlug: 'villa-azul',
        checkIn: '2026-03-10',
        checkOut: '2026-03-12',
        guests: 3,
        firstName: 'Ana',
        lastName: 'Garcia',
        phone: '+52 984 123 4567',
        quotedNights: 2,
        quotedSubtotal: 600,
        quotedCleaningFee: 75,
        quotedServiceFee: 72,
        quotedTotal: 747,
        currency: 'USD',
        accessState: 'guest',
        identityEmail: '',
        expiresAt: '2026-03-09T12:00:00Z',
      },
      isLoading: false,
      error: null,
    })
    mockUseCountries.mockReturnValue({
      countries: [
        { code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' },
        { code: 'US', name: 'United States', flagEmoji: '🇺🇸', dialCode: '+1' },
      ],
      isLoading: false,
      error: false,
    })
  })

  it('renders the checkout with property, stay and price summaries', () => {
    render(<BookingCheckoutPage />)

    expect(screen.getByText('Complete your booking request')).toBeDefined()
    expect(screen.getByText('Villa Azul')).toBeDefined()
    expect(screen.getByText('Mar 10, 2026')).toBeDefined()
    expect(screen.getByText('$747')).toBeDefined()
    expect(screen.getByLabelText('First name')).toBeDefined()
  })

  it('blocks the flow when required booking params are missing', () => {
    searchParams = new URLSearchParams('adults=2')
    mockUseCheckoutSession.mockReturnValue({
      checkoutSession: null,
      isLoading: false,
      error: 'Checkout session expired. Please start again.',
    })

    render(<BookingCheckoutPage />)

    expect(screen.getByText('Checkout session expired. Please start again.')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Send booking request' })).toBeNull()
  })

  it('submits the guest form and navigates to success when the booking request is created', async () => {
    mockCreateBookingRequest.mockResolvedValue(bookingRequestFixture)

    render(<BookingCheckoutPage />)

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Garcia' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@example.com' } })
    await selectCombobox('Phone code', '+52', '🇲🇽 Mexico (+52)')
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '984 123 4567' } })
    await selectCombobox('Country', 'mex', '🇲🇽 Mexico')

    fireEvent.click(screen.getByRole('button', { name: 'Send booking request' }))

    await waitFor(() => {
      expect(mockCreateBookingRequest).toHaveBeenCalled()
    })

    expect(mockCreateBookingRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+52 984 123 4567',
        country: 'MX',
        checkoutSessionToken: 'session-1',
      }),
    )

    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith(
        '/residences/villa-azul/checkout/success?checkin=2026-03-10&checkout=2026-03-12&adults=2&children=1&infants=0&pets=false&requestId=req-1',
      )
    })
  })

  it('shows a backend conflict message and refreshes the displayed total when the quote changes', async () => {
    const setQuoteSpy = vi.fn()
    const updatedQuote: BookingQuote = {
      ...quoteFixture,
      quotedSubtotal: 700,
      quotedServiceFee: 84,
      quotedTotal: 859,
    }

    mockUseBookingQuote.mockReturnValue({
      quote: quoteFixture,
      isLoading: false,
      error: null,
      setQuote: setQuoteSpy,
      refetch: vi.fn(),
    })
    mockCreateBookingRequest.mockRejectedValue(
      new ApiError('quote changed', 409, {
        code: 'QUOTE_CHANGED',
        detail: 'The quote changed. Refresh the checkout totals and try again.',
        current_quote: {
          residence_slug: 'villa-azul',
          check_in: '2026-03-10',
          check_out: '2026-03-12',
          guests: 3,
          quoted_nights: 2,
          quoted_subtotal: 700,
          quoted_cleaning_fee: 75,
          quoted_service_fee: 84,
          quoted_total: 859,
          currency: 'USD',
          nightly_rates: quoteFixture.nightlyRates,
        },
      }),
    )

    render(<BookingCheckoutPage />)

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Garcia' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@example.com' } })
    await selectCombobox('Phone code', '+52', '🇲🇽 Mexico (+52)')
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '984 123 4567' } })
    await selectCombobox('Country', 'mex', '🇲🇽 Mexico')
    fireEvent.click(screen.getByRole('button', { name: 'Send booking request' }))

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toContain('The quote changed. Refresh the checkout totals and try again.')
    })

    expect(setQuoteSpy).toHaveBeenCalledWith(updatedQuote)
  })

  it('does not submit when guest form data is invalid', async () => {
    render(<BookingCheckoutPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Send booking request' }))

    await waitFor(() => {
      expect(screen.getByText('Country is required.')).toBeDefined()
    })

    expect(mockCreateBookingRequest).not.toHaveBeenCalled()
  })

  it('shows an availability conflict returned by the backend without mutating the quote', async () => {
    const setQuoteSpy = vi.fn()

    mockUseBookingQuote.mockReturnValue({
      quote: quoteFixture,
      isLoading: false,
      error: null,
      setQuote: setQuoteSpy,
      refetch: vi.fn(),
    })
    mockCreateBookingRequest.mockRejectedValue(
      new ApiError('dates unavailable', 409, {
        code: 'DATES_UNAVAILABLE',
        detail: 'Selected dates are unavailable for this residence.',
      }),
    )

    render(<BookingCheckoutPage />)

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Garcia' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@example.com' } })
    await selectCombobox('Phone code', '+52', '🇲🇽 Mexico (+52)')
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '984 123 4567' } })
    await selectCombobox('Country', 'mex', '🇲🇽 Mexico')
    fireEvent.click(screen.getByRole('button', { name: 'Send booking request' }))

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toContain('Selected dates are unavailable for this residence.')
    })

    expect(setQuoteSpy).not.toHaveBeenCalled()
  })

  it('shows quote loading state while the backend revalidates pricing', () => {
    mockUseBookingQuote.mockReturnValue({
      quote: quoteFixture,
      isLoading: true,
      error: null,
      setQuote: vi.fn(),
      refetch: vi.fn(),
    })

    render(<BookingCheckoutPage />)

    expect(screen.getByText('Validating current availability and pricing…')).toBeDefined()
  })

  it('renders the country field as a single typed combobox fed by backend catalog data', async () => {
    render(<BookingCheckoutPage />)

    const countryField = screen.getByRole('combobox', { name: 'Country' }) as HTMLInputElement
    const countryWrapper = countryField.closest('div[data-open]')

    expect(countryField.tagName).toBe('INPUT')

    fireEvent.focus(countryField)

    expect(await screen.findByRole('option', { name: '🇲🇽 Mexico' })).toBeDefined()
    expect(screen.getByRole('option', { name: '🇺🇸 United States' })).toBeDefined()

    fireEvent.click(screen.getByRole('option', { name: '🇲🇽 Mexico' }))

    await waitFor(() => {
      expect(countryWrapper?.getAttribute('data-open')).toBe('false')
    })
    expect(screen.queryByRole('option', { name: '🇺🇸 United States' })).toBeNull()
    expect(countryField.value).toBe('Mexico')
  })

  it('reuses the same typed combobox pattern for the phone country code', async () => {
    render(<BookingCheckoutPage />)

    const phoneCodeField = screen.getByRole('combobox', { name: 'Phone code' }) as HTMLInputElement
    const phoneCodeWrapper = phoneCodeField.closest('div[data-open]')

    expect(phoneCodeField.tagName).toBe('INPUT')
    expect(phoneCodeWrapper?.className).toContain('sm:max-w-[8.5rem]')

    fireEvent.focus(phoneCodeField)
    fireEvent.change(phoneCodeField, { target: { value: '+1' } })

    expect(phoneCodeWrapper?.getAttribute('data-open')).toBe('true')
    expect(phoneCodeWrapper?.className).toContain('sm:max-w-[14rem]')
    expect(await screen.findByRole('option', { name: '🇺🇸 United States (+1)' })).toBeDefined()
    expect(screen.queryByRole('option', { name: '🇲🇽 Mexico (+52)' })).toBeNull()

    fireEvent.click(screen.getByRole('option', { name: '🇺🇸 United States (+1)' }))

    await waitFor(() => {
      expect(phoneCodeWrapper?.getAttribute('data-open')).toBe('false')
    })
    expect(phoneCodeWrapper?.className).toContain('sm:max-w-[8.5rem]')
  })

  it('filters the country options locally while the user types into the same field', async () => {
    render(<BookingCheckoutPage />)

    const countryField = screen.getByRole('combobox', { name: 'Country' })

    fireEvent.focus(countryField)
    fireEvent.change(countryField, { target: { value: 'united' } })

    expect(await screen.findByRole('option', { name: '🇺🇸 United States' })).toBeDefined()
    expect(screen.queryByRole('option', { name: '🇲🇽 Mexico' })).toBeNull()
  })

  it('shows a fallback error when the country catalog cannot be loaded', () => {
    mockUseCountries.mockReturnValue({
      countries: [],
      isLoading: false,
      error: true,
    })

    render(<BookingCheckoutPage />)

    expect(screen.getByText('We could not load the country list right now.')).toBeDefined()
  })
})
