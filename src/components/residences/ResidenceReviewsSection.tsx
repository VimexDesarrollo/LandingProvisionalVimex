'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiMessageSquare, FiX } from 'react-icons/fi'
import { gsap } from '@/animations/gsap'
import { Button } from '@/design-system/components/Button'
import { Typography } from '@/design-system/components/Typography'
import { useUI } from '@/hooks/useUI'
import type { ResidenceReview } from '@/types/content'

interface ResidenceReviewsSectionProps {
  title: string
  ctaLabel: string
  reviews: ResidenceReview[]
}

function reviewStars(value: number): string {
  const total = Math.max(1, Math.round(value))
  return '★'.repeat(total)
}

function ReviewCard({ review }: { review: ResidenceReview }) {
  return (
    <article className="rounded-xl border border-white/75 bg-white/72 p-4">
      <Typography className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">{review.stayDateLabel}</Typography>
      <Typography className="mt-2 text-sm text-[#FFD870]">{reviewStars(review.rating)}</Typography>
      <Typography className="mt-2 text-sm leading-relaxed text-ink-soft">{review.comment}</Typography>
      <Typography className="mt-3 text-sm font-semibold text-ink">{review.guestName}</Typography>
      <Typography className="text-xs text-ink-soft">{review.guestLocation}</Typography>
    </article>
  )
}

export function ResidenceReviewsSection({ title, ctaLabel, reviews }: ResidenceReviewsSectionProps) {
  const { prefersReducedMotion } = useUI()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const isClosingRef = useRef<boolean>(false)

  const topReviews = useMemo(() => reviews.slice(0, 3), [reviews])
  const moreReviews = useMemo(() => reviews.slice(3, 8), [reviews])
  const canOpenModal = moreReviews.length > 0

  const handleRequestClose = useCallback(() => {
    if (isClosingRef.current) {
      return
    }

    if (prefersReducedMotion) {
      setIsModalOpen(false)
      return
    }

    isClosingRef.current = true

    const overlay = overlayRef.current
    const dialog = dialogRef.current

    if (!overlay || !dialog) {
      setIsModalOpen(false)
      return
    }

    gsap
      .timeline({
        onComplete: () => {
          setIsModalOpen(false)
        },
      })
      .to(dialog, {
        y: 22,
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
    if (!isModalOpen) {
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

    const context = gsap.context(() => {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out', immediateRender: false })
      gsap.fromTo(
        dialog,
        { y: 20, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.24,
          ease: 'power2.out',
          immediateRender: false,
          clearProps: 'transform,opacity',
        },
      )
    }, overlay)

    return () => context.revert()
  }, [isModalOpen, prefersReducedMotion])

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleRequestClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [handleRequestClose, isModalOpen])

  return (
    <>
      <section className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-soft backdrop-blur-sm md:p-6" aria-label="Reviews">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography as="h3" variant="h3" className="text-2xl">
            {title}
          </Typography>
          {canOpenModal ? (
            <Button
              variant="hero"
              size="sm"
              className="liquid-click--nav px-5"
              aria-haspopup="dialog"
              onClick={() => setIsModalOpen(true)}
            >
              {ctaLabel}
            </Button>
          ) : null}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {topReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {isModalOpen ? (
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
            aria-label="More guest reviews"
            className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/72 text-ink shadow-[0_40px_120px_-50px_rgba(30,66,140,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-card-border/70 px-5 py-4">
              <div className="inline-flex items-center gap-2">
                <FiMessageSquare aria-hidden className="h-5 w-5 text-ink-soft" />
                <Typography as="h2" variant="h3" className="text-2xl">
                  More guest reviews
                </Typography>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-ink-soft transition-all duration-250 hover:-translate-y-0.5 hover:bg-white/80 hover:text-ink hover:shadow-soft active:translate-y-0"
                aria-label="Close reviews modal"
                onClick={handleRequestClose}
              >
                <FiX aria-hidden className="h-5 w-5" />
              </button>
            </header>
            <div className="overflow-y-auto p-4 md:p-6">
              <div className="grid gap-3 md:grid-cols-2">
                {moreReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
