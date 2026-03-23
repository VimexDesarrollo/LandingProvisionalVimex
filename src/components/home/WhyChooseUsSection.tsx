'use client'

import { FiDollarSign, FiShield, FiAward, FiMap, FiStar } from 'react-icons/fi'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { useSectionReveal } from '@/hooks/useSectionReveal'

const PARALLAX_IMAGE =
  'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=2400&q=80'

const REASONS = [
  {
    id: 'revenue',
    icon: FiDollarSign,
    title: 'Maximized Revenue',
    description:
      'Strategic pricing and targeted marketing ensure your property achieves its highest earning potential year-round.',
  },
  {
    id: 'stress-free',
    icon: FiShield,
    title: 'Stress-Free Ownership',
    description:
      'Enjoy complete peace of mind. We handle all guest communications, maintenance, and daily operations seamlessly.',
  },
  {
    id: 'professional',
    icon: FiAward,
    title: 'Professional Management',
    description:
      'Our experienced team provides meticulous care and efficient operations, treating your property as if it were our own.',
  },
  {
    id: 'local',
    icon: FiMap,
    title: 'Local Expertise',
    description:
      'Benefit from our deep understanding of the local market, connecting you with trusted vendors and valuable insights.',
  },
  {
    id: 'track-record',
    icon: FiStar,
    title: 'Proven Track Record',
    description:
      '20 years of successful partnerships and glowing testimonials stand as a testament to our commitment to excellence.',
  },
]

export function WhyChooseUsSection() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section
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
          <Typography as="h2" variant="h2" id="why-choose-heading" className="text-white" data-section-heading>
            Why Choose Us?
          </Typography>
          <Typography className="mt-4 text-base text-white/80 md:text-lg">
            Partner with us for unparalleled property management and guest satisfaction, built on a
            foundation of trust and proven results.
          </Typography>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.id}
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
