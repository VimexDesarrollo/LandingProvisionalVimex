'use client'

import { useEffect, useRef, useState } from 'react'
import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { useUI } from '@/hooks/useUI'
import { useLocale } from '@/i18n/LocaleContext'

const STAT_VALUES = [
  { value: 20, suffix: '+' },
  { value: 150, suffix: '+' },
  { value: 10000, suffix: '+' },
  { value: 4.9, suffix: '★' },
]

function formatStatValue(value: number) {
  return value % 1 !== 0 ? value.toFixed(1) : Math.round(value).toString()
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { prefersReducedMotion } = useUI()
  const { t } = useLocale()
  const [displayValues, setDisplayValues] = useState<number[]>(() => STAT_VALUES.map(() => 0))
  const STATS = [
    { ...STAT_VALUES[0], label: t.stats.years },
    { ...STAT_VALUES[1], label: t.stats.properties },
    { ...STAT_VALUES[2], label: t.stats.guests },
    { ...STAT_VALUES[3], label: t.stats.rating },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (prefersReducedMotion) {
      setDisplayValues(STAT_VALUES.map((stat) => stat.value))
      return
    }

    let hasAnimated = false
    let frameId: number | null = null
    const durationMs = 1600
    let observer: IntersectionObserver | null = null

    const animateCounters = () => {
      const startTime = performance.now()

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / durationMs, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        setDisplayValues(STAT_VALUES.map((stat) => stat.value * easedProgress))

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick)
          return
        }

        setDisplayValues(STAT_VALUES.map((stat) => stat.value))
        frameId = null
      }

      frameId = window.requestAnimationFrame(tick)
    }

    const startAnimation = () => {
      if (hasAnimated) return

      hasAnimated = true
      animateCounters()
      observer?.disconnect()
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }

    const checkVisibility = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const isVisible = rect.top <= viewportHeight * 0.85 && rect.bottom >= viewportHeight * 0.15

      if (isVisible) {
        startAnimation()
      }
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry?.isIntersecting) {
            startAnimation()
          }
        },
        { threshold: 0.15 },
      )

      observer.observe(section)
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility)
    checkVisibility()

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [prefersReducedMotion])

  return (
    <Section ref={sectionRef} aria-label="Key figures" className="bg-slate-900 py-16 md:py-20">
      <Container>
        <dl className="grid grid-cols-2 gap-px bg-white/10 overflow-hidden rounded-2xl md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-2 bg-slate-900 px-6 py-10 text-center"
            >
              <dt className="order-2 whitespace-pre-line text-xs font-semibold uppercase tracking-widest text-white/50">
                {stat.label}
              </dt>
              <dd className="order-1 flex items-end gap-0.5 font-bold leading-none text-white">
                <span
                  className="text-5xl md:text-6xl text-brand-teal tabular-nums"
                  data-count={stat.value}
                >
                  {formatStatValue(displayValues[index] ?? 0)}
                </span>
                <span className="mb-1 text-2xl text-white/60">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
