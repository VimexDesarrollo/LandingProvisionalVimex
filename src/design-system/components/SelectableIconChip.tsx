import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/animations/gsap'
import { useUI } from '@/hooks/useUI'
import { cn } from '@/lib/cn'

interface SelectableIconChipProps {
  label: string
  selected: boolean
  icon: ReactNode
  onToggle: (nextSelected: boolean) => void
  className?: string
}

export function SelectableIconChip({ label, selected, icon, onToggle, className }: SelectableIconChipProps) {
  const chipRef = useRef<HTMLButtonElement | null>(null)
  const { prefersReducedMotion } = useUI()

  useEffect(() => {
    if (prefersReducedMotion || !chipRef.current) {
      return
    }

    gsap.fromTo(
      chipRef.current,
      { y: selected ? 5 : -2, scale: selected ? 0.96 : 1.02 },
      { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
    )
  }, [selected, prefersReducedMotion])

  return (
    <button
      ref={chipRef}
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(!selected)}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45',
        selected
          ? 'border-accent bg-accent text-white shadow-[0_10px_22px_-14px_rgba(30,78,173,0.8)]'
          : 'border-card-border bg-white/80 text-ink hover:border-accent/45 hover:bg-white',
        className,
      )}
    >
      <span aria-hidden className="text-base leading-none">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  )
}
