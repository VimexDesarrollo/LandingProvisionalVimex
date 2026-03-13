export interface BookingQuoteNightRate {
  date: string
  rate: number
}

export interface CountryOption {
  code: string
  name: string
  flagEmoji: string
  dialCode: string
}

export interface BookingQuote {
  residenceSlug: string
  checkIn: string
  checkOut: string
  guests: number
  quotedNights: number
  quotedSubtotal: number
  quotedCleaningFee: number
  quotedServiceFee: number
  quotedTotal: number
  currency: string
  nightlyRates: BookingQuoteNightRate[]
}

export type CheckoutAccessState = 'anonymous' | 'guest' | 'otp_verified' | 'authenticated'

export interface CheckoutSession {
  token: string
  residenceSlug: string
  checkIn: string
  checkOut: string
  guests: number
  firstName: string
  lastName: string
  phone: string
  quotedNights: number
  quotedSubtotal: number
  quotedCleaningFee: number
  quotedServiceFee: number
  quotedTotal: number
  currency: string
  accessState: CheckoutAccessState
  identityEmail: string
  expiresAt: string
}

export interface BookingGuestContactValues {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type CheckoutSessionCreatePayload = BookingQuoteRequest

export interface CheckoutSessionOTPRequestPayload extends BookingGuestContactValues {
  checkoutSessionToken: string
}

export interface CheckoutSessionGuestPayload {
  checkoutSessionToken: string
}

export interface CheckoutSessionOTPVerifyPayload extends CheckoutSessionOTPRequestPayload {
  code: string
}

export interface BookingQuoteRequest {
  residenceSlug: string
  checkIn: string
  checkOut: string
  guests: number
}

export interface BookingRequestFormValues extends BookingGuestContactValues {
  phoneCountryCode: string
  country: string
  specialNotes: string
}

export interface BookingRequestGuestPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  specialNotes: string
}

export interface BookingRequestPayload extends BookingQuoteRequest, BookingRequestGuestPayload {
  checkoutSessionToken: string
  quotedNights: number
  quotedSubtotal: number
  quotedCleaningFee: number
  quotedServiceFee: number
  quotedTotal: number
  currency: string
}

export interface BookingRequestResponse extends BookingQuoteRequest, BookingRequestGuestPayload {
  id: string
  residenceSlug: string
  bookingId: string
  quotedNights: number
  quotedSubtotal: number
  quotedCleaningFee: number
  quotedServiceFee: number
  quotedTotal: number
  currency: string
  status: 'submitted' | 'cancelled'
  createdAt: string
}

export interface BookingApiConflict {
  code: 'DATES_UNAVAILABLE' | 'QUOTE_CHANGED'
  detail: string
  currentQuote?: BookingQuote
}
