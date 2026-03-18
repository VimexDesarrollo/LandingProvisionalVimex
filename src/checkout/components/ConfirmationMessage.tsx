// ---------------------------------------------------------------------------
// ConfirmationMessage.tsx — Mensaje de éxito al finalizar la reserva
// ---------------------------------------------------------------------------

import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'
import { buttonVariants } from '@/design-system/components/button.variants'
import { cn } from '@/lib/cn'

interface ConfirmationMessageProps {
  bookingRequestId: string
  residenceSlug: string
}

export function ConfirmationMessage({ bookingRequestId, residenceSlug }: ConfirmationMessageProps) {
  return (
    <div className="text-center" role="status" aria-live="polite">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <FiCheckCircle className="h-10 w-10 text-green-600" aria-hidden />
      </div>

      <h2 className="font-display text-2xl font-semibold text-ink">
        Booking request sent!
      </h2>

      <p className="mt-3 text-sm text-ink-soft">
        We received your request and will contact you shortly to confirm the details.
      </p>

      <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-ink border border-white/80">
        Reference:{' '}
        <span className="font-mono font-semibold text-accent" aria-label={`Booking reference ${bookingRequestId}`}>
          {bookingRequestId}
        </span>
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/residences" className={cn(buttonVariants({ variant: 'ghost' }), 'text-ink bg-white/60 ring-1 ring-ink/10 hover:bg-white/80')}>
          Explore more properties
        </Link>
        <Link href={`/residences/${residenceSlug}`} className={buttonVariants({ variant: 'brand' })}>
          Back to property
        </Link>
      </div>
    </div>
  )
}
