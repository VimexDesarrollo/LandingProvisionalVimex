import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ResidencesPage } from '@/routes/ResidencesPage'
import { ResidenceDetailPage } from '@/routes/ResidenceDetailPage'
import { ApiError } from '@/services/apiClient'
import { DEFAULT_GUEST_DETAILS } from '@/types/guests'
import type { ResidenceDetail } from '@/types/content'

const replaceSpy = vi.fn()
const pushSpy = vi.fn()
const setSelectedRangeSpy = vi.fn()
const setSelectedGuestDetailsSpy = vi.fn()
const setSearchParamsSpy = vi.fn()
const openFiltersPanelSpy = vi.fn()
const closeFiltersPanelSpy = vi.fn()
const showNotificationSpy = vi.fn()
const dynamicComponentPropsSpy = vi.fn()
const bookingPanelPropsSpy = vi.fn()

let detailSearchParams = new URLSearchParams()
let residencesSearchParams = new URLSearchParams()

const mockUseBooking = vi.fn()
const mockUseUrlSearchParams = vi.fn()
const mockUseResidences = vi.fn()
const mockUseResidenceDetail = vi.fn()
const mockUseResidenceAvailability = vi.fn()
const mockUsePricing = vi.fn()
const mockCreateCheckoutSession = vi.fn()
let isAuthenticated = true

vi.mock('next/dynamic', () => ({
  default: () => {
    return function MockDynamicComponent(props: unknown) {
      dynamicComponentPropsSpy(props)
      return null
    }
  },
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'villa-azul' }),
  usePathname: () => '/residences/villa-azul',
  useRouter: () => ({ replace: replaceSpy, push: pushSpy }),
  useSearchParams: () => detailSearchParams,
}))

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isFiltersPanelOpen: false,
    openFiltersPanel: openFiltersPanelSpy,
    closeFiltersPanel: closeFiltersPanelSpy,
    notifications: [],
    dismissNotification: vi.fn(),
    showNotification: showNotificationSpy,
    prefersReducedMotion: true,
  }),
}))

vi.mock('@/hooks/useUrlSearchParams', () => ({
  useUrlSearchParams: () => mockUseUrlSearchParams(),
}))

vi.mock('@/hooks/useResidences', () => ({
  useResidences: (filters: unknown) => mockUseResidences(filters),
}))

vi.mock('@/hooks/useResidenceDetail', () => ({
  useResidenceDetail: (slug: string | undefined) => mockUseResidenceDetail(slug),
}))

vi.mock('@/hooks/useResidenceAvailability', () => ({
  useResidenceAvailability: (residenceId: string | undefined) => mockUseResidenceAvailability(residenceId),
}))

vi.mock('@/hooks/usePricing', () => ({
  usePricing: (slug: string | undefined, checkin: string | undefined, checkout: string | undefined) =>
    mockUsePricing(slug, checkin, checkout),
}))

vi.mock('@/context/booking-context', () => ({
  useBooking: () => mockUseBooking(),
}))

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated,
  }),
}))

vi.mock('@/services/bookingRequestService', () => ({
  bookingRequestService: {
    createCheckoutSession: (payload: unknown) => mockCreateCheckoutSession(payload),
    continueCheckoutAsGuest: vi.fn(),
  },
  getCheckoutSessionErrorDetail: (error: unknown) => {
    if (!(error instanceof ApiError) || !error.body || typeof error.body !== 'object') {
      return null
    }

    const detail = (error.body as { detail?: unknown }).detail
    return typeof detail === 'string' ? detail : null
  },
}))

vi.mock('@/components/home/ResidenceCard', () => ({
  ResidenceCard: () => null,
}))

vi.mock('@/components/residences/ResidenceCardSkeleton', () => ({
  ResidenceCardSkeleton: () => null,
}))

vi.mock('@/components/residences/ResidencesFiltersModal', () => ({
  ResidencesFiltersModal: () => null,
}))

vi.mock('@/components/residences/ResidencesResultsToolbar', () => ({
  ResidencesResultsToolbar: () => null,
}))

vi.mock('@/components/residences/BookingPanel', () => ({
  BookingPanel: (props: unknown) => {
    bookingPanelPropsSpy(props)
    return (
      <button type="button" onClick={() => (props as { onBookNow?: () => void }).onBookNow?.()}>
        Mock Book Now
      </button>
    )
  },
}))

vi.mock('@/components/residences/ResidenceDetailSkeleton', () => ({
  ResidenceDetailSkeleton: () => null,
}))

vi.mock('@/components/residences/ResidenceDetailSections', () => ({
  ResidenceDetailSections: () => null,
}))

vi.mock('@/components/residences/ResidencePhotoGallery', () => ({
  ResidencePhotoGallery: () => null,
}))

const residenceDetailFixture: ResidenceDetail = {
  id: 'res-1',
  name: 'Villa Azul',
  location: 'Playa del Carmen',
  destination: 'Playa del Carmen',
  category: 'Oceanfront Villa',
  beds: 4,
  guests: 8,
  amenities: [],
  nightlyRateUsd: 480,
  rating: 5,
  imageUrl: 'https://example.com/villa.jpg',
  slug: 'villa-azul',
  latitude: 20.0,
  longitude: -87.0,
  mapLocationUrl: 'https://maps.example/villa-azul',
  descriptionTitle: 'Description',
  shortDescription: 'Beautiful villa',
  amenitiesTitle: 'Amenities',
  fullAmenities: [],
  locationSection: {
    title: 'Location',
    description: 'Near the beach',
  },
  reviewsSection: {
    title: 'Reviews',
    cta: { label: 'Read more', href: '/reviews' },
    items: [],
  },
  roomDetailsSection: {
    title: 'Rooms',
    items: [
      { id: 'bedrooms', label: 'Bedrooms', value: '2' },
      { id: 'bathrooms', label: 'Bathrooms', value: '2' },
    ],
  },
  mapSection: {
    title: 'Map',
    badgeLabel: 'Prime location',
    cta: { label: 'Open map', href: '/map' },
  },
}

beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  })
})

beforeEach(() => {
  replaceSpy.mockReset()
  pushSpy.mockReset()
  setSelectedRangeSpy.mockReset()
  setSelectedGuestDetailsSpy.mockReset()
  setSearchParamsSpy.mockReset()
  showNotificationSpy.mockReset()
  dynamicComponentPropsSpy.mockReset()
  bookingPanelPropsSpy.mockReset()
  mockUseBooking.mockReset()
  mockUseUrlSearchParams.mockReset()
  mockUseResidences.mockReset()
  mockUseResidenceDetail.mockReset()
  mockUseResidenceAvailability.mockReset()
  mockUsePricing.mockReset()
  mockCreateCheckoutSession.mockReset()
  isAuthenticated = true

  mockUseResidenceAvailability.mockReturnValue({
    blockedDates: [],
    isLoading: false,
  })
  mockUsePricing.mockReturnValue({
    pricing: null,
    isLoading: false,
  })
  mockCreateCheckoutSession.mockResolvedValue({
    token: 'session-1',
    accessState: 'authenticated',
  })

  mockUseResidenceDetail.mockReturnValue({
    residence: residenceDetailFixture,
    isLoading: false,
    error: null,
  })

  mockUseResidences.mockReturnValue({
    residences: [],
    isLoading: false,
    error: null,
  })
})

describe('booking flow integration', () => {
  it('syncs listing URL dates and guests into BookingContext', async () => {
    residencesSearchParams = new URLSearchParams(
      'destination=Playa%20del%20Carmen&checkin=2026-06-10&checkout=2026-06-12&adults=3&children=1&infants=0&pets=true',
    )

    mockUseUrlSearchParams.mockReturnValue([residencesSearchParams, setSearchParamsSpy])
    mockUseBooking.mockReturnValue({
      selectedRange: {},
      selectedGuestDetails: DEFAULT_GUEST_DETAILS,
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidencesPage />)

    await waitFor(() => {
      expect(setSelectedRangeSpy).toHaveBeenCalledWith({
        from: '2026-06-10',
        to: '2026-06-12',
      })
    })

    expect(setSelectedGuestDetailsSpy).toHaveBeenCalledWith({
      adults: 3,
      children: 1,
      infants: 0,
      pets: true,
    })

    await waitFor(() => {
      expect(dynamicComponentPropsSpy).toHaveBeenCalled()
    })

    const mapPanelProps = dynamicComponentPropsSpy.mock.calls.at(-1)?.[0] as {
      checkin?: string
      checkout?: string
      guestDetails?: {
        adults: number
        children: number
        infants: number
        pets: boolean
      }
    }

    expect(mapPanelProps.checkin).toBe('2026-06-10')
    expect(mapPanelProps.checkout).toBe('2026-06-12')
    expect(mapPanelProps.guestDetails).toEqual({
      adults: 3,
      children: 1,
      infants: 0,
      pets: true,
    })
  })

  it('hydrates detail BookingContext state from URL dates and guests', async () => {
    detailSearchParams = new URLSearchParams(
      'checkin=2026-07-01&checkout=2026-07-05&adults=2&children=1&infants=0&pets=true',
    )

    mockUseBooking.mockReturnValue({
      selectedRange: {},
      selectedGuestDetails: DEFAULT_GUEST_DETAILS,
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    await waitFor(() => {
      expect(setSelectedRangeSpy).toHaveBeenCalledWith({
        from: '2026-07-01',
        to: '2026-07-05',
      })
    })

    expect(setSelectedGuestDetailsSpy).toHaveBeenCalledWith({
      adults: 2,
      children: 1,
      infants: 0,
      pets: true,
    })
  })

  it('syncs detail BookingContext back into URL for shareable checkout state', async () => {
    detailSearchParams = new URLSearchParams('')

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-12',
      },
      selectedGuestDetails: {
        adults: 2,
        children: 1,
        infants: 0,
        pets: false,
      },
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalled()
    })

    const [nextUrl, options] = replaceSpy.mock.calls.at(-1) as [string, { scroll: boolean }]
    expect(nextUrl).toContain('/residences/villa-azul?')
    expect(nextUrl).toContain('checkin=2026-08-10')
    expect(nextUrl).toContain('checkout=2026-08-12')
    expect(nextUrl).toContain('adults=2')
    expect(nextUrl).toContain('children=1')
    expect(nextUrl).toContain('infants=0')
    expect(nextUrl).toContain('guests=3%2B')
    expect(options).toEqual({ scroll: false })
  })

  it('clears detail selected range when it does not satisfy minimum nights', async () => {
    detailSearchParams = new URLSearchParams('')

    mockUseResidenceDetail.mockReturnValue({
      residence: {
        ...residenceDetailFixture,
        minNights: 4,
      },
      isLoading: false,
      error: null,
    })

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-12',
      },
      selectedGuestDetails: DEFAULT_GUEST_DETAILS,
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    await waitFor(() => {
      expect(setSelectedRangeSpy).toHaveBeenCalledWith({ from: undefined, to: undefined })
    })

    expect(showNotificationSpy).toHaveBeenCalledWith(
      'Minimum stay for this residence is 4 nights.',
      'info',
    )
  })

  it('navigates from detail to checkout preserving dates and guest breakdown', async () => {
    detailSearchParams = new URLSearchParams('')

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-12',
      },
      selectedGuestDetails: {
        adults: 2,
        children: 1,
        infants: 0,
        pets: true,
      },
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Mock Book Now' }))

    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith(
        '/residences/villa-azul/checkout?checkin=2026-08-10&checkout=2026-08-12&adults=2&children=1&infants=0&guests=3%2B&pets=true&checkoutSession=session-1',
      )
    })
  })

  it('opens the auth modal for unauthenticated users before checkout', async () => {
    isAuthenticated = false
    detailSearchParams = new URLSearchParams('')

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-12',
      },
      selectedGuestDetails: {
        adults: 2,
        children: 1,
        infants: 0,
        pets: true,
      },
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Mock Book Now' }))

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /register with us and unlock rewards/i })).toBeDefined()
    })

    expect(mockCreateCheckoutSession).not.toHaveBeenCalled()
  })

  it('routes unauthenticated users to register with preserved booking context', async () => {
    isAuthenticated = false
    detailSearchParams = new URLSearchParams('')

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-12',
      },
      selectedGuestDetails: {
        adults: 2,
        children: 1,
        infants: 0,
        pets: true,
      },
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Mock Book Now' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /register now/i })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /register now/i }))

    expect(pushSpy).toHaveBeenCalledWith(
      '/auth/register?returnUrl=%2Fresidences%2Fvilla-azul%3Fcheckin%3D2026-08-10%26checkout%3D2026-08-12%26adults%3D2%26children%3D1%26infants%3D0%26guests%3D3%252B%26pets%3Dtrue',
    )
  })

  it('continues as guest from the auth modal when requested', async () => {
    isAuthenticated = false
    detailSearchParams = new URLSearchParams('')
    mockCreateCheckoutSession.mockResolvedValue({
      token: 'session-1',
      accessState: 'anonymous',
    })

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-12',
      },
      selectedGuestDetails: {
        adults: 2,
        children: 1,
        infants: 0,
        pets: true,
      },
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Mock Book Now' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue as guest/i })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /continue as guest/i }))

    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith(
        '/residences/villa-azul/guest-details?checkoutSession=session-1&checkin=2026-08-10&checkout=2026-08-12&adults=2&children=1&infants=0&guests=3%2B&pets=true',
      )
    })
  })

  it('shows the backend checkout-session validation message when book now fails', async () => {
    detailSearchParams = new URLSearchParams('')
    mockCreateCheckoutSession.mockRejectedValue(
      new ApiError('API request failed', 400, {
        detail: 'Selected dates are unavailable for this residence.',
        code: 'DATES_UNAVAILABLE',
      }),
    )

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-13',
      },
      selectedGuestDetails: {
        adults: 2,
        children: 0,
        infants: 0,
        pets: false,
      },
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Mock Book Now' }))

    await waitFor(() => {
      expect(showNotificationSpy).toHaveBeenCalledWith(
        'Selected dates are unavailable for this residence.',
        'error',
      )
    })
  })

  it('prevents checkout creation when the selected range overlaps blocked dates', async () => {
    detailSearchParams = new URLSearchParams('')
    mockUseResidenceAvailability.mockReturnValue({
      blockedDates: ['2026-08-12'],
      isLoading: false,
    })

    mockUseBooking.mockReturnValue({
      selectedRange: {
        from: '2026-08-10',
        to: '2026-08-13',
      },
      selectedGuestDetails: {
        adults: 2,
        children: 0,
        infants: 0,
        pets: false,
      },
      setSelectedRange: setSelectedRangeSpy,
      setSelectedGuestDetails: setSelectedGuestDetailsSpy,
    })

    render(<ResidenceDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Mock Book Now' }))

    await waitFor(() => {
      expect(showNotificationSpy).toHaveBeenCalledWith(
        'Selected dates are unavailable for this residence.',
        'error',
      )
    })

    expect(mockCreateCheckoutSession).not.toHaveBeenCalled()
  })
})
