import type { ApiResidenceDetailResponse, ResidenceListing } from '@/types/content'
import { residencesMock } from '@/services/mocks/residences.mock'

const amenityLabels: Record<string, string> = {
  'air-conditioning': 'Air conditioning',
  'hot-tub': 'Hot tub',
  kitchen: 'Fully equipped kitchen',
  laundry: 'Washer and dryer',
  'non-smoking': 'Non-smoking space',
  'outdoor-grill': 'Outdoor grill',
  parking: 'Private parking',
  patio: 'Private patio',
  'pets-allowed': 'Pets allowed',
  pool: 'Private or shared pool',
  'satellite-or-cable-tv': 'Satellite or cable TV',
  'wheelchair-accessible': 'Wheelchair accessible',
  'wireless-internet': 'High-speed Wi-Fi',
  'ocean-view': 'Ocean view',
  'free-internet': 'Complimentary internet',
  'pet-friendly': 'Pet friendly',
}

const reviewNames = [
  'Emma',
  'Oliver',
  'Sofia',
  'Mateo',
  'Camila',
  'Noah',
  'Isabella',
  'Liam',
] as const

const reviewOrigins = [
  'Austin, United States',
  'Toronto, Canada',
  'London, United Kingdom',
  'Madrid, Spain',
  'Monterrey, Mexico',
  'Bogotá, Colombia',
] as const

const reviewMonths = [
  'January 2026',
  'December 2025',
  'November 2025',
  'October 2025',
  'September 2025',
  'August 2025',
  'July 2025',
  'June 2025',
] as const

function formatAmenity(slug: string): string {
  if (amenityLabels[slug]) {
    return amenityLabels[slug]
  }

  return slug
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

function createReviewId(slug: string, index: number): string {
  return `${slug}-review-${index + 1}`
}

function createReviews(residence: ResidenceListing): ApiResidenceDetailResponse['reviews_section']['items'] {
  const slugSeed = residence.slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return Array.from({ length: 8 }, (_, index) => {
    const reviewerName = reviewNames[(slugSeed + index) % reviewNames.length]
    const reviewerOrigin = reviewOrigins[(slugSeed + index) % reviewOrigins.length]
    const stayMonth = reviewMonths[index % reviewMonths.length]
    const score = Number(Math.max(4.6, Math.min(5, residence.rating - 0.12 + index * 0.04)).toFixed(1))

    return {
      id: createReviewId(residence.slug, index),
      guest_name: reviewerName,
      guest_location: reviewerOrigin,
      rating: score,
      comment: `${residence.name} delivered a premium stay experience with excellent service, clean spaces, and a very convenient location.`,
      stay_date_label: stayMonth,
    }
  })
}

function createRoomDetails(residence: ResidenceListing): ApiResidenceDetailResponse['room_details_section']['items'] {
  const bedrooms = Math.max(1, Math.ceil(residence.beds / 2))
  const bathrooms = Math.max(1, Math.ceil(bedrooms / 2))
  const areaSquareMeters = 120 + residence.beds * 26

  return [
    { id: `${residence.slug}-room-guests`, label: 'Guests', value: `${residence.guests}` },
    { id: `${residence.slug}-room-bedrooms`, label: 'Bedrooms', value: `${bedrooms}` },
    { id: `${residence.slug}-room-beds`, label: 'Beds', value: `${residence.beds}` },
    { id: `${residence.slug}-room-bathrooms`, label: 'Bathrooms', value: `${bathrooms}` },
    { id: `${residence.slug}-room-size`, label: 'Size', value: `${areaSquareMeters} m²` },
    { id: `${residence.slug}-room-category`, label: 'Category', value: residence.category },
  ]
}

function createResidenceDetailMock(residence: ResidenceListing): ApiResidenceDetailResponse {
  const fullAmenities = Array.from(new Set(residence.amenities.map(formatAmenity)))

  return {
    id: residence.id,
    name: residence.name,
    location: residence.location,
    destination: residence.destination,
    category: residence.category,
    beds: residence.beds,
    guests: residence.guests,
    amenities: residence.amenities,
    nightly_rate_usd: residence.nightlyRateUsd,
    promotional_nightly_rate_usd: residence.promotionalNightlyRateUsd,
    rating: residence.rating,
    image_url: residence.imageUrl,
    image_gallery: residence.imageGallery,
    slug: residence.slug,
    latitude: residence.latitude,
    longitude: residence.longitude,
    map_location_url: residence.mapLocationUrl,
    description_title: 'About this residence',
    short_description:
      `${residence.name} is a curated ${residence.category.toLowerCase()} in ${residence.destination}, designed for comfort, privacy, and a premium hospitality experience.`,
    amenities_title: 'Full amenities',
    full_amenities: fullAmenities,
    location_section: {
      title: 'Location',
      description:
        `This residence is located in ${residence.location}, with quick access to restaurants, beach clubs, and local lifestyle venues.`,
    },
    reviews_section: {
      title: 'Guest reviews',
      cta: {
        label: 'View all reviews',
        href: '#reviews',
      },
      items: createReviews(residence),
    },
    room_details_section: {
      title: 'Room details',
      items: createRoomDetails(residence),
    },
    map_section: {
      title: 'Map',
      badge_label: 'Single location',
      cta: {
        label: 'Center map',
        href: residence.mapLocationUrl,
      },
    },
  }
}

export const residenceDetailMockBySlug: Record<string, ApiResidenceDetailResponse> = Object.fromEntries(
  residencesMock.map((residence) => [residence.slug, createResidenceDetailMock(residence)]),
)
