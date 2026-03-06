import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { gsap } from '@/animations/gsap'
import { useUI } from '@/hooks/useUI'
import { cn } from '@/lib/cn'

interface SelectOption {
  label: string
  value: string
}

interface GlassSelectProps {
  name?: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  label: string
  leftIcon?: ReactNode
  className?: string
  triggerClassName?: string
}

export function GlassSelect({
  name,
  value,
  options,
  onChange,
  placeholder = 'All',
  label,
  leftIcon,
  className,
  triggerClassName,
}: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const listboxRef = useRef<HTMLUListElement | null>(null)
  const listboxId = useId()
  const { prefersReducedMotion } = useUI()

  const selectedLabel = options.find((option) => option.value === value)?.label ?? placeholder

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || prefersReducedMotion || !listboxRef.current) {
      return
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        listboxRef.current,
        { opacity: 0, y: -8, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
          immediateRender: false,
          clearProps: 'transform,opacity',
        },
      )
    }, wrapperRef)

    return () => context.revert()
  }, [isOpen, prefersReducedMotion])

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        type="button"
        className={cn(
          'booking-field booking-field--control relative flex h-11 items-center justify-between px-3 text-base',
          leftIcon ? 'pl-10' : '',
          triggerClassName,
        )}
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="pointer-events-none ml-2 text-ink-soft">▾</span>
        {leftIcon ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</span> : null}
      </button>

      {isOpen ? (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.45rem)] z-50 max-h-64 w-full origin-top overflow-auto rounded-xl border border-white/95 bg-white p-1 shadow-soft"
        >
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200',
                    isSelected ? 'bg-surface-muted text-ink' : 'text-ink-soft hover:bg-surface-muted/70 hover:text-ink',
                  )}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
