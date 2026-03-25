'use client'

import { useRef, useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { gsap } from '@/animations/gsap'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'
import { useSectionReveal } from '@/hooks/useSectionReveal'
import { useLocale } from '@/i18n/LocaleContext'

export function FaqSection() {
  const sectionRef = useSectionReveal<HTMLElement>()
  const { t } = useLocale()
  const [openId, setOpenId] = useState<string | null>(null)
  const answerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const toggle = (id: string) => {
    const isOpening = openId !== id

    // Close currently open item
    if (openId) {
      const currentEl = answerRefs.current[openId]
      if (currentEl) {
        gsap.to(currentEl, { height: 0, duration: 0.28, ease: 'power2.in', overwrite: true })
      }
    }

    // Open new item
    if (isOpening) {
      const el = answerRefs.current[id]
      if (el) {
        const targetHeight = el.scrollHeight
        gsap.fromTo(
          el,
          { height: 0 },
          { height: targetHeight, duration: 0.38, ease: 'power3.out', overwrite: true },
        )
      }
    }

    setOpenId(isOpening ? id : null)
  }

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="faq-heading"
      className="relative z-20 -mt-10 overflow-hidden rounded-t-[2rem] border-t border-white/45 bg-[linear-gradient(180deg,#dff4f1_0%,#edf9f7_22%,#f8fcfb_100%)] py-20 shadow-[0_-18px_45px_-28px_rgba(40,107,111,0.36)] md:-mt-16 md:rounded-t-[2.75rem] md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(123,206,196,0.32),transparent_68%)]"
      />
      <Container>
        <div className="relative mx-auto max-w-[720px]">
          <div className="mb-14 text-center">
            <Typography
              as="p"
              variant="caption"
              className="mb-3 uppercase tracking-widest text-[rgb(56,148,140)]"
              data-section-body
            >
              {t.faq.eyebrow}
            </Typography>
            <Typography as="h2" variant="h2" id="faq-heading" data-section-heading>
              {t.faq.heading}{' '}<span className="text-[rgb(56,148,140)]">{t.faq.headingHighlight}</span>
            </Typography>
          </div>

          <div className="rounded-[1.75rem] border border-[rgb(191,227,223)] bg-white/78 px-2 shadow-[0_20px_46px_-32px_rgba(52,114,117,0.34)] backdrop-blur-sm md:px-4">
            {t.faq.items.map((faq, index) => {
              const id = String(index)
              const isOpen = openId === id
              return (
                <div
                  key={id}
                  data-section-body
                  className={`border-b border-[rgb(218,240,237)] transition-colors duration-300 last:border-b-0 ${isOpen ? 'border-l-2 border-[rgb(56,148,140)] pl-5' : 'border-l-2 border-transparent pl-5'}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${id}`}
                    onClick={() => toggle(id)}
                    className="flex w-full items-start gap-4 py-6 text-left"
                  >
                    <span
                      className="mt-0.5 shrink-0 font-mono text-sm font-bold text-[rgb(56,148,140)]"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-base font-semibold leading-snug text-slate-800 md:text-lg">
                      {faq.q}
                    </span>
                    <span className="mt-0.5 shrink-0 text-[rgb(56,148,140)] transition-transform duration-300">
                      {isOpen ? <FiMinus className="h-5 w-5" aria-hidden /> : <FiPlus className="h-5 w-5" aria-hidden />}
                    </span>
                  </button>

                  <div
                    id={`faq-answer-${id}`}
                    ref={(el) => { answerRefs.current[id] = el }}
                    style={{ height: 0, overflow: 'hidden' }}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                  >
                    <Typography className="pb-6 pl-10 text-base leading-relaxed text-slate-600">
                      {faq.a}
                    </Typography>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
