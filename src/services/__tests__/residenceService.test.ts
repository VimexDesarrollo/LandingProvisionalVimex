import { describe, it, expect } from 'vitest'
import { residenceService } from '@/services/residenceService'
import { residencesMock } from '@/services/mocks/residences.mock'

// In the test environment NEXT_PUBLIC_USE_MOCKS is undefined → useMocks defaults to true,
// so getResidences() runs applyFilters(residencesMock, filters) internally.

describe('residenceService.getResidences – filters', () => {
  it('returns all residences when no filters are applied', async () => {
    const result = await residenceService.getResidences({})
    expect(result.length).toBe(residencesMock.length)
  })

  describe('destination', () => {
    it('returns only residences matching the destination', async () => {
      const result = await residenceService.getResidences({ destination: 'Tulum' })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.destination === 'Tulum')).toBe(true)
    })

    it('returns 0 residences for an unknown destination', async () => {
      const result = await residenceService.getResidences({ destination: 'Cancun' })
      expect(result).toHaveLength(0)
    })

    it('returns residences from all three destinations when unfiltered', async () => {
      const result = await residenceService.getResidences({})
      const destinations = new Set(result.map((r) => r.destination))
      expect(destinations).toContain('Playa del Carmen')
      expect(destinations).toContain('Tulum')
      expect(destinations).toContain('Akumal')
    })
  })

  describe('category', () => {
    it('returns only residences matching the category', async () => {
      const result = await residenceService.getResidences({ category: 'Penthouse' })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.category === 'Penthouse')).toBe(true)
    })

    it('can combine destination + category filters', async () => {
      const result = await residenceService.getResidences({
        destination: 'Playa del Carmen',
        category: 'Oceanfront Villa',
      })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.destination === 'Playa del Carmen' && r.category === 'Oceanfront Villa')).toBe(true)
    })
  })

  describe('bedsMin', () => {
    it('returns only residences with at least the specified number of beds', async () => {
      const result = await residenceService.getResidences({ bedsMin: 4 })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.beds >= 4)).toBe(true)
    })

    it('filters out residences below the bed minimum', async () => {
      const allResults = await residenceService.getResidences({})
      const filtered = await residenceService.getResidences({ bedsMin: 4 })
      expect(filtered.length).toBeLessThan(allResults.length)
    })
  })

  describe('guestsMin', () => {
    it('returns only residences that fit at least the specified number of guests', async () => {
      const result = await residenceService.getResidences({ guestsMin: 8 })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.guests >= 8)).toBe(true)
    })
  })

  describe('price range', () => {
    it('priceMin excludes residences below the minimum nightly rate', async () => {
      const result = await residenceService.getResidences({ priceMin: 600 })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.nightlyRateUsd >= 600)).toBe(true)
    })

    it('priceMax excludes residences above the maximum nightly rate', async () => {
      const result = await residenceService.getResidences({ priceMax: 350 })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.nightlyRateUsd <= 350)).toBe(true)
    })

    it('can apply both priceMin and priceMax simultaneously', async () => {
      const result = await residenceService.getResidences({ priceMin: 400, priceMax: 600 })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.nightlyRateUsd >= 400 && r.nightlyRateUsd <= 600)).toBe(true)
    })

    it('returns 0 residences when priceMin > priceMax makes the range impossible', async () => {
      const result = await residenceService.getResidences({ priceMin: 10000, priceMax: 100 })
      expect(result).toHaveLength(0)
    })
  })

  describe('petsAllowed', () => {
    it('returns only residences with pets-allowed or pet-friendly amenity', async () => {
      const result = await residenceService.getResidences({ petsAllowed: true })
      expect(result.length).toBeGreaterThan(0)
      expect(
        result.every(
          (r) => r.amenities.includes('pets-allowed') || r.amenities.includes('pet-friendly'),
        ),
      ).toBe(true)
    })

    it('returns fewer results than unfiltered when petsAllowed is true', async () => {
      const all = await residenceService.getResidences({})
      const petsOnly = await residenceService.getResidences({ petsAllowed: true })
      expect(petsOnly.length).toBeLessThan(all.length)
    })
  })

  describe('amenities', () => {
    it('returns only residences that include all requested amenities', async () => {
      const result = await residenceService.getResidences({ amenities: ['pool', 'ocean-view'] })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.amenities.includes('pool') && r.amenities.includes('ocean-view'))).toBe(true)
    })

    it('quickFilters work identically to amenities', async () => {
      const byAmenity = await residenceService.getResidences({ amenities: ['pool'] })
      const byQuickFilter = await residenceService.getResidences({ quickFilters: ['pool'] })
      expect(byAmenity.map((r) => r.id).sort()).toEqual(byQuickFilter.map((r) => r.id).sort())
    })

    it('deduplicates amenities that appear in both amenities and quickFilters', async () => {
      const fromBoth = await residenceService.getResidences({ amenities: ['pool'], quickFilters: ['pool'] })
      const fromOne = await residenceService.getResidences({ amenities: ['pool'] })
      expect(fromBoth.map((r) => r.id).sort()).toEqual(fromOne.map((r) => r.id).sort())
    })

    it('returns 0 results for an amenity that no residence has', async () => {
      const result = await residenceService.getResidences({ amenities: ['non-existent-amenity'] })
      expect(result).toHaveLength(0)
    })
  })

  describe('combined filters', () => {
    it('narrows results progressively as more filters are added', async () => {
      const byDestination = await residenceService.getResidences({ destination: 'Akumal' })
      const byDestinationAndBeds = await residenceService.getResidences({ destination: 'Akumal', bedsMin: 4 })
      const byDestinationBedsAndPool = await residenceService.getResidences({
        destination: 'Akumal',
        bedsMin: 4,
        amenities: ['pool'],
      })

      expect(byDestinationAndBeds.length).toBeLessThanOrEqual(byDestination.length)
      expect(byDestinationBedsAndPool.length).toBeLessThanOrEqual(byDestinationAndBeds.length)
    })
  })
})
