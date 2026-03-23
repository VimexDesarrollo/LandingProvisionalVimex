'use client'

import { FiHome, FiUsers, FiTrendingUp, FiFileText, FiHeadphones } from 'react-icons/fi'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { useSectionReveal } from '@/hooks/useSectionReveal'

const SERVICES = [
  {
    id: 'maintenance',
    icon: FiHome,
    title: 'Property Maintenance',
    description:
      'Proactive upkeep, preventative measures, and rapid response to all maintenance needs, preserving your property\'s value.',
  },
  {
    id: 'guest',
    icon: FiUsers,
    title: 'Guest Management',
    description:
      'From booking inquiries to seamless check-ins and personalized support, we ensure every guest enjoys a memorable stay.',
  },
  {
    id: 'marketing',
    icon: FiTrendingUp,
    title: 'Marketing & Booking',
    description:
      'Strategic listing optimization, professional photography, and dynamic pricing to achieve maximum occupancy and revenue.',
  },
  {
    id: 'financial',
    icon: FiFileText,
    title: 'Financial Reporting',
    description:
      'Clear, transparent financial statements, detailed performance insights, and easy access to all your property\'s data.',
  },
  {
    id: 'support',
    icon: FiHeadphones,
    title: '24/7 Support',
    description:
      'Round-the-clock assistance and peace of mind for both property owners and guests, no matter the time zone.',
  },
]

export function ServicesSection() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <Section ref={ref} aria-labelledby="services-heading" className="bg-slate-50 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <Typography as="h2" variant="h2" id="services-heading" data-section-heading>
            Our Comprehensive Services
          </Typography>
          <Typography className="mt-4 text-base md:text-lg" data-section-body>
            We offer a full suite of services designed to maximize your property's potential and
            ensure a superior experience for all.
          </Typography>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 transition-shadow duration-300 hover:shadow-md"
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
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-accent p-8">
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
