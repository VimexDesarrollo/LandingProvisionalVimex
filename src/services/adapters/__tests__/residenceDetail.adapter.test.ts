import { describe, it, expect } from 'vitest'
import { adaptResidenceDetail } from '@/services/adapters/residenceDetail.adapter'
import type { ApiResidenceDetailResponse } from '@/types/content'

const baseInput: ApiResidenceDetailResponse = {
  id: 'casa-del-mar',
  name: 'Casa del Mar',
  location: 'Playa del Carmen, Mexico',
  destination: 'Playa del Carmen',
  category: 'Oceanfront Villa',
  beds: 4,
  guests: 8,
  amenities: ['pool', 'wifi'],
  nightly_rate_usd: 450,
  rating: 4.9,
  image_url: 'https://images.unsplash.com/photo-1613553497126.jpg',
  slug: 'casa-del-mar',
  latitude: 20.63,
  longitude: -87.07,
  map_location_url: 'https://www.google.com/maps/search/?api=1&query=20.63,-87.07',
  description_title: 'About this residence',
  short_description: 'A curated oceanfront villa in Playa del Carmen.',
  amenities_title: 'Full amenities',
  full_amenities: ['Private pool', 'High-speed Wi-Fi'],
  location_section: {
    title: 'Location',
    description: 'Close to the beach and local venues.',
  },
  reviews_section: {
    title: 'Guest reviews',
    cta: { label: 'View all', href: '#reviews' },
    items: [
      {
        id: 'review-1',
        guest_name: 'Alice',
        guest_location: 'Austin, US',
        rating: 5,
        comment: 'Amazing stay!',
        stay_date_label: 'January 2026',
      },
    ],
  },
  room_details_section: {
    title: 'Room details',
    items: [{ id: 'guests', label: 'Guests', value: '8' }],
  },
  map_section: {
    title: 'Map',
    badge_label: 'Single location',
    cta: { label: 'Center map', href: 'https://www.google.com/maps/search/?api=1&query=20.63,-87.07' },
  },
}

describe('adaptResidenceDetail', () => {
  it('maps snake_case API fields to camelCase domain fields', () => {
    const result = adaptResidenceDetail(baseInput)

    expect(result.id).toBe(baseInput.id)
    expect(result.name).toBe(baseInput.name)
    expect(result.nightlyRateUsd).toBe(baseInput.nightly_rate_usd)
    expect(result.imageUrl).toBe(baseInput.image_url)
    expect(result.mapLocationUrl).toBe(baseInput.map_location_url)
    expect(result.descriptionTitle).toBe(baseInput.description_title)
    expect(result.shortDescription).toBe(baseInput.short_description)
    expect(result.amenitiesTitle).toBe(baseInput.amenities_title)
    expect(result.fullAmenities).toEqual(baseInput.full_amenities)
    expect(result.locationSection.title).toBe(baseInput.location_section.title)
    expect(result.reviewsSection.title).toBe(baseInput.reviews_section.title)
    expect(result.reviewsSection.items[0].guestName).toBe(baseInput.reviews_section.items[0].guest_name)
    expect(result.reviewsSection.items[0].guestLocation).toBe(baseInput.reviews_section.items[0].guest_location)
    expect(result.reviewsSection.items[0].stayDateLabel).toBe(baseInput.reviews_section.items[0].stay_date_label)
    expect(result.roomDetailsSection.title).toBe(baseInput.room_details_section.title)
    expect(result.mapSection.badgeLabel).toBe(baseInput.map_section.badge_label)
  })

  it('preserves a valid map_location_url as-is', () => {
    const result = adaptResidenceDetail(baseInput)
    expect(result.mapLocationUrl).toBe('https://www.google.com/maps/search/?api=1&query=20.63,-87.07')
  })

  it('builds a Google Maps URL from coordinates when map_location_url is absent', () => {
    const input = { ...baseInput, map_location_url: undefined }
    const result = adaptResidenceDetail(input)
    expect(result.mapLocationUrl).toBe(`https://www.google.com/maps/search/?api=1&query=${baseInput.latitude},${baseInput.longitude}`)
  })

  it('builds a Google Maps URL from coordinates when map_location_url is not a valid http URL', () => {
    const input = { ...baseInput, map_location_url: 'not-a-url' }
    // Zod accepts it as min(1) string but sanitizeMapLocationUrl rejects non-http
    const result = adaptResidenceDetail(input)
    expect(result.mapLocationUrl).toBe(`https://www.google.com/maps/search/?api=1&query=${baseInput.latitude},${baseInput.longitude}`)
  })

  it('throws when required fields are missing', () => {
    const invalid = { ...baseInput, name: undefined }
    expect(() => adaptResidenceDetail(invalid as never)).toThrow()
  })

  it('throws when rating is out of the 0-5 range', () => {
    const invalid = { ...baseInput, rating: 6 }
    expect(() => adaptResidenceDetail(invalid)).toThrow()
  })
})
