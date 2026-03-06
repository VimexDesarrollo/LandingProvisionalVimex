import { useEffect, useRef } from 'react'
import { FiCompass, FiKey } from 'react-icons/fi'
import { ButtonLink } from '@/design-system/components/ButtonLink'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { animateHeroReveal } from '@/animations/homeAnimations'
import { useUI } from '@/hooks/useUI'
import type { HeroContent } from '@/types/content'

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  const { prefersReducedMotion } = useUI()
  const rootRef = useRef<HTMLElement | null>(null)
  const ctaLabel = content.primaryCta.label.trim() || 'Explore Residences'
  const ownerLabel = content.secondaryCta.label.trim() || 'Property Owners'

  useEffect(() => {
    const node = rootRef.current

    if (!node) {
      return
    }

    return animateHeroReveal(node, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return (
    <Section
      ref={rootRef}
      className="relative min-h-[84vh] overflow-hidden pb-20 pt-24 text-white md:min-h-[92vh]"
      aria-label="Hero section"
    >
      <img
        src={content.backgroundImage}
        alt="Oceanfront luxury terrace in Playa del Carmen"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,18,44,0.58),rgba(14,28,66,0.22))]" data-hero-overlay />
      <Container className="relative z-10 flex min-h-[68vh] items-center">
        <div className="max-w-[720px] space-y-6 md:space-y-8">
          <Typography as="p" variant="caption" data-hero-eyebrow>
            {content.eyebrow}
          </Typography>
          <Typography as="h1" variant="display" data-hero-title>
            {content.title}
          </Typography>
          <Typography className="max-w-[56ch] text-white/90" data-hero-subtitle>
            {content.subtitle}
          </Typography>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink
              aria-label={ctaLabel}
              className="min-w-56 liquid-click--hero"
              data-hero-cta
              href={content.primaryCta.href}
              size="lg"
              variant="hero"
            >
              <span className="inline-flex items-center gap-2">
                <FiCompass aria-hidden className="h-5 w-5" />
                {ctaLabel}
              </span>
            </ButtonLink>
            <ButtonLink
              aria-label={ownerLabel}
              className="min-w-52 bg-white/16 text-white ring-1 ring-white/30 hover:bg-white/26"
              href={content.secondaryCta.href}
              size="lg"
              variant="ghost"
            >
              <span className="inline-flex items-center gap-2">
                <FiKey aria-hidden className="h-5 w-5" />
                {ownerLabel}
              </span>
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}
