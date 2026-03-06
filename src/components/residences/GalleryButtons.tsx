import { FiChevronLeft, FiChevronRight, FiGrid, FiX } from 'react-icons/fi'
import { cn } from '@/lib/cn'

interface ShowAllPhotosButtonProps {
  onClick: () => void
}

export function ShowAllPhotosButton({ onClick }: ShowAllPhotosButtonProps) {
  return (
    <button
      type="button"
      className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-pill border border-white/70 bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_38px_-20px_rgba(20,56,128,0.45)] active:translate-y-0"
      onClick={onClick}
    >
      <FiGrid aria-hidden className="h-4 w-4" />
      Show all photos
    </button>
  )
}

interface CloseGalleryButtonProps {
  onClick: () => void
}

export function CloseGalleryButton({ onClick }: CloseGalleryButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-ink-soft transition-all duration-250 hover:-translate-y-0.5 hover:bg-white/80 hover:text-ink hover:shadow-soft active:translate-y-0"
      aria-label="Close photo gallery"
      onClick={onClick}
    >
      <FiX aria-hidden className="h-5 w-5" />
    </button>
  )
}

interface GalleryNavButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
}

export function GalleryNavButton({ direction, onClick }: GalleryNavButtonProps) {
  const isPrev = direction === 'prev'

  return (
    <button
      type="button"
      aria-label={isPrev ? 'Previous photo' : 'Next photo'}
      className={cn(
        'absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-white/90 text-ink shadow-soft transition-all duration-250 hover:scale-105 hover:bg-white hover:shadow-[0_14px_30px_-16px_rgba(19,53,119,0.45)] active:scale-100 md:inline-flex',
        isPrev ? 'left-4' : 'right-4',
      )}
      onClick={onClick}
    >
      {isPrev ? (
        <FiChevronLeft aria-hidden className="h-5 w-5" />
      ) : (
        <FiChevronRight aria-hidden className="h-5 w-5" />
      )}
    </button>
  )
}

interface ThumbnailButtonProps {
  image: string
  index: number
  isSelected: boolean
  onClick: () => void
}

export function ThumbnailButton({ image, index, isSelected, onClick }: ThumbnailButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'h-20 w-32 shrink-0 overflow-hidden rounded-xl border transition-all duration-250 hover:scale-[1.02]',
        isSelected
          ? 'border-accent/70 ring-2 ring-accent/30'
          : 'border-card-border/70 hover:border-accent/45',
      )}
      aria-label={`Open photo ${index + 1}`}
      aria-pressed={isSelected}
      onClick={onClick}
    >
      <img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" decoding="async" />
    </button>
  )
}
