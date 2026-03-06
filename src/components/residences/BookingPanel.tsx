'use client'

import { useMemo } from 'react'
import { Button } from '@/design-system/components/Button'
import { DateRangePicker } from '@/design-system/components/DateRangePicker'
import { GuestDetailsPicker } from '@/design-system/components/GuestDetailsPicker'
import { getGuestTotal, normalizeGuestDetails } from '@/lib/guestDetails'
import type { ResidencePricing } from '@/types/content'
import type { GuestDetails } from '@/types/guests'
import type { SearchDateRangeValue } from '@/types/search'

const CLEANING_FEE = 75
const SERVICE_FEE_RATE = 0.12

interface BookingPanelProps {
  nightlyRateUsd: number
  promotionalNightlyRateUsd?: number
  maxGuests: number
  minNights?: number
  selectedRange: { from?: string; to?: string }
  selectedGuestDetails: GuestDetails
  onGuestDetailsChange: (guestDetails: GuestDetails) => void
  onDateRangeChange?: (nextRange: SearchDateRangeValue) => void
  pricing?: ResidencePricing | null
  isPricingLoading?: boolean
}

function countNights(from: string | undefined, to: string | undefined): number {
  if (!from || !to) return 0
  const start = new Date(from)
  const end = new Date(to)
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000))
}

function sanitizePromotionalNightlyRate(baseNightlyRateUsd: number, promotionalNightlyRateUsd: number | undefined): number | undefined {
  if (!promotionalNightlyRateUsd || !Number.isFinite(promotionalNightlyRateUsd)) {
    return undefined
  }

  if (promotionalNightlyRateUsd <= 0 || promotionalNightlyRateUsd >= baseNightlyRateUsd) {
    return undefined
  }

  return Math.round(promotionalNightlyRateUsd)
}

function clampGuestDetailsToMaxGuests(guestDetails: GuestDetails, maxGuests: number): GuestDetails {
  const normalized = normalizeGuestDetails(guestDetails)
  let adults = normalized.adults
  let children = normalized.children
  let infants = normalized.infants
  let overflow = adults + children + infants - maxGuests

  if (overflow <= 0) {
    return normalized
  }

  const removableInfants = Math.min(infants, overflow)
  infants -= removableInfants
  overflow -= removableInfants

  const removableChildren = Math.min(children, overflow)
  children -= removableChildren
  overflow -= removableChildren

  if (overflow > 0) {
    adults = Math.max(1, adults - overflow)
  }

  return {
    adults,
    children,
    infants,
    pets: normalized.pets,
  }
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString()}`
}

export function BookingPanel({
  nightlyRateUsd,
  promotionalNightlyRateUsd,
  maxGuests,
  minNights,
  selectedRange,
  selectedGuestDetails,
  onGuestDetailsChange,
  onDateRangeChange,
  pricing,
  isPricingLoading,
}: BookingPanelProps) {
  const minNightsRequired = Math.max(1, minNights ?? 1)
  const effectiveNightlyRateUsd = sanitizePromotionalNightlyRate(nightlyRateUsd, promotionalNightlyRateUsd) ?? nightlyRateUsd
  const hasPromotion = effectiveNightlyRateUsd !== nightlyRateUsd
  const nights = useMemo(() => countNights(selectedRange.from, selectedRange.to), [selectedRange])
  const hasRange = nights > 0
  const meetsMinNights = nights >= minNightsRequired
  const canBook = hasRange && meetsMinNights
  const pricingSubtotal = pricing?.subtotal ?? null
  const subtotal = pricingSubtotal ?? effectiveNightlyRateUsd * nights
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE)
  const total = subtotal + CLEANING_FEE + serviceFee
  const totalGuests = getGuestTotal(selectedGuestDetails)
  const savingsTotal = (nightlyRateUsd - effectiveNightlyRateUsd) * nights

  return (
    <div className="relative rounded-2xl border border-white/70 bg-mist-gradient p-5 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46 md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(255,255,255,0.84),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(175,198,242,0.3),transparent_42%)]" />
      <div className="relative space-y-4">

        <div>
          <div className="flex items-end gap-2.5">
            <span className="font-display text-[2.35rem] font-semibold leading-none text-ink">
              {formatUsd(effectiveNightlyRateUsd)}
            </span>
            <span className="pb-0.5 text-sm text-ink-soft">/ night</span>
            {hasPromotion ? (
              <span className="pb-0.5 text-sm font-medium text-ink-soft/80 line-through decoration-1">{formatUsd(nightlyRateUsd)}</span>
            ) : null}
          </div>
          {hasPromotion ? (
            <p className="mt-1 inline-flex rounded-pill border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
              Promotional price
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <GuestDetailsPicker
            label="Guests"
            placeholder="Guests"
            value={selectedGuestDetails}
            onChange={(nextGuestDetails) => onGuestDetailsChange(clampGuestDetailsToMaxGuests(nextGuestDetails, maxGuests))}
            triggerClassName="h-11 text-base"
          />
          <p className="px-1 text-xs text-ink-soft">{totalGuests} selected of {maxGuests} max guests</p>
        </div>

        {onDateRangeChange ? (
          <div className="space-y-1.5">
            <DateRangePicker
              label="Dates"
              value={selectedRange}
              onChange={onDateRangeChange}
            />
          </div>
        ) : null}

        {hasRange && (
          <div className="space-y-2 rounded-xl border border-card-border/70 bg-white/50 p-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Guests</span>
              <span>{totalGuests}</span>
            </div>
            {isPricingLoading ? (
              <div className="flex justify-between text-ink-soft">
                <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                <span className="animate-pulse text-ink-soft/50">Calculating…</span>
              </div>
            ) : pricingSubtotal !== null ? (
              <div className="flex justify-between text-ink-soft">
                <span>{nights} {nights === 1 ? 'night' : 'nights'} · prices vary by date</span>
                <span>{formatUsd(pricingSubtotal)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-ink-soft">
                  <span>
                    {formatUsd(effectiveNightlyRateUsd)} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span>{formatUsd(subtotal)}</span>
                </div>
                {hasPromotion ? (
                  <div className="flex justify-between text-ink-soft">
                    <span>Savings</span>
                    <span>-{formatUsd(savingsTotal)}</span>
                  </div>
                ) : null}
              </>
            )}
            <div className="flex justify-between text-ink-soft">
              <span>Cleaning fee</span>
              <span>{formatUsd(CLEANING_FEE)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Service fee</span>
              <span>{formatUsd(serviceFee)}</span>
            </div>
            <div className="flex justify-between border-t border-card-border/70 pt-3 font-semibold text-ink">
              <span>Total</span>
              <span>{isPricingLoading ? '—' : formatUsd(total)}</span>
            </div>
          </div>
        )}

        {hasRange && !meetsMinNights ? (
          <p className="rounded-lg border border-amber-300/55 bg-amber-100/45 px-3 py-2 text-xs font-medium text-amber-900">
            Minimum stay for this residence is {minNightsRequired} {minNightsRequired === 1 ? 'night' : 'nights'}.
          </p>
        ) : null}

        <Button type="button" className="w-full" variant="primary" size="md" disabled={!canBook}>
          {canBook ? 'Book Now' : 'Select dates to book'}
        </Button>

        {!canBook && (
          <p className="text-center text-xs text-ink-soft">You won't be charged yet</p>
        )}

      </div>
    </div>
  )
}
