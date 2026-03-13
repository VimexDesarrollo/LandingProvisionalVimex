import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountries } from '@/hooks/useCountries'
import { bookingRequestService } from '@/services/bookingRequestService'

vi.mock('@/services/bookingRequestService', () => ({
  bookingRequestService: {
    getCountries: vi.fn(),
  },
}))

const mockGetCountries = vi.mocked(bookingRequestService.getCountries)

describe('useCountries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads the country catalog on success', async () => {
    mockGetCountries.mockResolvedValue([
      { code: 'CA', name: 'Canada', flagEmoji: '🇨🇦', dialCode: '+1' },
      { code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' },
    ])

    const { result } = renderHook(() => useCountries())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.countries).toEqual([
      { code: 'CA', name: 'Canada', flagEmoji: '🇨🇦', dialCode: '+1' },
      { code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' },
    ])
    expect(result.current.error).toBe(false)
  })

  it('exposes an error state when loading fails', async () => {
    mockGetCountries.mockRejectedValue(new Error('network'))

    const { result } = renderHook(() => useCountries())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.countries).toEqual([])
    expect(result.current.error).toBe(true)
  })
})
