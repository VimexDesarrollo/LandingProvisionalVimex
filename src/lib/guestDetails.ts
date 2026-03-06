import { DEFAULT_GUEST_DETAILS, type GuestDetails } from '@/types/guests'

function parseNonNegativeInteger(value: string | null): number | null {
  if (!value) {
    return null
  }

  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null
  }

  return parsed
}

function parseLegacyGuests(value: string | null): number | null {
  if (!value) {
    return null
  }

  const parsed = Number.parseInt(value.replace('+', ''), 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

export function normalizeGuestDetails(input: GuestDetails): GuestDetails {
  const adults = Math.max(1, Math.floor(input.adults))
  const children = Math.max(0, Math.floor(input.children))
  const infants = Math.max(0, Math.floor(input.infants))

  return {
    adults,
    children,
    infants,
    pets: input.pets,
  }
}

export function getGuestTotal(details: GuestDetails): number {
  const normalized = normalizeGuestDetails(details)
  return normalized.adults + normalized.children + normalized.infants
}

export function isGuestDetailsDefault(details: GuestDetails): boolean {
  const normalized = normalizeGuestDetails(details)

  return (
    normalized.adults === DEFAULT_GUEST_DETAILS.adults &&
    normalized.children === DEFAULT_GUEST_DETAILS.children &&
    normalized.infants === DEFAULT_GUEST_DETAILS.infants &&
    normalized.pets === DEFAULT_GUEST_DETAILS.pets
  )
}

export function formatGuestSummary(details: GuestDetails, placeholder = 'Guests'): string {
  if (isGuestDetailsDefault(details)) {
    return placeholder
  }

  const total = getGuestTotal(details)
  const normalized = normalizeGuestDetails(details)
  const parts = [`${total} guest${total === 1 ? '' : 's'}`]

  if (normalized.pets) {
    parts.push('with pets')
  }

  return parts.join(' - ')
}

export function parseGuestDetailsFromSearchParams(searchParams: URLSearchParams): GuestDetails {
  const adults = parseNonNegativeInteger(searchParams.get('adults'))
  const children = parseNonNegativeInteger(searchParams.get('children'))
  const infants = parseNonNegativeInteger(searchParams.get('infants'))
  const pets = searchParams.get('pets') === 'true'
  const hasStructuredGuestParams = adults !== null || children !== null || infants !== null

  if (hasStructuredGuestParams) {
    return normalizeGuestDetails({
      adults: adults ?? DEFAULT_GUEST_DETAILS.adults,
      children: children ?? DEFAULT_GUEST_DETAILS.children,
      infants: infants ?? DEFAULT_GUEST_DETAILS.infants,
      pets,
    })
  }

  const legacyGuests = parseLegacyGuests(searchParams.get('guests'))
  if (legacyGuests !== null) {
    return normalizeGuestDetails({
      adults: legacyGuests,
      children: 0,
      infants: 0,
      pets,
    })
  }

  return {
    ...DEFAULT_GUEST_DETAILS,
    pets,
  }
}

export function writeGuestDetailsToSearchParams(searchParams: URLSearchParams, details: GuestDetails): void {
  const normalized = normalizeGuestDetails(details)
  const hasCustomCapacity =
    normalized.adults !== DEFAULT_GUEST_DETAILS.adults ||
    normalized.children !== DEFAULT_GUEST_DETAILS.children ||
    normalized.infants !== DEFAULT_GUEST_DETAILS.infants

  if (isGuestDetailsDefault(normalized)) {
    searchParams.delete('adults')
    searchParams.delete('children')
    searchParams.delete('infants')
    searchParams.delete('pets')
    searchParams.delete('guests')
    return
  }

  if (hasCustomCapacity) {
    searchParams.set('adults', String(normalized.adults))
    searchParams.set('children', String(normalized.children))
    searchParams.set('infants', String(normalized.infants))
    searchParams.set('guests', `${getGuestTotal(normalized)}+`)
  } else {
    searchParams.delete('adults')
    searchParams.delete('children')
    searchParams.delete('infants')
    searchParams.delete('guests')
  }

  if (normalized.pets) {
    searchParams.set('pets', 'true')
  } else {
    searchParams.delete('pets')
  }
}
