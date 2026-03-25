'use client'

import { useEffect } from 'react'
import { FiHome, FiUsers, FiTrendingUp, FiFileText, FiHeadphones } from 'react-icons/fi'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { animateHoverLift, animateStaggerCards } from '@/animations/homeAnimations'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useUI } from '@/hooks/useUI'
import { useLocale } from '@/i18n/LocaleContext'

const SERVICE_ICONS = [FiHome, FiUsers, FiTrendingUp, FiFileText, FiHeadphones]

export function ServicesSection() {
  const ref = useSectionReveal<HTMLElement>()
  const { prefersReducedMotion } = useUI()
  const { t } = useLocale()
  const services = t.services.items.map((item, i) => ({ ...item, id: String(i), icon: SERVICE_ICONS[i] }))

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const cleanupStagger = animateStaggerCards(node, '[data-service-card]', { reducedMotion: prefersReducedMotion })
    const cleanupHover = animateHoverLift(node, '[data-service-card]', { reducedMotion: prefersReducedMotion })
    return () => {
      cleanupStagger()
      cleanupHover()
    }
  }, [prefersReducedMotion])

  return (
    <Section ref={ref} aria-labelledby="services-heading" className="bg-slate-50 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <Typography as="h2" variant="h2" id="services-heading" data-section-heading>
            {t.services.heading}
          </Typography>
          <Typography className="mt-4 text-base md:text-lg" data-section-body>
            {t.services.subtitle}
          </Typography>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                data-service-card
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/10">
                  <Icon className="h-6 w-6 text-brand-teal" aria-hidden />
                </div>
                <Typography as="h3" variant="h3" className="text-xl font-bold text-slate-800">
                  {service.title}
                </Typography>
                <Typography className="text-base leading-relaxed text-slate-600">
                  {service.description}
                </Typography>
              </div>
            )
          })}

          {/* CTA card */}
          <div
            data-service-card
            className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-accent p-8"
          >
            <Typography as="h3" variant="h3" className="text-xl font-bold text-white">
              Ready to Elevate Your Property?
            </Typography>
            <Typography className="text-base leading-relaxed text-white/85">
              Connect with our expert team today to discover how we can maximize your investment.
            </Typography>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </Container>
    </Section>
  )
}
