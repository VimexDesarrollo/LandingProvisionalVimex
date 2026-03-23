'use client'

import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { useSectionReveal } from '@/hooks/useSectionReveal'

export function FeelAtHomeSection() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <Section ref={ref} aria-labelledby="feel-at-home-heading" className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="space-y-5">
            <Typography as="h2" variant="h2" id="feel-at-home-heading" data-section-heading>
              Feel at Home in Playa del Carmen
            </Typography>
            <Typography as="p" className="text-lg font-medium text-accent" data-section-body>
              Find your ideal vacation rental
            </Typography>
            <Typography className="text-base leading-relaxed md:text-lg" data-section-body>
              We wish to welcome everyone to what we feel is truly paradise, familiarizing you with
              your vacation home and its surroundings in the Mexican Caribbean. You can expect from
              the onset, professional communication and seamless coordination of your holiday rental
              home via email or text. We do our best always, every day, to satisfy our clients, and
              make you feel at home. So, explore our unique collection of privately owned vacation
              rental properties and book today your upcoming vacation with ease and confidence.
            </Typography>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-xl" data-section-body>
            <img
              src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury vacation villa with pool in the Caribbean"
              className="h-full w-full object-cover"
              style={{ aspectRatio: '4/3' }}
              loading="lazy"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
