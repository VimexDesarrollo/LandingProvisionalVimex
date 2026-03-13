import { z } from 'zod'
import type { ApiResidenceDetailResponse, ResidenceDetail, ResidenceListing, ResidencePricing } from '@/types/content'
import { env } from '@/config/env'
import { adaptResidenceDetail } from '@/services/adapters/residenceDetail.adapter'
import { apiClient } from '@/services/apiClient'
import { endpoints } from '@/services/endpoints'
import { residenceDetailMockBySlug } from '@/services/mocks/residenceDetail.mock'
import { residencesMock } from '@/services/mocks/residences.mock'
import { getBlockedDatesMock } from '@/services/mocks/availability.mock'
import type { GuestDetails } from '@/types/guests'

// ---------------------------------------------------------------------------
// Mock pricing — mirrors the backend pricelabs.py logic so development works
// without the API server running.
// ---------------------------------------------------------------------------
const _PEAK_MONTHS  = new Set([12, 1, 2, 7, 8])
const _MID_MONTHS   = new Set([3, 4, 5, 11])
// JS getDay(): 0=Sun 1=Mon … 5=Fri 6=Sat
const _WEEKEND_DAYS = new Set([5, 6])

function mockPricing(baseRate: number, checkin: string, checkout: string): ResidencePricing {
  const nights: ResidencePricing['nights'] = []
  const end = new Date(`${checkout}T00:00:00`)
  const current = new Date(`${checkin}T00:00:00`)

  while (current < end) {
    const month = current.getMonth() + 1  // 1–12
    const day   = current.getDay()        // 0–6

    let multiplier = 1.0
    if (_PEAK_MONTHS.has(month)) {
      multiplier *= 1.25
    } else if (!_MID_MONTHS.has(month)) {
      multiplier *= 0.90  // low season
    }
    if (_WEEKEND_DAYS.has(day)) {
      multiplier *= 1.20
    }

    nights.push({
      date: current.toISOString().slice(0, 10),
      rate: Math.round(baseRate * multiplier),
    })
    current.setDate(current.getDate() + 1)
  }

  return {
    nights,
    nightsCount: nights.length,
    subtotal: nights.reduce((sum, n) => sum + n.rate, 0),
  }
}

export interface ResidenceFilters {
  destination?: string
  category?: string
  location?: string
  bedsMin?: number
  guestsMin?: number
  guestDetails?: GuestDetails
  petsAllowed?: boolean
  priceMin?: number
  priceMax?: number
  flexibleCheckin?: boolean
  checkin?: string
  checkout?: string
  amenities?: string[]
  quickFilters?: string[]
}

const useMocks = env.useMocks
const usePricingMocks = env.usePricingMocks

const residenceAvailabilityResponseSchema = z.object({
  blocked_dates: z.array(z.string()),
})

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function buildAvailabilityWindow(): { start: string; end: string } {
  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 365)

  return {
    start: toDateKey(startDate),
    end: toDateKey(endDate),
  }
}

function applyFilters(residences: ResidenceListing[], filters: ResidenceFilters): ResidenceListing[] {
  const allAmenityFilters = Array.from(new Set([...(filters.amenities ?? []), ...(filters.quickFilters ?? [])]))

  return residences.filter((item) => {
    if (filters.destination && item.destination !== filters.destination) {
      return false
    }

    if (filters.location && item.location !== filters.location) {
      return false
    }

    if (filters.category && item.category !== filters.category) {
      return false
    }

    if (filters.bedsMin && item.beds < filters.bedsMin) {
      return false
    }

    if (filters.guestsMin && item.guests < filters.guestsMin) {
      return false
    }

    if (filters.petsAllowed && !item.amenities.includes('pets-allowed') && !item.amenities.includes('pet-friendly')) {
      return false
    }

    if (filters.priceMin && item.nightlyRateUsd < filters.priceMin) {
      return false
    }

    if (filters.priceMax && item.nightlyRateUsd > filters.priceMax) {
      return false
    }

    if (allAmenityFilters.length > 0 && !allAmenityFilters.every((amenity) => item.amenities.includes(amenity))) {
      return false
    }

    return true
  })
}

interface PaginatedResidenceResponse {
  count: number
  next: string | null
  results: ResidenceListing[]
}

function buildResidenceParams(filters: ResidenceFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.destination) params.set('destination', filters.destination)
  if (filters.category) params.set('category', filters.category)
  if (filters.location) params.set('zone', filters.location)
  if (filters.checkin) params.set('checkin', filters.checkin)
  if (filters.checkout) params.set('checkout', filters.checkout)
  if (filters.bedsMin) params.set('beds', String(filters.bedsMin))
  if (filters.guestsMin) params.set('guests', String(filters.guestsMin))
  if (filters.petsAllowed) params.set('pets', 'true')
  if (filters.priceMin) params.set('priceMin', String(filters.priceMin))
  if (filters.priceMax) params.set('priceMax', String(filters.priceMax))
  filters.amenities?.forEach((a) => params.append('amenity', a))
  filters.quickFilters?.forEach((q) => params.append('quick', q))
  return params
}

export const residenceService = {
  async resolvePricingBaseRate(slug: string): Promise<number | null> {
    const mockResidence = residencesMock.find((residence) => residence.slug === slug)
    if (mockResidence) {
      return mockResidence.nightlyRateUsd
    }

    try {
      const response = await apiClient.get<ApiResidenceDetailResponse>(endpoints.residenceDetail(slug))
      const adapted = adaptResidenceDetail(response)
      return adapted.nightlyRateUsd
    } catch {
      return null
    }
  },

  async getResidences(filters: ResidenceFilters, signal?: AbortSignal): Promise<ResidenceListing[]> {
    if (useMocks) {
      return applyFilters(residencesMock, filters)
    }

    const allResults: ResidenceListing[] = []
    let url: string | null = `${endpoints.residences}?${buildResidenceParams(filters).toString()}`

    while (url) {
      const page: PaginatedResidenceResponse = await apiClient.get<PaginatedResidenceResponse>(url, { signal })
      allResults.push(...page.results)
      url = page.next
    }

    return allResults
  },

  async getResidenceBySlug(slug: string): Promise<ResidenceListing | null> {
    if (useMocks) {
      return residencesMock.find((item) => item.slug === slug) ?? null
    }
    try {
      return await apiClient.get<ResidenceListing>(endpoints.residenceDetail(slug))
    } catch {
      return null
    }
  },

  async getBlockedDates(residenceId: string, signal?: AbortSignal): Promise<string[]> {
    if (useMocks) {
      return getBlockedDatesMock(residenceId)
    }

    try {
      const { start, end } = buildAvailabilityWindow()
      const response = await apiClient.get<z.infer<typeof residenceAvailabilityResponseSchema>>(
        endpoints.residenceAvailability(residenceId, start, end),
        { signal },
      )
      return residenceAvailabilityResponseSchema.parse(response).blocked_dates
    } catch {
      return getBlockedDatesMock(residenceId)
    }
  },

  async getResidenceDetailBySlug(slug: string): Promise<ResidenceDetail | null> {
    const mockDetail = residenceDetailMockBySlug[slug]

    if (useMocks) {
      return mockDetail ? adaptResidenceDetail(mockDetail) : null
    }

    try {
      const response = await apiClient.get<ApiResidenceDetailResponse>(endpoints.residenceDetail(slug))
      return adaptResidenceDetail(response)
    } catch {
      return mockDetail ? adaptResidenceDetail(mockDetail) : null
    }
  },

  async getPricing(
    slug: string,
    checkin: string,
    checkout: string,
    signal?: AbortSignal,
  ): Promise<ResidencePricing | null> {
    if (useMocks || usePricingMocks) {
      const baseRate = await this.resolvePricingBaseRate(slug)
      if (!baseRate) return null
      return mockPricing(baseRate, checkin, checkout)
    }

    try {
      return await apiClient.get<ResidencePricing>(
        endpoints.residencePricing(slug, checkin, checkout),
        { signal },
      )
    } catch {
      const baseRate = await this.resolvePricingBaseRate(slug)
      if (!baseRate) return null
      return mockPricing(baseRate, checkin, checkout)
    }
  },
}
