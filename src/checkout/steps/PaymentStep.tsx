// ---------------------------------------------------------------------------
// PaymentStep.tsx — Paso 3: Pago
//
// Para el MVP (booking-request), este paso muestra que no hay cobro inmediato.
// Está diseñado para ser reemplazado con Stripe Elements cuando se implemente
// el flujo de instant-payment sin reescribir el stepper.
// ---------------------------------------------------------------------------

import { GlassPanel } from '@/design-system/components/GlassPanel'
import { Typography } from '@/design-system/components/Typography'
import { PaymentForm } from '../components/PaymentForm'
import type { CheckoutMode } from '../types'

interface PaymentStepProps {
  mode: CheckoutMode
}

export function PaymentStep({ mode }: PaymentStepProps) {
  return (
    <section aria-labelledby="payment-heading">
      <GlassPanel tone="mist" depth="elevated" radius="hero" padding="lg">
        <Typography
          id="payment-heading"
          as="h2"
          className="font-display text-2xl font-semibold text-ink mb-4"
        >
          Payment
        </Typography>
        <PaymentForm mode={mode} />
      </GlassPanel>
    </section>
  )
}
