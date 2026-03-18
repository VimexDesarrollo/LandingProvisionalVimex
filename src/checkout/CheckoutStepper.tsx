'use client'

// ---------------------------------------------------------------------------
// CheckoutStepper.tsx — Contenedor principal del flujo de checkout
//
// Responsabilidades:
//   - Leer el checkoutSessionToken de los searchParams
//   - Orquestar los hooks de datos (session, quote, countries, residence)
//   - Mantener el estado del stepper via useCheckoutStepper()
//   - Renderizar el paso activo
//   - Hacer el POST a la API cuando el usuario confirma en ReviewBookingStep
//   - Manejar errores de quote conflict actualizando el quote
//
// Lo que NO hace:
//   - Validar campos (cada Step se encarga de su propio formulario)
//   - Saber sobre la UI interna de cada paso
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Container } from '@/design-system/components/Container'
import { useCheckoutSession } from '@/hooks/useCheckoutSession'
import { useBookingQuote } from '@/hooks/useBookingQuote'
import { useCountries } from '@/hooks/useCountries'
import { useResidenceDetail } from '@/hooks/useResidenceDetail'
import { bookingRequestService, getBookingConflict } from '@/services/bookingRequestService'
import { formatPhoneForSubmission } from './utils'
import { useCheckoutStepper } from './useCheckoutStepper'
import { StepIndicator } from './components/StepIndicator'
import { GuestInformationStep } from './steps/GuestInformationStep'
import { ReviewBookingStep } from './steps/ReviewBookingStep'
import { PaymentStep } from './steps/PaymentStep'
import { ConfirmationStep } from './steps/ConfirmationStep'
import type { GuestInformationValues } from './types'

// ── Loading skeleton ──────────────────────────────────────────────────────

function CheckoutSkeleton() {
  return (
    <main className="pb-section pt-44">
      <Container>
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-10 animate-pulse rounded-xl bg-white/65" />
          <div className="h-80 animate-pulse rounded-2xl bg-white/65" />
          <div className="h-48 animate-pulse rounded-2xl bg-white/65" />
        </div>
      </Container>
    </main>
  )
}

// ── Error screen ──────────────────────────────────────────────────────────

function CheckoutError({ message }: { message: string }) {
  return (
    <main className="pb-section pt-44">
      <Container>
        <section className="mx-auto max-w-2xl rounded-2xl border border-white/70 bg-mist-gradient p-6 shadow-soft">
          <h1 className="font-display text-2xl font-semibold text-ink">Checkout unavailable</h1>
          <p className="mt-3 text-base text-ink-soft">{message}</p>
        </section>
      </Container>
    </main>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export function CheckoutStepper() {
  const params                  = useParams<{ slug: string }>()
  const searchParams            = useSearchParams()
  const slugParam               = params?.slug
  const slug                    = Array.isArray(slugParam) ? slugParam[0] : slugParam
  const checkoutSessionToken    = searchParams.get('checkoutSession') ?? undefined

  // ── Data hooks ─────────────────────────────────────────────────────────
  const { checkoutSession, isLoading: isSessionLoading, error: sessionError } =
    useCheckoutSession(checkoutSessionToken)

  const residenceSlug = checkoutSession?.residenceSlug ?? slug
  const { residence, isLoading: isResidenceLoading } = useResidenceDetail(residenceSlug)
  const { countries, isLoading: isCountriesLoading } = useCountries()
  const {
    quote,
    isLoading: isQuoteLoading,
    error: quoteError,
    setQuote,
  } = useBookingQuote(
    checkoutSession?.residenceSlug,
    checkoutSession?.checkIn,
    checkoutSession?.checkOut,
    checkoutSession?.guests,
  )

  // ── Stepper state ──────────────────────────────────────────────────────
  const stepper = useCheckoutStepper()

  // ── Submission state ───────────────────────────────────────────────────
  const [isSubmitting,    setIsSubmitting]    = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // ── Loading / error gates ──────────────────────────────────────────────
  const isLoading = isSessionLoading || isResidenceLoading || isQuoteLoading

  if (isLoading) return <CheckoutSkeleton />

  if (sessionError || !checkoutSession) {
    return <CheckoutError message={sessionError ?? 'Checkout session not found. Please start again.'} />
  }

  if (!residence) {
    return <CheckoutError message="Could not load the residence. Please try again." />
  }

  if (!checkoutSessionToken) {
    return <CheckoutError message="Missing checkout session. Please start again from the residence page." />
  }

  // Session must belong to the current residence
  if (checkoutSession.residenceSlug !== slug) {
    return <CheckoutError message="This checkout session does not match the current property." />
  }

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleGuestInformationComplete = (values: GuestInformationValues) => {
    stepper.setGuestInformation(values)
    stepper.goNext()
  }

  const handleSubmit = async () => {
    if (!quote) {
      setSubmissionError('Pricing is not available yet. Please wait a moment and try again.')
      return
    }

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const { phoneCountryCode, ...guestData } = stepper.state.guestInformation
      const bookingRequest = await bookingRequestService.createBookingRequest({
        checkoutSessionToken,
        residenceSlug:     checkoutSession.residenceSlug,
        checkIn:           checkoutSession.checkIn,
        checkOut:          checkoutSession.checkOut,
        guests:            checkoutSession.guests,
        ...guestData,
        phone:             formatPhoneForSubmission(phoneCountryCode, guestData.phone),
        quotedNights:      quote.quotedNights,
        quotedSubtotal:    quote.quotedSubtotal,
        quotedCleaningFee: quote.quotedCleaningFee,
        quotedServiceFee:  quote.quotedServiceFee,
        quotedTotal:       quote.quotedTotal,
        currency:          quote.currency,
      })

      stepper.setBookingRequestId(bookingRequest.id)
      stepper.goToStep(3) // Jump to confirmation step
    } catch (error) {
      const conflict = getBookingConflict(error)
      if (conflict?.currentQuote) {
        setQuote(conflict.currentQuote)
        setSubmissionError(conflict.detail)
      } else {
        setSubmissionError('We could not send your booking request. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (stepper.currentStepId) {
      case 'guest-information':
        return (
          <GuestInformationStep
            initialValues={stepper.state.guestInformation}
            checkoutSession={checkoutSession}
            countries={countries}
            isCountriesLoading={isCountriesLoading}
            onComplete={handleGuestInformationComplete}
          />
        )

      case 'review-booking':
        if (!quote) {
          return (
            <div className="rounded-xl border border-amber-300/65 bg-amber-100/70 px-4 py-3 text-sm font-medium text-amber-950" role="alert">
              {quoteError?.detail ?? 'Validating current pricing…'}
            </div>
          )
        }
        return (
          <ReviewBookingStep
            guestInformation={stepper.state.guestInformation}
            residence={residence}
            quote={quote}
            checkIn={checkoutSession.checkIn}
            checkOut={checkoutSession.checkOut}
            guests={checkoutSession.guests}
            policyAccepted={stepper.state.policyAccepted}
            submissionError={submissionError}
            isSubmitting={isSubmitting}
            onPolicyChange={stepper.setPolicyAccepted}
            onSubmit={handleSubmit}
            onBack={stepper.goBack}
          />
        )

      case 'payment':
        return <PaymentStep mode="booking-request" />

      case 'confirmation':
        return stepper.state.bookingRequestId ? (
          <ConfirmationStep
            bookingRequestId={stepper.state.bookingRequestId}
            residenceSlug={checkoutSession.residenceSlug}
          />
        ) : null
    }
  }

  return (
    <main className="pb-section pt-44">
      <Container>
        <div className="mx-auto max-w-2xl">
          <StepIndicator
            state={stepper.state}
            onStepClick={stepper.goToStep}
          />
          <div key={stepper.state.currentStepIndex} className="animate-step-in">
            {renderStep()}
          </div>
        </div>
      </Container>
    </main>
  )
}
