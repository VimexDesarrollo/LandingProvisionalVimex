import { z } from 'zod'
import { apiClient, ApiError } from '@/services/apiClient'
import { endpoints } from '@/services/endpoints'
import type {
  BookingApiConflict,
  BookingQuote,
  BookingQuoteRequest,
  CheckoutSession,
  CheckoutSessionCreatePayload,
  CheckoutSessionGuestPayload,
  CheckoutSessionOTPRequestPayload,
  CheckoutSessionOTPVerifyPayload,
  BookingRequestPayload,
  BookingRequestResponse,
  CountryOption,
} from '@/types/booking'

const nightlyRateSchema = z.object({
  date: z.string(),
  rate: z.number(),
})

const quoteResponseSchema = z.object({
  residence_slug: z.string(),
  check_in: z.string(),
  check_out: z.string(),
  guests: z.number(),
  quoted_nights: z.number(),
  quoted_subtotal: z.number(),
  quoted_cleaning_fee: z.number(),
  quoted_service_fee: z.number(),
  quoted_total: z.number(),
  currency: z.string(),
  nightly_rates: z.array(nightlyRateSchema),
})

const bookingRequestResponseSchema = z.object({
  id: z.string(),
  residence_slug: z.string(),
  booking_id: z.string(),
  check_in: z.string(),
  check_out: z.string(),
  guests: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  country: z.string(),
  special_notes: z.string(),
  quoted_nights: z.number(),
  quoted_subtotal: z.number(),
  quoted_cleaning_fee: z.number(),
  quoted_service_fee: z.number(),
  quoted_total: z.number(),
  currency: z.string(),
  status: z.enum(['submitted', 'cancelled']),
  created_at: z.string(),
})

const bookingConflictSchema = z.object({
  code: z.enum(['DATES_UNAVAILABLE', 'QUOTE_CHANGED']),
  detail: z.string(),
  current_quote: quoteResponseSchema.optional(),
})

const checkoutSessionSchema = z.object({
  token: z.string(),
  residence_slug: z.string(),
  check_in: z.string(),
  check_out: z.string(),
  guests: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string(),
  quoted_nights: z.number(),
  quoted_subtotal: z.number(),
  quoted_cleaning_fee: z.number(),
  quoted_service_fee: z.number(),
  quoted_total: z.number(),
  currency: z.string(),
  access_state: z.enum(['anonymous', 'guest', 'otp_verified', 'authenticated']),
  identity_email: z.string(),
  expires_at: z.string(),
})

const checkoutOtpResponseSchema = z.object({
  detail: z.string(),
  checkout_session: checkoutSessionSchema,
})

const countrySchema = z.object({
  code: z.string().length(2),
  name: z.string(),
  flag_emoji: z.string(),
  dial_code: z.string(),
})

function adaptQuoteResponse(input: z.infer<typeof quoteResponseSchema>): BookingQuote {
  return {
    residenceSlug: input.residence_slug,
    checkIn: input.check_in,
    checkOut: input.check_out,
    guests: input.guests,
    firstName: input.first_name,
    lastName: input.last_name,
    phone: input.phone,
    quotedNights: input.quoted_nights,
    quotedSubtotal: input.quoted_subtotal,
    quotedCleaningFee: input.quoted_cleaning_fee,
    quotedServiceFee: input.quoted_service_fee,
    quotedTotal: input.quoted_total,
    currency: input.currency,
    nightlyRates: input.nightly_rates,
  }
}

function adaptCheckoutSession(input: z.infer<typeof checkoutSessionSchema>): CheckoutSession {
  return {
    token: input.token,
    residenceSlug: input.residence_slug,
    checkIn: input.check_in,
    checkOut: input.check_out,
    guests: input.guests,
    firstName: input.first_name,
    lastName: input.last_name,
    phone: input.phone,
    quotedNights: input.quoted_nights,
    quotedSubtotal: input.quoted_subtotal,
    quotedCleaningFee: input.quoted_cleaning_fee,
    quotedServiceFee: input.quoted_service_fee,
    quotedTotal: input.quoted_total,
    currency: input.currency,
    accessState: input.access_state,
    identityEmail: input.identity_email,
    expiresAt: input.expires_at,
  }
}

function adaptBookingRequestResponse(input: z.infer<typeof bookingRequestResponseSchema>): BookingRequestResponse {
  return {
    id: input.id,
    residenceSlug: input.residence_slug,
    bookingId: input.booking_id,
    checkIn: input.check_in,
    checkOut: input.check_out,
    guests: input.guests,
    firstName: input.first_name,
    lastName: input.last_name,
    email: input.email,
    phone: input.phone,
    country: input.country,
    specialNotes: input.special_notes,
    quotedNights: input.quoted_nights,
    quotedSubtotal: input.quoted_subtotal,
    quotedCleaningFee: input.quoted_cleaning_fee,
    quotedServiceFee: input.quoted_service_fee,
    quotedTotal: input.quoted_total,
    currency: input.currency,
    status: input.status,
    createdAt: input.created_at,
  }
}

function buildQuotePayload(input: BookingQuoteRequest) {
  return {
    residence_slug: input.residenceSlug,
    check_in: input.checkIn,
    check_out: input.checkOut,
    guests: input.guests,
  }
}

function buildBookingRequestPayload(input: BookingRequestPayload) {
  return {
    checkout_session_token: input.checkoutSessionToken,
    residence_slug: input.residenceSlug,
    check_in: input.checkIn,
    check_out: input.checkOut,
    guests: input.guests,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    country: input.country,
    special_notes: input.specialNotes,
    quoted_nights: input.quotedNights,
    quoted_subtotal: input.quotedSubtotal,
    quoted_cleaning_fee: input.quotedCleaningFee,
    quoted_service_fee: input.quotedServiceFee,
    quoted_total: input.quotedTotal,
    currency: input.currency,
  }
}

export function getBookingConflict(error: unknown): BookingApiConflict | null {
  if (!(error instanceof ApiError)) {
    return null
  }

  const parsedConflict = bookingConflictSchema.safeParse(error.body)
  if (!parsedConflict.success) {
    return null
  }

  return {
    code: parsedConflict.data.code,
    detail: parsedConflict.data.detail,
    currentQuote: parsedConflict.data.current_quote ? adaptQuoteResponse(parsedConflict.data.current_quote) : undefined,
  }
}

function readFirstErrorMessage(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (Array.isArray(value) && value.length > 0) {
    return readFirstErrorMessage(value[0])
  }

  return null
}

export function getCheckoutSessionErrorDetail(error: unknown): string | null {
  if (!(error instanceof ApiError)) {
    return null
  }

  if (typeof error.body === 'string' && error.body.trim()) {
    return error.body
  }

  if (!error.body || typeof error.body !== 'object') {
    return null
  }

  const body = error.body as Record<string, unknown>
  const detailMessage = readFirstErrorMessage(body.detail)
  if (detailMessage) {
    return detailMessage
  }

  for (const field of ['check_out', 'check_in', 'guests', 'residence_slug']) {
    const fieldMessage = readFirstErrorMessage(body[field])
    if (fieldMessage) {
      return fieldMessage
    }
  }

  return null
}

export const bookingRequestService = {
  async getCountries(signal?: AbortSignal): Promise<CountryOption[]> {
    const response = await apiClient.get<Array<z.infer<typeof countrySchema>>>(endpoints.countries, { signal })
    return z.array(countrySchema).parse(response).map((country) => ({
      code: country.code,
      name: country.name,
      flagEmoji: country.flag_emoji,
      dialCode: country.dial_code,
    }))
  },

  async getQuote(input: BookingQuoteRequest, signal?: AbortSignal): Promise<BookingQuote> {
    const response = await apiClient.post<ReturnType<typeof buildQuotePayload>, z.infer<typeof quoteResponseSchema>>(
      endpoints.quotes,
      buildQuotePayload(input),
      { signal },
    )

    return adaptQuoteResponse(quoteResponseSchema.parse(response))
  },

  async createCheckoutSession(input: CheckoutSessionCreatePayload): Promise<CheckoutSession> {
    const response = await apiClient.post<
      { residence_slug: string; check_in: string; check_out: string; guests: number },
      z.infer<typeof checkoutSessionSchema>
    >(endpoints.authCheckoutSessions, {
      residence_slug: input.residenceSlug,
      check_in: input.checkIn,
      check_out: input.checkOut,
      guests: input.guests,
    })

    return adaptCheckoutSession(checkoutSessionSchema.parse(response))
  },

  async getCheckoutSession(token: string, signal?: AbortSignal): Promise<CheckoutSession> {
    const response = await apiClient.get<z.infer<typeof checkoutSessionSchema>>(
      endpoints.authCheckoutSessionDetail(token),
      { signal },
    )
    return adaptCheckoutSession(checkoutSessionSchema.parse(response))
  },

  async continueCheckoutAsGuest(input: CheckoutSessionGuestPayload): Promise<CheckoutSession> {
    const response = await apiClient.post<
      { checkout_session_token: string },
      z.infer<typeof checkoutSessionSchema>
    >(endpoints.authCheckoutSessionGuest, {
      checkout_session_token: input.checkoutSessionToken,
    })

    return adaptCheckoutSession(checkoutSessionSchema.parse(response))
  },

  async requestCheckoutOtp(input: CheckoutSessionOTPRequestPayload): Promise<CheckoutSession> {
    const response = await apiClient.post<
      { checkout_session_token: string; first_name: string; last_name: string; email: string; phone: string },
      z.infer<typeof checkoutOtpResponseSchema>
    >(endpoints.authCheckoutSessionOtpRequest, {
      checkout_session_token: input.checkoutSessionToken,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
    })

    return adaptCheckoutSession(checkoutOtpResponseSchema.parse(response).checkout_session)
  },

  async verifyCheckoutOtp(input: CheckoutSessionOTPVerifyPayload): Promise<CheckoutSession> {
    const response = await apiClient.post<
      { checkout_session_token: string; email: string; code: string },
      z.infer<typeof checkoutOtpResponseSchema>
    >(endpoints.authCheckoutSessionOtpVerify, {
      checkout_session_token: input.checkoutSessionToken,
      email: input.email,
      code: input.code,
    })

    return adaptCheckoutSession(checkoutOtpResponseSchema.parse(response).checkout_session)
  },

  async createBookingRequest(input: BookingRequestPayload): Promise<BookingRequestResponse> {
    const response = await apiClient.post<
      ReturnType<typeof buildBookingRequestPayload>,
      z.infer<typeof bookingRequestResponseSchema>
    >(endpoints.bookingRequests, buildBookingRequestPayload(input))

    return adaptBookingRequestResponse(bookingRequestResponseSchema.parse(response))
  },
}
