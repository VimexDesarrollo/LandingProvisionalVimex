import { useId } from 'react'
import { cn } from '@/lib/cn'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
  labelClassName?: string
}

export function Checkbox({ checked, onChange, label, className, labelClassName }: CheckboxProps) {
  const id = useId()

  return (
    <label htmlFor={id} className={cn('group flex w-full cursor-pointer items-center gap-2', className)}>
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked)
        }}
      />
      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-md border border-card-border/90 bg-white/92 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/45">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 scale-50 text-white opacity-0 transition-all duration-250 ease-out peer-checked:scale-100 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.8 10.3 8.4 14l6.8-8" />
        </svg>
      </span>
      <span className={cn('text-sm text-ink-soft transition-colors duration-300 group-hover:text-ink', labelClassName)}>{label}</span>
    </label>
  )
}
