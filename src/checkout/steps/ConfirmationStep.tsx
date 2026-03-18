// ---------------------------------------------------------------------------
// ConfirmationStep.tsx — Paso 4: Confirmación de la reserva
// ---------------------------------------------------------------------------

import { GlassPanel } from '@/design-system/components/GlassPanel'
import { ConfirmationMessage } from '../components/ConfirmationMessage'

interface ConfirmationStepProps {
  bookingRequestId: string
  residenceSlug: string
}

export function ConfirmationStep({ bookingRequestId, residenceSlug }: ConfirmationStepProps) {
  return (
    <section aria-labelledby="confirmation-heading">
      <GlassPanel tone="mist" depth="elevated" radius="hero" padding="lg" className="p-10">
        <h2 id="confirmation-heading" className="sr-only">
          Booking confirmation
        </h2>
        <ConfirmationMessage
          bookingRequestId={bookingRequestId}
          residenceSlug={residenceSlug}
        />
      </GlassPanel>
    </section>
  )
}
