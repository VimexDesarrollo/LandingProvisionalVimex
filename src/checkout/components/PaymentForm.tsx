// ---------------------------------------------------------------------------
// PaymentForm.tsx — Placeholder para integración de pagos
//
// Para MVP el flujo es booking-request (sin cobro).
// Este componente reserva el espacio para la integración futura con Stripe.
// ---------------------------------------------------------------------------

import { FiLock } from 'react-icons/fi'

interface PaymentFormProps {
  /** En modo 'booking-request' se muestra como paso deshabilitado/futuro */
  mode?: 'booking-request' | 'instant-payment'
}

export function PaymentForm({ mode = 'booking-request' }: PaymentFormProps) {
  if (mode === 'booking-request') {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/20 bg-white/40 p-8 text-center"
        aria-label="Payment step — not required for booking requests"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/6">
          <FiLock className="h-6 w-6 text-ink-soft" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-ink">No payment required</p>
          <p className="mt-1.5 text-sm text-ink-soft">
            This is a booking request. You will only be charged once our team confirms
            availability and you approve the final details.
          </p>
        </div>
      </div>
    )
  }

  // Slot for future Stripe Elements integration
  return (
    <div
      className="rounded-2xl border border-ink/10 bg-white/60 p-6"
      aria-label="Payment form"
    >
      <p className="text-sm text-ink-soft">Payment integration coming soon.</p>
    </div>
  )
}
