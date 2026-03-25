'use client'

import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useLocale } from '@/i18n/LocaleContext'

const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      'Vimex made our family vacation completely seamless. The villa was exactly as described and the team was reachable every time we needed them. We\'ll be back next year!',
    name: 'Sarah M.',
    location: 'California, USA',
    stay: 'Villa Brianna',
  },
  {
    id: 't2',
    quote:
      'After 10 years vacationing in Playa del Carmen, Vimex is hands-down the most professional rental team we\'ve worked with. Their local knowledge and attention to detail is unmatched.',
    name: 'Carlos & Ana R.',
    location: 'Mexico City, MX',
    stay: 'Aldea Thai Studio',
  },
  {
    id: 't3',
    quote:
      'The property management service they provide for my condo has exceeded every expectation — transparent reporting, great guests, and absolutely zero headaches on my end.',
    name: 'David L.',
    location: 'Toronto, Canada',
    stay: 'Property Owner',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-400" aria-hidden="true">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useSectionReveal<HTMLElement>()
  const { t } = useLocale()

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="relative z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfd_55%,#eff8f8_100%)] py-20 pb-28 md:py-28 md:pb-36"
    >
      <Container>
        <div className="mb-14 text-center">
          <Typography as="p" variant="caption" className="mb-3 uppercase tracking-widest text-brand-teal" data-section-body>
            {t.testimonials.eyebrow}
          </Typography>
          <Typography as="h2" variant="h2" id="testimonials-heading" data-section-heading>
            {t.testimonials.heading}
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3" role="list">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              role="listitem"
              data-section-body
              className="flex flex-col gap-5 rounded-2xl border border-[rgb(188,222,221)] bg-white/88 p-8 shadow-[0_18px_40px_-28px_rgba(47,106,110,0.4)] backdrop-blur-sm transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_-28px_rgba(47,106,110,0.42)]"
            >
              <div className="flex items-start justify-between">
                <Stars />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-8 w-8 text-brand-teal/20" aria-hidden="true">
                  <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.5c0-1.38 1.12-2.5 2.5-2.5V8zm18 0c-3.314 0-6 2.686-6 6v10h10V14h-6.5c0-1.38 1.12-2.5 2.5-2.5V8z" />
                </svg>
              </div>

              <blockquote>
                <Typography className="text-sm leading-relaxed text-slate-600 md:text-base">
                  "{t.quote}"
                </Typography>
              </blockquote>

              <figcaption className="mt-auto border-t border-[rgb(214,236,235)] pt-5">
                <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.location}</p>
                <p className="mt-1 text-xs font-medium text-brand-teal">{t.stay}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
