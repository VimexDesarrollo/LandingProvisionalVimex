import Image from 'next/image'
import { Typography } from '@/design-system/components/Typography'
import type { BookingQuote } from '@/types/booking'
import type { ResidenceDetail } from '@/types/content'

interface BookingCheckoutSummaryProps {
  residence: ResidenceDetail
  quote: BookingQuote | null
  guests: number
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString()}`
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`))
}

function getRoomValue(residence: ResidenceDetail, label: 'Bedrooms' | 'Bathrooms'): string | null {
  const matchedItem = residence.roomDetailsSection.items.find((item) => item.label === label)
  return matchedItem?.value ?? null
}

export function BookingCheckoutSummary({ residence, quote, guests }: BookingCheckoutSummaryProps) {
  return (
    <section className="space-y-4" aria-label="Booking checkout summary">
      <article className="rounded-2xl border border-white/70 bg-mist-gradient p-5 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46">
        <Typography as="h2" variant="h3" className="text-[1.7rem]">
          Complete your booking request
        </Typography>
        <Typography className="mt-2 text-base text-ink-soft">
          Review the stay, confirm your details and send a request for this residence.
        </Typography>
      </article>

      <article className="overflow-hidden rounded-2xl border border-white/70 bg-white/78 shadow-soft backdrop-blur-sm">
        <div className="relative aspect-[16/10] bg-slate-100">
          <Image
            src={residence.imageUrl}
            alt={residence.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
        <div className="space-y-3 p-5">
          <div>
            <Typography as="h3" className="font-display text-2xl font-semibold text-ink">
              {residence.name}
            </Typography>
            <Typography className="mt-1 text-sm text-ink-soft">{residence.location}</Typography>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm text-ink-soft md:grid-cols-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">Guests</dt>
              <dd className="mt-1 text-base text-ink">{residence.guests}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">Beds</dt>
              <dd className="mt-1 text-base text-ink">{residence.beds}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">Bedrooms</dt>
              <dd className="mt-1 text-base text-ink">{getRoomValue(residence, 'Bedrooms') ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">Bathrooms</dt>
              <dd className="mt-1 text-base text-ink">{getRoomValue(residence, 'Bathrooms') ?? '—'}</dd>
            </div>
          </dl>
        </div>
      </article>

      <article className="rounded-2xl border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-sm">
        <Typography as="h3" className="font-display text-xl font-semibold text-ink">
          Stay summary
        </Typography>
        {quote ? (
          <dl className="mt-4 space-y-3 text-sm text-ink-soft">
            <div className="flex justify-between gap-3">
              <dt>Check-in</dt>
              <dd className="font-medium text-ink">{formatDate(quote.checkIn)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Check-out</dt>
              <dd className="font-medium text-ink">{formatDate(quote.checkOut)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Nights</dt>
              <dd className="font-medium text-ink">{quote.quotedNights}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Guests</dt>
              <dd className="font-medium text-ink">{guests}</dd>
            </div>
          </dl>
        ) : (
          <Typography className="mt-4 text-sm text-ink-soft">Waiting for a valid quote.</Typography>
        )}
      </article>

      <article className="rounded-2xl border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-sm">
        <Typography as="h3" className="font-display text-xl font-semibold text-ink">
          Price summary
        </Typography>
        {quote ? (
          <dl className="mt-4 space-y-3 text-sm text-ink-soft">
            <div className="flex justify-between gap-3">
              <dt>Nightly subtotal</dt>
              <dd className="font-medium text-ink">{formatUsd(quote.quotedSubtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Cleaning fee</dt>
              <dd className="font-medium text-ink">{formatUsd(quote.quotedCleaningFee)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Service fee</dt>
              <dd className="font-medium text-ink">{formatUsd(quote.quotedServiceFee)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-card-border/70 pt-3 text-base">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-semibold text-ink">{formatUsd(quote.quotedTotal)}</dd>
            </div>
          </dl>
        ) : (
          <Typography className="mt-4 text-sm text-ink-soft">Revalidating current price.</Typography>
        )}
      </article>
    </section>
  )
}
