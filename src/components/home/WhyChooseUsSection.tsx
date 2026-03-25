'use client'

import { useEffect } from 'react'
import { FiDollarSign, FiShield, FiAward, FiMap, FiStar } from 'react-icons/fi'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { animateHoverLift, animateWhyCardsOnScroll } from '@/animations/homeAnimations'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useUI } from '@/hooks/useUI'
import { useLocale } from '@/i18n/LocaleContext'

const PARALLAX_IMAGE =
  'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=2400&q=80'

const ICONS = [FiDollarSign, FiShield, FiAward, FiMap, FiStar]

export function WhyChooseUsSection() {
  const ref = useSectionReveal<HTMLElement>()
  const { prefersReducedMotion } = useUI()
  const { t } = useLocale()
  const reasons = t.whyChooseUs.cards.map((card, i) => ({ ...card, id: String(i), icon: ICONS[i] }))

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const cleanupScroll = animateWhyCardsOnScroll(node, '[data-why-card]', { reducedMotion: prefersReducedMotion })
    const cleanupHover = animateHoverLift(node, '[data-why-card]', { reducedMotion: prefersReducedMotion })
    return () => {
      cleanupScroll()
      cleanupHover()
    }
  }, [prefersReducedMotion])

  return (
    <section
      id="why-vimex-heading"
      ref={ref}
      aria-labelledby="why-choose-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Parallax background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${PARALLAX_IMAGE})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-900/75" />

      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <div className="rounded-2xl border border-white/25 bg-white/10 px-8 py-10 shadow-xl backdrop-blur-md">
            <Typography as="h2" variant="h2" id="why-choose-heading" className="text-white" data-section-heading>
              {t.whyChooseUs.heading}{' '}<span className="text-brand-teal">{t.whyChooseUs.headingBrand}</span>?
            </Typography>
            <Typography className="mt-4 text-base text-white/80 md:text-lg" data-section-body>
              {t.whyChooseUs.subtitle}
            </Typography>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.id}
                data-why-card
                className="rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/30">
                  <Icon className="h-5 w-5 text-white" aria-hidden />
                </div>
                <Typography as="h3" variant="h3" className="text-lg font-bold text-white">
                  {reason.title}
                </Typography>
                <Typography className="mt-2 text-sm leading-relaxed text-white/75">
                  {reason.description}
                </Typography>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
