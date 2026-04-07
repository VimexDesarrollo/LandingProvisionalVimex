import type { Property } from '@/types/property'

export const propertyMock: Property = {
  id: 'villa-azul-playa',
  name: 'Villa Azul',
  subtitle: 'Oceanfront luxury retreat with private concierge service',
  city: 'Playa del Carmen',
  country: 'Mexico',
  maxGuests: 8,
  bedrooms: 4,
  bathroomsFull: 4,
  bathroomsHalf: 1,
  hasPool: true,
  sizeM2: 420,
  rating: 4.9,
  reviewsCount: 126,
  currency: 'USD',
  nightlyPrice: 580,
  images: [
    {
      id: 'hero',
      url: 'https://images.unsplash.com/photo-1613553497126-a44624272024?auto=format&fit=crop&w=1800&q=80',
      alt: 'Infinity pool with ocean view in Playa del Carmen',
    },
    {
      id: 'living-room',
      url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1800&q=80',
      alt: 'Open-plan living room with tropical decor',
    },
    {
      id: 'primary-suite',
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80',
      alt: 'Primary bedroom with king bed and balcony access',
    },
  ],
  description:
    'Villa Azul is a premium beachfront property designed for elevated coastal living, featuring expansive indoor-outdoor spaces, private chef-ready kitchen, and sunset-facing terraces.',
  amenities: [
    'Private pool',
    'Ocean view terrace',
    'High-speed Wi-Fi',
    'Air conditioning',
    'Fully equipped kitchen',
    'Washer and dryer',
    'Dedicated workspace',
  ],
  latitude: 20.6296,
  longitude: -87.0739,
}
