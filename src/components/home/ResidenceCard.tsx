import { useEffect, useMemo, useRef, useState } from 'react'
import { FaBed, FaHeart } from 'react-icons/fa6'
import { FiChevronLeft, FiChevronRight, FiHeart, FiHome } from 'react-icons/fi'
import { buildWhatsAppUrl } from '@/config/whatsapp'
import { gsap } from '@/animations/gsap'
import { Badge } from '@/design-system/components/Badge'
import { ButtonLink } from '@/design-system/components/ButtonLink'
import { Card } from '@/design-system/components/Card'
import { Typography } from '@/design-system/components/Typography'
import { useUI } from '@/hooks/useUI'
import { writeGuestDetailsToSearchParams } from '@/lib/guestDetails'
import type { Residence, ResidenceListing } from '@/types/content'
import type { GuestDetails } from '@/types/guests'

interface ResidenceCardProps {
  residence: Residence | ResidenceListing
  checkin?: string
  checkout?: string
  guestDetails?: GuestDetails
}

const FAVORITES_STORAGE_KEY = 'vimex:favorites'

function readFavoriteIds(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set<string>()
  }

  try {
    const value = window.localStorage.getItem(FAVORITES_STORAGE_KEY)

    if (!value) {
      return new Set<string>()
    }

    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed)) {
      return new Set<string>()
    }

    return new Set(parsed.filter((entry): entry is string => typeof entry === 'string'))
  } catch {
    return new Set<string>()
  }
}

function persistFavoriteIds(ids: Set<string>) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(ids)))
}

function formatNightlyRate(nightlyRateUsd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(nightlyRateUsd)
}

export function ResidenceCard({ residence, checkin, checkout, guestDetails }: ResidenceCardProps) {
  const { prefersReducedMotion } = useUI()
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [previousImage, setPreviousImage] = useState<string | null>(null)
  const [isPreviousImageVisible, setIsPreviousImageVisible] = useState<boolean>(false)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const imageTransitionTimeoutRef = useRef<number | null>(null)
  const favoriteIconRef = useRef<HTMLSpanElement | null>(null)
  const hasRenderedFavoriteRef = useRef<boolean>(false)
  const hasPromo =
    typeof residence.promotionalNightlyRateUsd === 'number' &&
    residence.promotionalNightlyRateUsd > 0 &&
    residence.promotionalNightlyRateUsd < residence.nightlyRateUsd
  const effectiveRate = hasPromo ? residence.promotionalNightlyRateUsd! : residence.nightlyRateUsd
  const formattedDisplayRate = formatNightlyRate(effectiveRate)
  const formattedOriginalRate = hasPromo ? formatNightlyRate(residence.nightlyRateUsd) : null
  const hasBedsData = 'beds' in residence && typeof residence.beds === 'number'
  const roomsCount = hasBedsData ? Math.max(1, Math.ceil(residence.beds / 2)) : undefined

  const detailHref = useMemo(() => {
    const params = new URLSearchParams()
    if (checkin) params.set('checkin', checkin)
    if (checkout) params.set('checkout', checkout)
    if (guestDetails) writeGuestDetailsToSearchParams(params, guestDetails)
    const qs = params.toString()
    return `/residences/${residence.slug}${qs ? `?${qs}` : ''}`
  }, [residence.slug, checkin, checkout, guestDetails])

  const galleryImages = useMemo(() => {
    if ('imageGallery' in residence && Array.isArray(residence.imageGallery) && residence.imageGallery.length > 0) {
      return residence.imageGallery
    }

    return [residence.imageUrl]
  }, [residence])

  const hasMultipleImages = galleryImages.length > 1
  const currentImage = galleryImages[activeImageIndex] ?? residence.imageUrl

  const transitionToImage = (nextImageIndex: number) => {
    if (nextImageIndex === activeImageIndex) {
      return
    }

    if (prefersReducedMotion) {
      setActiveImageIndex(nextImageIndex)
      return
    }

    const activeImage = galleryImages[activeImageIndex] ?? residence.imageUrl
    setPreviousImage(activeImage)
    setIsPreviousImageVisible(true)
    setActiveImageIndex(nextImageIndex)

    requestAnimationFrame(() => {
      setIsPreviousImageVisible(false)
    })

    if (imageTransitionTimeoutRef.current) {
      window.clearTimeout(imageTransitionTimeoutRef.current)
    }

    imageTransitionTimeoutRef.current = window.setTimeout(() => {
      setPreviousImage(null)
      imageTransitionTimeoutRef.current = null
    }, 280)
  }

  const showPreviousImage = () => {
    const nextIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length
    transitionToImage(nextIndex)
  }

  const showNextImage = () => {
    const nextIndex = (activeImageIndex + 1) % galleryImages.length
    transitionToImage(nextIndex)
  }

  useEffect(() => {
    const favoriteIds = readFavoriteIds()
    setIsFavorite(favoriteIds.has(residence.id))
  }, [residence.id])

  useEffect(() => {
    if (!hasRenderedFavoriteRef.current) {
      hasRenderedFavoriteRef.current = true
      return
    }

    if (prefersReducedMotion || !favoriteIconRef.current) {
      return
    }

    gsap.fromTo(
      favoriteIconRef.current,
      { scale: isFavorite ? 0.7 : 1.12, rotation: isFavorite ? -14 : 14 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.24,
        ease: 'power2.out',
      },
    )
  }, [isFavorite, prefersReducedMotion])

  useEffect(() => {
    return () => {
      if (imageTransitionTimeoutRef.current) {
        window.clearTimeout(imageTransitionTimeoutRef.current)
      }
    }
  }, [])

  const toggleFavorite = () => {
    setIsFavorite((current) => {
      const next = !current
      const favoriteIds = readFavoriteIds()

      if (next) {
        favoriteIds.add(residence.id)
      } else {
        favoriteIds.delete(residence.id)
      }

      persistFavoriteIds(favoriteIds)
      return next
    })
  }

  return (
    <Card className="group relative overflow-hidden border-none bg-transparent p-0 text-white" data-residence-card>
      <div className="relative h-[420px] w-full overflow-hidden">
        <img
          src={currentImage}
          alt={`Oceanfront view of ${residence.name}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        {previousImage ? (
          <img
            src={previousImage}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isPreviousImageVisible ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : null}
      </div>
      {hasMultipleImages ? (
        <>
          <button
            type="button"
            aria-label={`Previous image for ${residence.name}`}
            className="absolute left-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/28 text-white transition-colors hover:bg-black/45"
            onClick={showPreviousImage}
          >
            <FiChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={`Next image for ${residence.name}`}
            className="absolute right-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/28 text-white transition-colors hover:bg-black/45"
            onClick={showNextImage}
          >
            <FiChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/28 to-black/16" />
      <div className="absolute left-4 top-4 z-20">
        <button
          type="button"
          aria-label={isFavorite ? `Remove ${residence.name} from favorites` : `Add ${residence.name} to favorites`}
          aria-pressed={isFavorite}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-250 ${
            isFavorite
              ? 'border-[#ff9aaf]/80 bg-[#ff355e]/26 text-[#ffccd8]'
              : 'border-white/45 bg-black/28 text-white hover:bg-black/45'
          }`}
          onClick={toggleFavorite}
        >
          <span ref={favoriteIconRef} className="inline-flex">
            {isFavorite ? <FaHeart aria-hidden className="h-4.5 w-4.5" /> : <FiHeart aria-hidden className="h-4.5 w-4.5" />}
          </span>
        </button>
      </div>
      <div className="absolute left-0 right-0 top-16 z-10 px-6 md:top-20 md:pr-24">
        <Typography as="h3" variant="h3" className="text-3xl leading-tight text-white md:text-4xl">
          {residence.name}
        </Typography>
        <Typography className="truncate text-sm text-white/90 md:text-base">{residence.location}</Typography>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 space-y-3 p-6">
        <Badge className={hasPromo ? 'flex-col items-start gap-0.5 py-2' : ''}>
          {formattedOriginalRate ? (
            <span className="text-[11px] font-medium leading-none line-through opacity-60">{formattedOriginalRate} / night</span>
          ) : null}
          <span className={hasPromo ? 'text-[15px] font-bold leading-none' : ''}>
            {formattedDisplayRate} / night
            {formattedOriginalRate ? (
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#FFD870]">promo</span>
            ) : null}
          </span>
        </Badge>
        <div className="flex items-center gap-2">
          <Typography className="shrink-0 text-sm text-[#FFD870]">{`★`.repeat(Math.round(residence.rating))}</Typography>
          {hasBedsData ? (
            <>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-pill border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/90">
                <FaBed aria-hidden className="h-3.5 w-3.5" />
                {residence.beds} Beds
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-pill border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/90">
                <FiHome aria-hidden className="h-3.5 w-3.5" />
                {roomsCount} Rooms
              </span>
            </>
          ) : null}
        </div>
        {hasMultipleImages ? (
          <div className="flex items-center justify-center gap-1.5" aria-label="Image carousel pagination">
            {galleryImages.map((image, index) => (
              <button
                key={`${residence.id}-${image}`}
                type="button"
                className={`h-1.5 rounded-full transition-all ${index === activeImageIndex ? 'w-5 bg-white' : 'w-2 bg-white/55 hover:bg-white/75'}`}
                aria-label={`Show image ${index + 1} for ${residence.name}`}
                aria-pressed={index === activeImageIndex}
                onClick={() => transitionToImage(index)}
              />
            ))}
          </div>
        ) : null}
        <ButtonLink
          aria-label={`View details for ${residence.name}`}
          className="nav-liquid liquid-click liquid-click--nav h-11 w-full border border-white/40 bg-white/18 px-4 text-sm text-white shadow-[0_16px_32px_-18px_rgba(5,22,51,0.75)] hover:bg-white/26"
          href={detailHref}
          variant="ghost"
        >
          View Residence
        </ButtonLink>
        {buildWhatsAppUrl(`Hi! I'm interested in ${residence.name}`) ? (
          <a
            href={buildWhatsAppUrl(`Hi! I'm interested in ${residence.name}`)!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contact us on WhatsApp about ${residence.name}`}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        ) : null}
      </div>
    </Card>
  )
}
