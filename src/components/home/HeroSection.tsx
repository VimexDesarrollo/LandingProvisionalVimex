import { useEffect, useRef } from 'react'
import { FiCompass } from 'react-icons/fi'
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
  const imgRef = useRef<HTMLImageElement | null>(null)
  const ctaLabel = content.primaryCta.label.trim() || 'Contact Us'

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    return animateHeroReveal(node, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion])

  return (
    <Section
      ref={rootRef}
      className="relative min-h-[84vh] overflow-hidden pb-20 pt-24 text-white md:min-h-[92vh]"
      aria-label="Hero section"
    >
      <img
        ref={imgRef}
        src={content.backgroundImage}
        alt="Oceanfront luxury terrace in Playa del Carmen"
        className="absolute inset-0 h-[120%] w-full object-cover will-change-transform"
        style={{ top: '-10%' }}
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,18,44,0.58),rgba(14,28,66,0.22))]" data-hero-overlay />
      <Container className="relative z-10 flex min-h-[68vh] items-center">
        <div className="max-w-[720px] space-y-6 md:space-y-8">
          <Typography as="p" variant="caption" data-hero-eyebrow className="text-brand-teal">
            {content.eyebrow}
          </Typography>
          <Typography as="h1" variant="display" data-hero-title>
            Welcome Home to{' '}
            <span className="text-brand-teal">Playa del Carmen</span>
          </Typography>
          <Typography className="max-w-[56ch] text-white/90" data-hero-subtitle>
            {content.subtitle}
          </Typography>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink
              aria-label={ctaLabel}
              className="min-w-56"
              data-hero-cta
              href={content.primaryCta.href}
              size="lg"
              variant="brand"
            >
              <span className="inline-flex items-center gap-2">
                <FiCompass aria-hidden className="h-5 w-5" />
                {ctaLabel}
              </span>
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}
