import { FiMapPin } from 'react-icons/fi'
import { cn } from '@/lib/cn'

interface ResidencesLocationQuickFilterProps {
  options: string[]
  selectedLocation: string
  onSelectLocation: (value: string) => void
}

export function ResidencesLocationQuickFilter({
  options,
  selectedLocation,
  onSelectLocation,
}: ResidencesLocationQuickFilterProps) {
  if (options.length === 0) {
    return null
  }

  const quickOptions = ['All', ...options]

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Quick location filter">
      <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
        <FiMapPin aria-hidden className="h-3.5 w-3.5" />
        Location
      </span>
      {quickOptions.map((option) => {
        const isActive = option === selectedLocation

        return (
          <button
            key={option}
            type="button"
            className={cn(
              'rounded-pill border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors',
              isActive
                ? 'border-accent bg-accent text-white'
                : 'border-white/65 bg-white/55 text-ink-soft hover:bg-white/80 hover:text-ink',
            )}
            onClick={() => onSelectLocation(option === 'All' ? '' : option)}
            aria-pressed={isActive}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
