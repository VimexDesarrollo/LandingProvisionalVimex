'use client'

import Image from 'next/image'
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
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't2',
    quote:
      'After 10 years vacationing in Playa del Carmen, Vimex is hands-down the most professional rental team we\'ve worked with. Their local knowledge and attention to detail is unmatched.',
    name: 'Carlos & Ana R.',
    location: 'Mexico City, MX',
    stay: 'Aldea Thai Studio',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't3',
    quote:
      'The property management service they provide for my condo has exceeded every expectation — transparent reporting, great guests, and absolutely zero headaches on my end.',
    name: 'David L.',
    location: 'Toronto, Canada',
    stay: 'Property Owner',
    image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=800&q=80',
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
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.id}
              role="listitem"
              data-section-body
              className="group relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-28px_rgba(47,106,110,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_56px_-24px_rgba(47,106,110,0.5)]"
              style={{ minHeight: '380px' }}
            >
              {/* Full background image */}
              <Image
                src={testimonial.image}
                alt={testimonial.stay}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark overlay — always visible, fades on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-opacity duration-500 group-hover:opacity-0"
              />

              {/* Glassmorphism overlay — hidden by default, appears on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-white/70 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-end p-7" style={{ minHeight: '380px' }}>
                <div className="flex items-start justify-between">
                  <Stars />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor"
                    className="h-7 w-7 text-white/30 transition-colors duration-500 group-hover:text-brand-teal/30"
                    aria-hidden="true"
                  >
                    <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.5c0-1.38 1.12-2.5 2.5-2.5V8zm18 0c-3.314 0-6 2.686-6 6v10h10V14h-6.5c0-1.38 1.12-2.5 2.5-2.5V8z" />
                  </svg>
                </div>

                <blockquote className="mt-4">
                  <Typography className="text-sm leading-relaxed text-white transition-colors duration-500 group-hover:text-slate-800 md:text-base">
                    "{testimonial.quote}"
                  </Typography>
                </blockquote>

                <figcaption className="mt-5 border-t border-white/25 pt-4 transition-colors duration-500 group-hover:border-slate-200">
                  <p className="text-sm font-semibold text-white transition-colors duration-500 group-hover:text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-white/70 transition-colors duration-500 group-hover:text-slate-500">
                    {testimonial.location}
                  </p>
                  <p className="mt-1 text-xs font-medium text-brand-teal/80 transition-colors duration-500 group-hover:text-brand-teal">
                    {testimonial.stay}
                  </p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
