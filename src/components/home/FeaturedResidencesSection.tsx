import { useEffect, useRef } from 'react'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { animateHoverLift, animateStaggerCards } from '@/animations/homeAnimations'
import { useUI } from '@/hooks/useUI'
import type { Cta, Residence } from '@/types/content'
import { ResidenceCard } from '@/components/home/ResidenceCard'

interface FeaturedResidencesSectionProps {
  title: string
  cta: Cta
  residences: Residence[]
}

export function FeaturedResidencesSection({ title, cta, residences }: FeaturedResidencesSectionProps) {
  const { prefersReducedMotion } = useUI()
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = rootRef.current

    if (!node) {
      return
    }

    const cleanupStagger = animateStaggerCards(node, '[data-residence-card]', {
      reducedMotion: prefersReducedMotion,
    })

    const cleanupHover = animateHoverLift(node, '[data-residence-card]', {
      reducedMotion: prefersReducedMotion,
    })

    return () => {
      cleanupStagger()
      cleanupHover()
    }
  }, [prefersReducedMotion])

  return (
    <Section ref={rootRef} id="featured-residences" aria-labelledby="featured-residences-heading">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Typography as="h2" id="featured-residences-heading" variant="h2" className="max-w-[16ch]">
            {title}
          </Typography>
          <a
            href={cta.href}
            className="inline-flex items-center gap-2 text-lg font-medium text-accent transition-colors duration-300 hover:text-accent-strong"
            aria-label={cta.label}
          >
            {cta.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {residences.map((residence) => (
            <ResidenceCard key={residence.id} residence={residence} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
