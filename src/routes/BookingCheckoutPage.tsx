'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { BookingCheckoutSummary } from '@/components/booking-request/BookingCheckoutSummary'
import { BookingGuestForm } from '@/components/booking-request/BookingGuestForm'
import { Container } from '@/design-system/components/Container'
import { Button } from '@/design-system/components/Button'
import { Typography } from '@/design-system/components/Typography'
import { useBookingQuote } from '@/hooks/useBookingQuote'
import { useCheckoutSession } from '@/hooks/useCheckoutSession'
import { useCountries } from '@/hooks/useCountries'
import { useResidenceDetail } from '@/hooks/useResidenceDetail'
import { bookingRequestService, getBookingConflict } from '@/services/bookingRequestService'
import type { BookingRequestFormValues } from '@/types/booking'

const bookingGuestFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.').max(120, 'First name is too long.'),
  lastName: z.string().trim().min(1, 'Last name is required.').max(120, 'Last name is too long.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phoneCountryCode: z.string().trim().min(1, 'Phone code is required.').max(8, 'Phone code is invalid.'),
  phone: z.string().trim().min(1, 'Phone is required.').max(50, 'Phone is too long.'),
  country: z.string().trim().min(1, 'Country is required.').max(120, 'Country is too long.'),
  specialNotes: z.string().max(2000, 'Special notes are too long.'),
})

const EMPTY_FORM_VALUES: BookingRequestFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneCountryCode: '',
  phone: '',
  country: '',
  specialNotes: '',
}

function buildFieldErrors(error: z.ZodError<BookingRequestFormValues>) {
  const fieldErrors = error.flatten().fieldErrors

  return {
    firstName: fieldErrors.firstName?.[0],
    lastName: fieldErrors.lastName?.[0],
    email: fieldErrors.email?.[0],
    phoneCountryCode: fieldErrors.phoneCountryCode?.[0],
    phone: fieldErrors.phone?.[0],
    country: fieldErrors.country?.[0],
    specialNotes: fieldErrors.specialNotes?.[0],
  }
}

function formatPhoneForSubmission(phoneCountryCode: string, phone: string): string {
  return `${phoneCountryCode.trim()} ${phone.trim()}`.trim()
}

function buildSuccessUrl(pathname: string, requestId: string, searchParams: URLSearchParams): string {
  const params = new URLSearchParams(searchParams.toString())
  params.set('requestId', requestId)
  params.delete('checkoutSession')
  return `${pathname}/success?${params.toString()}`
}

function hasChronologicalStay(checkIn: string | undefined, checkOut: string | undefined): boolean {
  if (!checkIn || !checkOut) {
    return false
  }

  const startDate = new Date(`${checkIn}T00:00:00`)
  const endDate = new Date(`${checkOut}T00:00:00`)

  return Number.isFinite(startDate.getTime()) && Number.isFinite(endDate.getTime()) && endDate > startDate
}

export function BookingCheckoutPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutSessionToken = searchParams.get('checkoutSession') ?? undefined
  const slugParam = params?.slug
  const routeResidenceSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam
  const { checkoutSession, isLoading: isCheckoutSessionLoading, error: checkoutSessionError } = useCheckoutSession(checkoutSessionToken)
  const residenceSlug = checkoutSession?.residenceSlug ?? routeResidenceSlug
  const checkIn = checkoutSession?.checkIn
  const checkOut = checkoutSession?.checkOut
  const totalGuests = checkoutSession?.guests ?? 0
  const hasValidStay = Boolean(
    checkoutSession &&
    residenceSlug &&
    routeResidenceSlug === checkoutSession.residenceSlug &&
    hasChronologicalStay(checkIn, checkOut) &&
    totalGuests > 0,
  )
  const { residence, isLoading: isResidenceLoading, error: hasResidenceError } = useResidenceDetail(residenceSlug)
  const { countries, isLoading: isCountriesLoading, error: hasCountriesError } = useCountries()
  const {
    quote,
    isLoading: isQuoteLoading,
    error: quoteError,
    setQuote,
  } = useBookingQuote(residenceSlug, checkIn, checkOut, totalGuests)
  const [formValues, setFormValues] = useState<BookingRequestFormValues>(EMPTY_FORM_VALUES)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingRequestFormValues, string>>>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (!checkoutSession) {
      return
    }

    setFormValues((currentValues) => ({
      ...currentValues,
      firstName: currentValues.firstName || checkoutSession.firstName,
      lastName: currentValues.lastName || checkoutSession.lastName,
      email: currentValues.email || checkoutSession.identityEmail,
      phone: currentValues.phone || checkoutSession.phone,
    }))
  }, [checkoutSession])

  const handleFieldChange = (field: keyof BookingRequestFormValues, value: string) => {
    setFormValues((currentValues) => {
      if (field !== 'country') {
        return {
          ...currentValues,
          [field]: value,
        }
      }

      const selectedCountry = countries.find((country) => country.code === value)
      const shouldSyncPhoneCode =
        !currentValues.phoneCountryCode ||
        countries.some((country) => country.dialCode === currentValues.phoneCountryCode && country.code === currentValues.country)

      return {
        ...currentValues,
        country: value,
        phoneCountryCode: shouldSyncPhoneCode && selectedCountry ? selectedCountry.dialCode : currentValues.phoneCountryCode,
      }
    })
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
      ...(field === 'country' ? { phoneCountryCode: undefined } : {}),
    }))
  }

  const handleSubmit = async () => {
    const parsedForm = bookingGuestFormSchema.safeParse(formValues)

    if (!parsedForm.success) {
      setFormErrors(buildFieldErrors(parsedForm.error))
      return
    }

    if (!checkoutSessionToken || !residenceSlug || !checkIn || !checkOut || !quote) {
      setSubmissionError('We could not validate your booking details. Please review the stay and try again.')
      return
    }

    setSubmissionError(null)
    setIsSubmitting(true)

    try {
      const { phoneCountryCode, ...guestData } = parsedForm.data

      const bookingRequest = await bookingRequestService.createBookingRequest({
        checkoutSessionToken,
        residenceSlug,
        checkIn,
        checkOut,
        guests: totalGuests,
        ...guestData,
        phone: formatPhoneForSubmission(phoneCountryCode, guestData.phone),
        quotedNights: quote.quotedNights,
        quotedSubtotal: quote.quotedSubtotal,
        quotedCleaningFee: quote.quotedCleaningFee,
        quotedServiceFee: quote.quotedServiceFee,
        quotedTotal: quote.quotedTotal,
        currency: quote.currency,
      })

      router.push(buildSuccessUrl(`/residences/${residenceSlug}/checkout`, bookingRequest.id, new URLSearchParams(searchParams.toString())))
    } catch (error) {
      const conflict = getBookingConflict(error)

      if (conflict?.currentQuote) {
        setQuote(conflict.currentQuote)
      }

      setSubmissionError(conflict?.detail ?? 'We could not send your booking request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckoutSessionLoading || isResidenceLoading) {
    return (
      <main className="pb-section pt-44">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="h-80 animate-pulse rounded-2xl bg-white/65" />
            <div className="h-96 animate-pulse rounded-2xl bg-white/65" />
          </div>
        </Container>
      </main>
    )
  }

  if (!hasValidStay) {
    return (
      <main className="pb-section pt-44">
        <Container>
          <section className="rounded-2xl border border-white/70 bg-mist-gradient p-6 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46">
            <Typography as="h1" variant="h3">
              Booking checkout
            </Typography>
            <Typography className="mt-3 text-base text-ink-soft">
              {checkoutSessionError ?? 'Select a valid checkout flow before continuing.'}
            </Typography>
            <Button className="mt-5" onClick={() => router.push(residenceSlug ? `/residences/${residenceSlug}` : '/residences')}>
              Return to residence
            </Button>
          </section>
        </Container>
      </main>
    )
  }

  if (hasResidenceError || !residence) {
    return (
      <main className="pb-section pt-44">
        <Container>
          <section className="rounded-2xl border border-white/70 bg-mist-gradient p-6 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46">
            <Typography as="h1" variant="h3">
              Residence unavailable
            </Typography>
            <Typography className="mt-3 text-base text-ink-soft">
              We could not load this residence right now. Return to the detail page and try again.
            </Typography>
          </section>
        </Container>
      </main>
    )
  }

  return (
    <main className="pb-section pt-44">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <BookingCheckoutSummary residence={residence} quote={quote} guests={totalGuests} />

          <div className="space-y-4">
            {quoteError ? (
              <div className="rounded-2xl border border-amber-300/65 bg-amber-100/70 px-4 py-3 text-sm font-medium text-amber-950" role="alert">
                {quoteError.detail}
              </div>
            ) : null}
            {submissionError ? (
              <div className="rounded-2xl border border-red-300/65 bg-red-100/70 px-4 py-3 text-sm font-medium text-red-950" role="alert">
                {submissionError}
              </div>
            ) : null}
            {isQuoteLoading ? (
              <div className="rounded-2xl border border-white/70 bg-white/78 px-4 py-3 text-sm text-ink-soft shadow-soft">
                Validating current availability and pricing…
              </div>
            ) : null}
            {hasCountriesError ? (
              <div className="rounded-2xl border border-amber-300/65 bg-amber-100/70 px-4 py-3 text-sm font-medium text-amber-950">
                We could not load the country list right now.
              </div>
            ) : null}
            <BookingGuestForm
              countries={countries}
              isCountriesLoading={isCountriesLoading}
              values={formValues}
              errors={formErrors}
              isSubmitting={isSubmitting}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </Container>
    </main>
  )
}
