import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useResidenceDetail } from '@/hooks/useResidenceDetail'
import { residenceService } from '@/services/residenceService'
import type { ResidenceDetail } from '@/types/content'

vi.mock('@/services/residenceService', () => ({
  residenceService: {
    getResidenceDetailBySlug: vi.fn(),
  },
}))

const mockGetDetail = vi.mocked(residenceService.getResidenceDetailBySlug)

const stubDetail: ResidenceDetail = {
  id: 'casa-del-mar',
  name: 'Casa del Mar',
  location: 'Playa del Carmen, Mexico',
  destination: 'Playa del Carmen',
  category: 'Oceanfront Villa',
  beds: 4,
  guests: 8,
  amenities: ['pool'],
  nightlyRateUsd: 450,
  rating: 4.9,
  imageUrl: 'https://example.com/image.jpg',
  slug: 'casa-del-mar',
  latitude: 20.63,
  longitude: -87.07,
  mapLocationUrl: 'https://maps.google.com',
  descriptionTitle: 'About',
  shortDescription: 'A great place.',
  amenitiesTitle: 'Amenities',
  fullAmenities: ['Pool'],
  locationSection: { title: 'Location', description: 'Near the beach.' },
  reviewsSection: { title: 'Reviews', cta: { label: 'View', href: '#' }, items: [] },
  roomDetailsSection: { title: 'Room', items: [] },
  mapSection: { title: 'Map', badgeLabel: 'Location', cta: { label: 'Map', href: 'https://maps.google.com' } },
}

describe('useResidenceDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch and sets isLoading to false when slug is null', async () => {
    const { result } = renderHook(() => useResidenceDetail(null))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockGetDetail).not.toHaveBeenCalled()
    expect(result.current.residence).toBeNull()
    expect(result.current.error).toBe(false)
  })

  it('sets residence on success', async () => {
    mockGetDetail.mockResolvedValue(stubDetail)

    const { result } = renderHook(() => useResidenceDetail('casa-del-mar'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.residence).toEqual(stubDetail)
    expect(result.current.error).toBe(false)
  })

  it('sets error and clears loading when the fetch fails', async () => {
    mockGetDetail.mockRejectedValue(new Error('Not found'))

    const { result } = renderHook(() => useResidenceDetail('bad-slug'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe(true)
    expect(result.current.residence).toBeNull()
  })

  it('re-fetches when slug changes', async () => {
    mockGetDetail.mockResolvedValue(stubDetail)

    const { rerender } = renderHook(({ slug }) => useResidenceDetail(slug), {
      initialProps: { slug: 'casa-del-mar' },
    })

    await waitFor(() => expect(mockGetDetail).toHaveBeenCalledTimes(1))

    rerender({ slug: 'villa-tranquila' })

    await waitFor(() => expect(mockGetDetail).toHaveBeenCalledTimes(2))
    expect(mockGetDetail).toHaveBeenLastCalledWith('villa-tranquila')
  })
})
