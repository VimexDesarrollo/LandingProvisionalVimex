// ---------------------------------------------------------------------------
// PriceBreakdown.tsx — Desglose de precios de la reserva
//
// Componente puramente presentacional. Recibe los valores del quote
// y los renderiza. No hace cálculos propios.
// ---------------------------------------------------------------------------

import { formatUsd } from '../utils'
import type { BookingQuote } from '@/types/booking'

interface PriceBreakdownProps {
  quote: BookingQuote
  className?: string
}

interface LineItemProps {
  label: string
  value: string
  isTotal?: boolean
}

function LineItem({ label, value, isTotal = false }: LineItemProps) {
  return (
    <div
      className={`flex items-center justify-between ${
        isTotal
          ? 'border-t border-ink/10 pt-3 mt-1 font-semibold text-ink'
          : 'text-sm text-ink-soft'
      }`}
    >
      <span>{label}</span>
      <span className={isTotal ? 'text-base' : ''}>{value}</span>
    </div>
  )
}

export function PriceBreakdown({ quote, className = '' }: PriceBreakdownProps) {
  const nightLabel =
    quote.quotedNights === 1
      ? `${formatUsd(quote.quotedSubtotal / quote.quotedNights)} × 1 night`
      : `${formatUsd(quote.quotedSubtotal / quote.quotedNights)} × ${quote.quotedNights} nights`

  return (
    <div className={`space-y-2 ${className}`} aria-label="Price breakdown">
      <LineItem label={nightLabel}              value={formatUsd(quote.quotedSubtotal)}    />
      <LineItem label="Cleaning fee"            value={formatUsd(quote.quotedCleaningFee)} />
      <LineItem label="Service fee"             value={formatUsd(quote.quotedServiceFee)}  />
      <LineItem label="Total" isTotal           value={formatUsd(quote.quotedTotal)}       />
    </div>
  )
}
