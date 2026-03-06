import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useResidences } from '@/hooks/useResidences'
import { residenceService } from '@/services/residenceService'
import type { ResidenceListing } from '@/types/content'

vi.mock('@/services/residenceService', () => ({
  residenceService: {
    getResidences: vi.fn(),
  },
}))

const mockGetResidences = vi.mocked(residenceService.getResidences)

const stubResidence: ResidenceListing = {
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
  imageGallery: [],
  slug: 'casa-del-mar',
  latitude: 20.63,
  longitude: -87.07,
  mapLocationUrl: 'https://maps.google.com',
}

describe('useResidences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts in loading state with empty residences', () => {
    mockGetResidences.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useResidences({}))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(false)
    expect(result.current.residences).toEqual([])
  })

  it('sets residences and clears loading on success', async () => {
    mockGetResidences.mockResolvedValue([stubResidence])

    const { result } = renderHook(() => useResidences({}))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.residences).toEqual([stubResidence])
    expect(result.current.error).toBe(false)
  })

  it('sets error and clears loading on failure', async () => {
    mockGetResidences.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useResidences({}))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe(true)
    expect(result.current.residences).toEqual([])
  })

  it('re-fetches when filters change', async () => {
    mockGetResidences.mockResolvedValue([])

    const { rerender } = renderHook(({ filters }) => useResidences(filters), {
      initialProps: { filters: { destination: 'Playa del Carmen' } },
    })

    await waitFor(() => expect(mockGetResidences).toHaveBeenCalledTimes(1))

    rerender({ filters: { destination: 'Tulum' } })

    await waitFor(() => expect(mockGetResidences).toHaveBeenCalledTimes(2))
    expect(mockGetResidences).toHaveBeenLastCalledWith({ destination: 'Tulum' }, expect.any(AbortSignal))
  })
})
