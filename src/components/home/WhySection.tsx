import { useEffect, useRef } from 'react'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { Card } from '@/design-system/components/Card'
import { animateWhyCardsOnScroll } from '@/animations/homeAnimations'
import { useUI } from '@/hooks/useUI'
import { cn } from '@/lib/cn'
import type { WhyFeature } from '@/types/content'
import { FeatureIcon } from '@/components/home/FeatureIcon'

interface WhySectionProps {
  title: string
  subtitle: string
  features: WhyFeature[]
  className?: string
}

export function WhySection({ title, subtitle, features, className }: WhySectionProps) {
  const { prefersReducedMotion } = useUI()
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = rootRef.current

    if (!node) {
      return
    }

    return animateWhyCardsOnScroll(node, '[data-why-card]', { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return (
    <Section
      ref={rootRef}
      className={cn('why-animated-bg relative', className)}
      aria-labelledby="why-vimex-heading"
    >
      <Container>
        <div className="mx-auto max-w-[780px] rounded-2xl border border-white/60 bg-white/50 p-8 text-center shadow-lg backdrop-blur-xl md:p-12">
          <Typography as="h2" variant="h2" id="why-vimex-heading" className="text-slate-800">
            {title}
          </Typography>
          <Typography className="mt-4 text-slate-600">{subtitle}</Typography>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.id}
              data-why-card
              className="flex flex-col items-center gap-5 border-white/60 bg-white/50 text-center shadow-[0_22px_48px_-24px_rgba(13,31,74,0.45)] backdrop-blur-xl"
            >
              <FeatureIcon icon={feature.icon} />
              <Typography as="h3" variant="h3" className="text-[2rem] text-slate-800 md:text-[2.15rem]">
                {feature.title}
              </Typography>
              <Typography className="text-base text-slate-600 md:text-lg">{feature.description}</Typography>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
