// ---------------------------------------------------------------------------
// BookingSummaryCard.tsx — Tarjeta de resumen de propiedad y fechas
//
// Muestra imagen, nombre, ubicación y datos del stay.
// Separado de PriceBreakdown para seguir el principio de responsabilidad única.
// ---------------------------------------------------------------------------

import Image from 'next/image'
import { formatDate, countNights } from '../utils'
import type { ResidenceDetail } from '@/types/content'

interface BookingSummaryCardProps {
  residence: ResidenceDetail
  checkIn: string
  checkOut: string
  guests: number
}

export function BookingSummaryCard({
  residence,
  checkIn,
  checkOut,
  guests,
}: BookingSummaryCardProps) {
  const nights = countNights(checkIn, checkOut)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/62 shadow-soft">
      {/* Property image */}
      {residence.imageUrl ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={residence.imageUrl}
            alt={residence.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}

      <div className="p-4 space-y-4">
        {/* Property header */}
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">
            {residence.name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-soft">{residence.location}</p>
        </div>

        {/* Stay details */}
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/70 px-3 py-2.5 border border-white/80">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              Check-in
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{formatDate(checkIn)}</dd>
          </div>

          <div className="rounded-xl bg-white/70 px-3 py-2.5 border border-white/80">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              Check-out
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{formatDate(checkOut)}</dd>
          </div>

          <div className="rounded-xl bg-white/70 px-3 py-2.5 border border-white/80">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              Nights
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{nights}</dd>
          </div>

          <div className="rounded-xl bg-white/70 px-3 py-2.5 border border-white/80">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              Guests
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{guests}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
