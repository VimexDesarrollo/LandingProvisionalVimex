import { FiX } from 'react-icons/fi'

interface CalendarModalHeaderProps {
  title: string
  onClose: () => void
}

export function CalendarModalHeader({ title, onClose }: CalendarModalHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold leading-none text-ink">{title}</h3>
      <button
        type="button"
        aria-label="Close calendar"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-white text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
        onClick={onClose}
      >
        <FiX aria-hidden className="h-4.5 w-4.5" />
      </button>
    </div>
  )
}
