'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { animateCardDeck } from '@/animations/homeAnimations'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useUI } from '@/hooks/useUI'
import { useLocale } from '@/i18n/LocaleContext'

// Property images — one per service
const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', // maintenance
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80', // guests
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', // marketing
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',   // reporting
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80', // support
]

// Soft brand tints per card — navy / neutral / aqua / neutral / gold
const CARD_TINTS = [
  { bg: 'bg-[#eef2ff]', accent: 'bg-blue-100 text-blue-700' },
  { bg: 'bg-white',      accent: 'bg-teal-50 text-brand-teal' },
  { bg: 'bg-[#f0fbfc]', accent: 'bg-teal-100 text-teal-700' },
  { bg: 'bg-white',      accent: 'bg-slate-100 text-slate-600' },
  { bg: 'bg-[#fffbf0]', accent: 'bg-amber-100 text-amber-700' },
]

export function ServicesSection() {
  const ref = useSectionReveal<HTMLElement>()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion } = useUI()
  const { t } = useLocale()

  const services = t.services.items.map((item, i) => ({
    ...item,
    id: String(i),
    image: SERVICE_IMAGES[i],
    tint: CARD_TINTS[i],
  }))

  // +1 for CTA card
  const totalCards = services.length + 1
  const deckHeight = `${totalCards * 90}vh`

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    return animateCardDeck(wrapper, '[data-service-card]', { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return (
    <Section ref={ref} aria-labelledby="services-heading" className="bg-slate-50">
      {/* Heading — normal scroll, right above the sticky card deck */}
      <Container className="pb-0 pt-16 md:pt-24">
        <div className="mx-auto max-w-[640px] text-center">
          <Typography as="h2" variant="h2" id="services-heading" data-section-heading>
            {t.services.heading}
          </Typography>
          <Typography className="mt-4 text-base md:text-lg" data-section-body>
            {t.services.subtitle}
          </Typography>
        </div>
      </Container>

      {/* Card deck — sticky area providing scroll distance.
          items-start so cards begin right below the heading (no gap).
          As user scrolls, heading rises and the first card covers it. */}
      <div ref={wrapperRef} style={{ height: deckHeight }} className="relative">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 pt-20">
          {/* Service cards — all stacked at same position
              First card = highest z-index (peels first) */}
          {services.map((service, i) => (
            <article
              key={service.id}
              data-service-card
              aria-labelledby={`service-title-${service.id}`}
              className={`absolute w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl will-change-transform ${service.tint.bg}`}
              style={{ zIndex: totalCards - i, height: '520px' }}
            >
              <div className="flex h-full flex-col md:flex-row">
                {/* Image */}
                <div className="relative h-64 shrink-0 md:h-full md:w-2/5">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center gap-4 p-8 md:w-3/5 md:p-10">
                  <span className={`inline-flex w-fit rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-widest ${service.tint.accent}`}>
                    {`0${i + 1}`}
                  </span>
                  <Typography as="h3" variant="h3" id={`service-title-${service.id}`} className="text-2xl font-bold text-slate-800">
                    {service.title}
                  </Typography>
                  <Typography className="text-base leading-relaxed text-slate-600">
                    {service.description}
                  </Typography>
                </div>
              </div>
            </article>
          ))}

          {/* CTA card — bottom of the deck, revealed last */}
          <article
            data-service-card
            className="absolute w-full max-w-3xl overflow-hidden rounded-3xl bg-accent shadow-2xl will-change-transform"
            style={{ zIndex: 1, height: '520px' }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-6 p-10 text-center md:p-14">
              <Typography as="h3" variant="h3" className="text-2xl font-bold text-white md:text-3xl">
                Ready to Elevate Your Property?
              </Typography>
              <Typography className="max-w-md text-base text-white/80">
                Connect with our expert team today to discover how we can maximize your investment.
              </Typography>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-accent transition-opacity hover:opacity-90"
              >
                {t.services.cta}
              </a>
            </div>
          </article>
        </div>
      </div>

      <div className="pb-20 md:pb-28" />
    </Section>
  )
}
