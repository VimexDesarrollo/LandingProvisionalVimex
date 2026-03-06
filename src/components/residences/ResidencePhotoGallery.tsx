'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { gsap } from '@/animations/gsap'
import { Typography } from '@/design-system/components/Typography'
import { useUI } from '@/hooks/useUI'
import { cn } from '@/lib/cn'
import { CloseGalleryButton, GalleryNavButton, ShowAllPhotosButton, ThumbnailButton } from './GalleryButtons'

const FEATURED_IMAGE_COUNT = 5
const THUMBNAIL_SLOT_COUNT = 4

interface ResidencePhotoGalleryProps {
  residenceName: string
  imageUrl: string
  imageGallery?: string[]
}

interface GalleryImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

function resolveGalleryImages(primaryImage: string, gallery?: string[]): string[] {
  // Join main image + gallery, then remove empty values and duplicates.
  const entries = [primaryImage, ...(gallery ?? [])]
  const unique = new Set<string>()

  entries.forEach((entry) => {
    const normalized = entry.trim()
    if (normalized.length === 0) {
      return
    }

    unique.add(normalized)
  })

  return Array.from(unique)
}

function GalleryImage({ src, alt, className, loading = 'lazy' }: GalleryImageProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl', className)}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.015]"
      />
    </div>
  )
}

export function ResidencePhotoGallery({ residenceName, imageUrl, imageGallery }: ResidencePhotoGalleryProps) {
  const { prefersReducedMotion } = useUI()
  // Controls if the "Show all photos" modal is open.
  const [isAllPhotosOpen, setIsAllPhotosOpen] = useState<boolean>(false)
  // Current active image index in the modal carousel.
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  // Stores horizontal touch points for mobile swipe navigation.
  const touchStartXRef = useRef<number | null>(null)
  const touchEndXRef = useRef<number | null>(null)
  // Saves transition direction for image change animation.
  const transitionDirectionRef = useRef<1 | -1>(1)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const mainImageRef = useRef<HTMLImageElement | null>(null)
  // Prevents multiple close actions while close animation is running.
  const isClosingRef = useRef<boolean>(false)

  // Builds a clean image list for the full gallery.
  const images = useMemo(() => resolveGalleryImages(imageUrl, imageGallery), [imageGallery, imageUrl])
  // Builds preview layout: 1 main image + 4 thumbnails.
  const featuredImages = images.slice(0, FEATURED_IMAGE_COUNT)
  const mainImage = featuredImages[0] ?? imageUrl
  const thumbnailImages = Array.from(
    { length: THUMBNAIL_SLOT_COUNT },
    (_, index) => featuredImages[index + 1] ?? mainImage,
  )

  const handleRequestClose = useCallback(() => {
    if (isClosingRef.current) {
      return
    }

    // If user prefers less motion, close with no animation.
    if (prefersReducedMotion) {
      setIsAllPhotosOpen(false)
      return
    }

    const overlay = overlayRef.current
    const dialog = dialogRef.current

    if (!overlay || !dialog) {
      setIsAllPhotosOpen(false)
      return
    }

    isClosingRef.current = true

    // Close dialog and overlay at the same time.
    gsap
      .timeline({ onComplete: () => setIsAllPhotosOpen(false) })
      .to(dialog, {
        y: 20,
        opacity: 0,
        scale: 0.985,
        duration: 0.2,
        ease: 'power2.in',
      })
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        0,
      )
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!isAllPhotosOpen) {
      return
    }

    isClosingRef.current = false

    if (prefersReducedMotion) {
      return
    }

    const overlay = overlayRef.current
    const dialog = dialogRef.current

    if (!overlay || !dialog) {
      return
    }

    // Modal entry animation when it opens.
    const context = gsap.context(() => {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out', immediateRender: false })
      gsap.fromTo(
        dialog,
        { y: 22, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.26,
          ease: 'power2.out',
          immediateRender: false,
          clearProps: 'transform,opacity',
        },
      )
    }, overlay)

    return () => context.revert()
  }, [isAllPhotosOpen, prefersReducedMotion])

  useEffect(() => {
    if (!isAllPhotosOpen || prefersReducedMotion) {
      return
    }

    const imageElement = mainImageRef.current

    if (!imageElement) {
      return
    }

    // Animates each image change using the current direction.
    const xOffset = transitionDirectionRef.current * 22
    gsap.killTweensOf(imageElement)
    gsap.fromTo(
      imageElement,
      { autoAlpha: 0, x: xOffset, scale: 0.985 },
      {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
    )
  }, [isAllPhotosOpen, prefersReducedMotion, selectedImageIndex])

  useEffect(() => {
    if (!isAllPhotosOpen) {
      return
    }

    // Locks page scroll and enables keyboard controls.
    const previousOverflow = document.body.style.overflow
    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleRequestClose()
      } else if (!isClosingRef.current && event.key === 'ArrowLeft') {
        setSelectedImageIndex((current) => (current - 1 + images.length) % images.length)
      } else if (!isClosingRef.current && event.key === 'ArrowRight') {
        setSelectedImageIndex((current) => (current + 1) % images.length)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyboardNavigation)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyboardNavigation)
    }
  }, [handleRequestClose, images.length, isAllPhotosOpen])

  const showPreviousImage = () => {
    transitionDirectionRef.current = -1
    setSelectedImageIndex((current) => (current - 1 + images.length) % images.length)
  }

  const showNextImage = () => {
    transitionDirectionRef.current = 1
    setSelectedImageIndex((current) => (current + 1) % images.length)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null
    touchEndXRef.current = null
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = event.changedTouches[0]?.clientX ?? null
  }

  const handleTouchEnd = () => {
    const startX = touchStartXRef.current
    const endX = touchEndXRef.current

    touchStartXRef.current = null
    touchEndXRef.current = null

    if (startX === null || endX === null) {
      return
    }

    // Minimum swipe distance to ignore accidental touches.
    const delta = startX - endX
    if (Math.abs(delta) < 40) {
      return
    }

    if (delta > 0) {
      showNextImage()
      return
    }

    showPreviousImage()
  }

  return (
    <>
      <section className="space-y-3" aria-label={`Photo gallery for ${residenceName}`}>
        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-mist-gradient p-2 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,255,255,0.78),transparent_42%),radial-gradient(circle_at_84%_22%,rgba(183,203,244,0.28),transparent_40%)]" />
          <div className="relative grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2">
            <GalleryImage
              src={mainImage}
              alt={`Main photo of ${residenceName}`}
              loading="eager"
              className="col-span-2 aspect-square md:row-span-2"
            />
            {thumbnailImages.map((image, index) => (
              <GalleryImage
                key={`${image}-${index}`}
                src={image}
                alt={`Photo ${index + 2} of ${residenceName}`}
                className="aspect-square"
              />
            ))}
          </div>
          <ShowAllPhotosButton
            onClick={() => {
              setSelectedImageIndex(0)
              setIsAllPhotosOpen(true)
            }}
          />
        </div>
      </section>

      {isAllPhotosOpen ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[140] bg-[#edf3ff]/70 px-4 py-6 backdrop-blur-md"
          role="presentation"
          onClick={handleRequestClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo gallery of ${residenceName}`}
            className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/72 text-ink shadow-[0_40px_120px_-50px_rgba(30,66,140,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-card-border/70 px-5 py-4">
              <Typography as="h2" variant="h3">
                Photo gallery
              </Typography>
              <CloseGalleryButton onClick={handleRequestClose} />
            </header>
            <div className="overflow-y-auto p-4 md:p-6">
              <div className="space-y-4">
                <div
                  className="relative overflow-hidden rounded-2xl border border-card-border/70 bg-white/65"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="aspect-[16/9] w-full">
                    <img
                      ref={mainImageRef}
                      src={images[selectedImageIndex] ?? mainImage}
                      alt={`Photo ${selectedImageIndex + 1} of ${residenceName}`}
                      className="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <GalleryNavButton direction="prev" onClick={showPreviousImage} />
                  <GalleryNavButton direction="next" onClick={showNextImage} />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Photo thumbnails">
                  {images.map((image, index) => (
                    <ThumbnailButton
                      key={`${image}-${index}`}
                      image={image}
                      index={index}
                      isSelected={index === selectedImageIndex}
                      onClick={() => {
                        transitionDirectionRef.current = index >= selectedImageIndex ? 1 : -1
                        setSelectedImageIndex(index)
                      }}
                    />
                  ))}
                </div>

                <Typography className="text-sm text-ink-soft">
                  {`Photo ${selectedImageIndex + 1} of ${images.length}`}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
