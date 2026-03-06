import { z } from 'zod'
import type { ApiResidenceDetailResponse, ResidenceDetail } from '@/types/content'

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

function buildGoogleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

function sanitizeMapLocationUrl(value: string | undefined, latitude: number, longitude: number): string {
  if (!value || value.trim().length === 0) {
    return buildGoogleMapsUrl(latitude, longitude)
  }

  if (/^https?:\/\//.test(value)) {
    return value
  }

  return buildGoogleMapsUrl(latitude, longitude)
}

const residenceDetailResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  destination: z.string().min(1),
  category: z.string().min(1),
  beds: z.number().int().positive(),
  guests: z.number().int().positive(),
  amenities: z.array(z.string().min(1)),
  nightly_rate_usd: z.number().positive(),
  promotional_nightly_rate_usd: z.number().positive().optional().nullable(),
  min_nights: z.number().int().positive().optional(),
  rating: z.number().min(0).max(5),
  image_url: z.string().url(),
  image_gallery: z.array(z.string().url()).optional(),
  slug: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  map_location_url: z.string().min(1).optional(),
  description_title: z.string().min(1),
  short_description: z.string().min(1),
  amenities_title: z.string().min(1),
  full_amenities: z.array(z.string().min(1)),
  location_section: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  reviews_section: z.object({
    title: z.string().min(1),
    cta: ctaSchema,
    items: z.array(
      z.object({
        id: z.string().min(1),
        guest_name: z.string().min(1),
        guest_location: z.string().min(1),
        rating: z.number().min(0).max(5),
        comment: z.string().min(1),
        stay_date_label: z.string().min(1),
      }),
    ),
  }),
  room_details_section: z.object({
    title: z.string().min(1),
    items: z.array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    ),
  }),
  map_section: z.object({
    title: z.string().min(1),
    badge_label: z.string().min(1),
    cta: ctaSchema,
  }),
})

export function adaptResidenceDetail(input: ApiResidenceDetailResponse): ResidenceDetail {
  const parsed = residenceDetailResponseSchema.parse(input)
  const mapLocationUrl = sanitizeMapLocationUrl(parsed.map_location_url, parsed.latitude, parsed.longitude)

  return {
    id: parsed.id,
    name: parsed.name,
    location: parsed.location,
    destination: parsed.destination,
    category: parsed.category,
    beds: parsed.beds,
    guests: parsed.guests,
    amenities: parsed.amenities,
    nightlyRateUsd: parsed.nightly_rate_usd,
    promotionalNightlyRateUsd: parsed.promotional_nightly_rate_usd ?? undefined,
    minNights: parsed.min_nights ?? 1,
    rating: parsed.rating,
    imageUrl: parsed.image_url,
    imageGallery: parsed.image_gallery,
    slug: parsed.slug,
    latitude: parsed.latitude,
    longitude: parsed.longitude,
    mapLocationUrl,
    descriptionTitle: parsed.description_title,
    shortDescription: parsed.short_description,
    amenitiesTitle: parsed.amenities_title,
    fullAmenities: parsed.full_amenities,
    locationSection: {
      title: parsed.location_section.title,
      description: parsed.location_section.description,
    },
    reviewsSection: {
      title: parsed.reviews_section.title,
      cta: parsed.reviews_section.cta,
      items: parsed.reviews_section.items.map((item) => ({
        id: item.id,
        guestName: item.guest_name,
        guestLocation: item.guest_location,
        rating: item.rating,
        comment: item.comment,
        stayDateLabel: item.stay_date_label,
      })),
    },
    roomDetailsSection: {
      title: parsed.room_details_section.title,
      items: parsed.room_details_section.items,
    },
    mapSection: {
      title: parsed.map_section.title,
      badgeLabel: parsed.map_section.badge_label,
      cta: {
        ...parsed.map_section.cta,
        href: parsed.map_section.cta.href?.trim() ? parsed.map_section.cta.href : mapLocationUrl,
      },
    },
  }
}
