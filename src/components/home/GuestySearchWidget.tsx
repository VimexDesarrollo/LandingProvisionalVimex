'use client'

import { useEffect } from 'react'
import { Container } from '@/design-system/components/Container'

declare global {
  interface Window {
    GuestySearchBarWidget: {
      create: (options: { siteUrl: string; color: string }) => Promise<void>
    }
  }
}

const GUESTY_CSS = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css'
const GUESTY_JS = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js'
const WIDGET_OPTIONS = { siteUrl: 'vimexmx.guestybookings.com', color: '#7ed7e6' }

export function GuestySearchWidget() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = GUESTY_CSS
    link.media = 'all'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = GUESTY_JS
    script.async = true
    script.onload = () => {
      try {
        window.GuestySearchBarWidget.create(WIDGET_OPTIONS).catch(() => {})
      } catch {
        // widget init failed
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link)
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  return (
    <section aria-label="Buscador de propiedades" className="relative z-20 -mt-7 pb-6">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-[rgb(205_219_239/0.5)] bg-white shadow-[0_12px_48px_-8px_rgb(10_41_86/0.22)]">
          <div id="search-widget_IO312PWQ" className="w-full" />
        </div>
      </Container>
    </section>
  )
}
