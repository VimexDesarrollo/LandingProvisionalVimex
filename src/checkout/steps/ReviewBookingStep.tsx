// ---------------------------------------------------------------------------
// ReviewBookingStep.tsx — Paso 2: Revisión de la reserva
//
// Responsabilidades:
//   - Mostrar resumen de propiedad, fechas y precio
//   - Mostrar los datos del huésped para revisión final
//   - Aceptación de políticas (PolicyAcceptance)
//   - Llamar onSubmit() → el contenedor hace el POST al backend
//   - Mostrar errores de la API si el submit falla
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import { GlassPanel } from '@/design-system/components/GlassPanel'
import { Button } from '@/design-system/components/Button'
import { Typography } from '@/design-system/components/Typography'
import { BookingSummaryCard } from '../components/BookingSummaryCard'
import { PriceBreakdown } from '../components/PriceBreakdown'
import { PolicyAcceptance } from '../components/PolicyAcceptance'
import type { BookingQuote } from '@/types/booking'
import type { ResidenceDetail } from '@/types/content'
import type { GuestInformationValues } from '../types'

interface ReviewBookingStepProps {
  guestInformation: GuestInformationValues
  residence: ResidenceDetail
  quote: BookingQuote
  checkIn: string
  checkOut: string
  guests: number
  policyAccepted: boolean
  submissionError: string | null
  isSubmitting: boolean
  onPolicyChange: (accepted: boolean) => void
  onSubmit: () => void
  onBack: () => void
}

export function ReviewBookingStep({
  guestInformation,
  residence,
  quote,
  checkIn,
  checkOut,
  guests,
  policyAccepted,
  submissionError,
  isSubmitting,
  onPolicyChange,
  onSubmit,
  onBack,
}: ReviewBookingStepProps) {
  const [policyError, setPolicyError] = useState<string | undefined>()

  const handleSubmit = () => {
    if (!policyAccepted) {
      setPolicyError('You must accept the policies to continue.')
      return
    }
    setPolicyError(undefined)
    onSubmit()
  }

  return (
    <section aria-labelledby="review-heading">
      <div className="space-y-4">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded disabled:opacity-50"
        >
          <FiChevronLeft className="h-4 w-4" aria-hidden />
          Edit information
        </button>

        {/* Booking summary */}
        <BookingSummaryCard
          residence={residence}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
        />

        {/* Price breakdown */}
        <GlassPanel tone="mist" depth="default" radius="glass" padding="md">
          <Typography as="h2" id="review-heading" className="font-display text-xl font-semibold text-ink mb-4">
            Review your booking
          </Typography>
          <PriceBreakdown quote={quote} />
        </GlassPanel>

        {/* Guest details summary */}
        <GlassPanel tone="mist" depth="default" radius="glass" padding="md">
          <Typography as="h3" className="font-semibold text-ink mb-3">
            Your details
          </Typography>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Name</dt>
              <dd className="font-medium text-ink">
                {guestInformation.firstName} {guestInformation.lastName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Email</dt>
              <dd className="font-medium text-ink">{guestInformation.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Phone</dt>
              <dd className="font-medium text-ink">
                {guestInformation.phoneCountryCode} {guestInformation.phone}
              </dd>
            </div>
            {guestInformation.specialNotes ? (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Notes</dt>
                <dd className="font-medium text-ink max-w-[60%] text-right">
                  {guestInformation.specialNotes}
                </dd>
              </div>
            ) : null}
          </dl>
        </GlassPanel>

        {/* Policy acceptance + submit */}
        <GlassPanel tone="mist" depth="default" radius="glass" padding="md">
          <PolicyAcceptance
            accepted={policyAccepted}
            onChange={(v) => {
              onPolicyChange(v)
              if (v) setPolicyError(undefined)
            }}
            error={policyError}
          />

          {submissionError ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-300/65 bg-red-100/70 px-4 py-3 text-sm font-medium text-red-950"
            >
              {submissionError}
            </div>
          ) : null}

          <Button
            type="button"
            variant="brand"
            className="mt-6 w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Sending request…' : 'Send booking request'}
          </Button>
        </GlassPanel>
      </div>
    </section>
  )
}
