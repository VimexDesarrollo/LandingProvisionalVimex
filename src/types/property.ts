export interface PropertyImage {
  id: string
  url: string
  alt: string
}

export interface Property {
  id: string
  name: string
  subtitle: string
  city: string
  country: string
  maxGuests: number
  bedrooms: number
  bathroomsFull: number
  bathroomsHalf: number
  hasPool: boolean
  sizeM2: number
  rating: number
  reviewsCount: number
  currency: string
  nightlyPrice: number
  images: PropertyImage[]
  description: string
  amenities: string[]
  latitude: number
  longitude: number
}
