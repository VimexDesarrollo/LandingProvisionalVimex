'use client'

import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { useSectionReveal } from '@/hooks/useSectionReveal'

const PARALLAX_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80'

export function RivieraMayaSection() {
  const ref = useSectionReveal<HTMLElement>()

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
        <div className="mx-auto max-w-[760px] space-y-6 text-center">
          <Typography as="p" variant="caption" className="text-brand-teal uppercase tracking-widest" data-section-body>
            Playa Del Carmen, MX
          </Typography>
          <Typography as="h2" variant="h2" id="riviera-maya-heading" className="text-white" data-section-heading>
            Riviera Maya Vacation Rentals
          </Typography>
          <Typography className="text-base leading-relaxed text-white/85 md:text-lg" data-section-body>
            The Riviera Maya Mexico continues to excite travelers of all ages, as a hot, desirable
            beach-lovers vacation destination. The Mexican Caribbean with its unique stunning beauty
            has been appealing to vacationers from around the world since Cancun was introduced in
            1974, the same year Quintana Roo became an official Mexican State. Playa del Carmen has
            exploded over the past 20 years as a sought-after beachfront playground for inexpensive,
            relaxing, fun-filled, quick travel getaways.
          </Typography>
        </div>
      </Container>
    </section>
  )
}
