'use client'

import Image from 'next/image'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { useImageReveal } from '@/hooks/useImageReveal'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useLocale } from '@/i18n/LocaleContext'

export function CommunitiesSection() {
  const sectionRef = useSectionReveal<HTMLElement>()
  const { wrapperRef, imgRef } = useImageReveal()
  const { t } = useLocale()

  return (
    <Section ref={sectionRef} aria-labelledby="communities-heading" className="bg-slate-50 py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div
            ref={wrapperRef}
            className="relative overflow-hidden rounded-2xl shadow-xl"
            style={{ aspectRatio: '4/3' }}
          >
            <Image
              ref={imgRef}
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
              alt="Playa del Carmen beachfront community"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover will-change-transform"
            />
          </div>

          <div className="space-y-5">
            <Typography as="h2" variant="h2" id="communities-heading" data-section-heading>
              {t.communities.heading}
            </Typography>
            <Typography className="text-base leading-relaxed md:text-lg" data-section-body>
              {t.communities.body}
            </Typography>
          </div>
        </div>
      </Container>
    </Section>
  )
}
