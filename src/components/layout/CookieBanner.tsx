'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/animations/gsap'

const CONSENT_KEY = 'vimex-cookie-consent'

type ConsentValue = 'all' | 'essential'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      // Short delay so the page renders before the banner slides in
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const el = bannerRef.current
    if (!el || !visible) return

    gsap.fromTo(
      el,
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.55, ease: 'power3.out' },
    )
  }, [visible])

  const dismiss = (value: ConsentValue) => {
    localStorage.setItem(CONSENT_KEY, value)
    const el = bannerRef.current
    if (el) {
      gsap.to(el, {
        y: '110%',
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => setVisible(false),
      })
    } else {
      setVisible(false)
    }
  }

  if (!visible) return null

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-6 left-4 right-4 z-[200] mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white/95 px-6 py-5 shadow-2xl backdrop-blur-md md:left-6 md:right-auto md:max-w-md"
    >
      <p className="text-sm font-semibold text-slate-800">🍪 We use cookies</p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
        We use cookies to improve your experience and analyze site usage. See our{' '}
        <Link href="/cookie-policy" className="font-medium text-brand-teal underline-offset-2 hover:underline">
          Cookie Policy
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy" className="font-medium text-brand-teal underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dismiss('all')}
          className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => dismiss('essential')}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Essential only
        </button>
      </div>
    </div>
  )
}
