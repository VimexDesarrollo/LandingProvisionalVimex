'use client'

import Image from 'next/image'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { useImageReveal } from '@/hooks/useImageReveal'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useLocale } from '@/i18n/LocaleContext'

export function FeelAtHomeSection() {
  const sectionRef = useSectionReveal<HTMLElement>()
  const { wrapperRef, imgRef } = useImageReveal()
  const { t } = useLocale()

  return (
    <Section id="feel-at-home" ref={sectionRef} aria-labelledby="feel-at-home-heading" className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="space-y-5">
            <Typography as="h2" variant="h2" id="feel-at-home-heading" data-section-heading>
              {t.feelAtHome.heading}
            </Typography>
            <Typography as="p" className="text-lg font-medium text-accent" data-section-body>
              {t.feelAtHome.subheading}
            </Typography>
            <Typography className="text-base leading-relaxed md:text-lg" data-section-body>
              {t.feelAtHome.body}
            </Typography>
          </div>

          <div
            ref={wrapperRef}
            className="relative overflow-hidden rounded-2xl shadow-xl"
            style={{ aspectRatio: '4/3' }}
          >
            <Image
              ref={imgRef}
              src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury vacation villa with pool in the Caribbean"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover will-change-transform"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
