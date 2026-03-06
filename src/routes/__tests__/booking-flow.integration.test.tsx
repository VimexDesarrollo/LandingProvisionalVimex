import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { ResidencesPage } from '@/routes/ResidencesPage'
import { ResidenceDetailPage } from '@/routes/ResidenceDetailPage'
import { DEFAULT_GUEST_DETAILS } from '@/types/guests'
import type { ResidenceDetail } from '@/types/content'

const replaceSpy = vi.fn()
const setSelectedRangeSpy = vi.fn()
const setSelectedGuestDetailsSpy = vi.fn()
const setSearchParamsSpy = vi.fn()
const openFiltersPanelSpy = vi.fn()
const closeFiltersPanelSpy = vi.fn()
const showNotificationSpy = vi.fn()
const dynamicComponentPropsSpy = vi.fn()

let detailSearchParams = new URLSearchParams()
let residencesSearchParams = new URLSearchParams()

const mockUseBooking = vi.fn()
const mockUseUrlSearchParams = vi.fn()
const mockUseResidences = vi.fn()
const mockUseResidenceDetail = vi.fn()
const mockUsePricing = vi.fn()

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
  useRouter: () => ({ replace: replaceSpy }),
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

vi.mock('@/hooks/usePricing', () => ({
  usePricing: (slug: string | undefined, checkin: string | undefined, checkout: string | undefined) =>
    mockUsePricing(slug, checkin, checkout),
}))

vi.mock('@/context/booking-context', () => ({
  useBooking: () => mockUseBooking(),
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
  BookingPanel: () => null,
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
  setSelectedRangeSpy.mockReset()
  setSelectedGuestDetailsSpy.mockReset()
  setSearchParamsSpy.mockReset()
  showNotificationSpy.mockReset()
  dynamicComponentPropsSpy.mockReset()
  mockUseBooking.mockReset()
  mockUseUrlSearchParams.mockReset()
  mockUseResidences.mockReset()
  mockUseResidenceDetail.mockReset()
  mockUsePricing.mockReset()

  mockUsePricing.mockReturnValue({
    pricing: null,
    isLoading: false,
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
})
