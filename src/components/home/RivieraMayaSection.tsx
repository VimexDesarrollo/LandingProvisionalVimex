'use client'

import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useLocale } from '@/i18n/LocaleContext'

const PARALLAX_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80'

export function RivieraMayaSection() {
  const ref = useSectionReveal<HTMLElement>()
  const { t } = useLocale()

  return (
    <section
      ref={ref}
      aria-labelledby="riviera-maya-heading"
      className="relative overflow-hidden py-24 text-white md:py-32"
    >
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
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-900/65" />

      <Container>
        <div className="mx-auto max-w-[760px] space-y-6 text-center rounded-2xl border border-white/20 bg-slate-900/50 px-8 py-10 shadow-xl backdrop-blur-md md:px-14 md:py-14">
          <Typography as="p" variant="caption" className="text-brand-teal uppercase tracking-widest" data-section-body>
            {t.rivieraMaya.eyebrow}
          </Typography>
          <Typography as="h2" variant="h2" id="riviera-maya-heading" className="text-white" data-section-heading>
            {t.rivieraMaya.heading}
          </Typography>
          <Typography className="text-base leading-relaxed text-white/85 md:text-lg" data-section-body>
            {t.rivieraMaya.body}
          </Typography>
        </div>
      </Container>
    </section>
  )
}
