'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { animateSlideFromLeft, animateWordColorScroll } from '@/animations/homeAnimations'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useUI } from '@/hooks/useUI'
import { useLocale } from '@/i18n/LocaleContext'

export function FeelAtHomeSection() {
  const sectionRef = useSectionReveal<HTMLElement>()
  const imgWrapperRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const { prefersReducedMotion } = useUI()
  const { t } = useLocale()

  useEffect(() => {
    if (!imgWrapperRef.current) return
    return animateSlideFromLeft(imgWrapperRef.current, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!bodyRef.current) return
    return animateWordColorScroll(bodyRef.current, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion, t.feelAtHome.body])

  return (
    <Section id="feel-at-home" ref={sectionRef} aria-labelledby="feel-at-home-heading" className="overflow-hidden bg-white">
      <div className="grid items-center md:grid-cols-2">

        {/* Text side — padded to match Container */}
        <div className="space-y-5 px-6 py-20 md:py-28 md:pl-[max(2rem,calc((100vw-1200px)/2+2rem))] md:pr-12">
          <Typography as="h2" variant="h2" id="feel-at-home-heading" data-section-heading>
            {t.feelAtHome.heading}
          </Typography>
          <Typography as="p" className="text-lg font-medium text-accent" data-section-body>
            {t.feelAtHome.subheading}
          </Typography>
          <p ref={bodyRef} className="text-base font-semibold leading-relaxed text-ink md:text-lg" data-section-body>
            {t.feelAtHome.body}
          </p>
        </div>

        {/* Image side — full bleed to right edge, rounded left only */}
        <div
          ref={imgWrapperRef}
          className="relative min-h-[360px] overflow-hidden rounded-l-3xl md:min-h-[560px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury vacation villa with pool in the Caribbean"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

      </div>
    </Section>
  )
}
