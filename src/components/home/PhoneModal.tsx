'use client'

import { useEffect } from 'react'

interface PhoneEntry {
  display: string
  href: string
  flag: string
  label: string
}

function parsePhone(phone: string): PhoneEntry {
  const digits = phone.replace(/[\s()\-]/g, '')
  if (digits.startsWith('+1')) {
    return { display: phone, href: `tel:${digits}`, flag: '🇺🇸', label: 'US & Canada' }
  }
  return { display: phone, href: `tel:${digits}`, flag: '🇲🇽', label: 'México' }
}

interface PhoneModalProps {
  phones: string[]
  onClose: () => void
}

export function PhoneModal({ phones, onClose }: PhoneModalProps) {
  const entries = phones.map(parsePhone)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        <h2 id="phone-modal-title" className="mb-6 text-center text-2xl font-bold text-ink">
          Call Us
        </h2>

        <div className="space-y-3">
          {entries.map((entry) => (
            <a
              key={entry.href}
              href={entry.href}
              className="flex items-center gap-4 rounded-xl border border-card-border bg-surface-muted/50 px-5 py-4 transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <span className="text-3xl" aria-hidden="true">{entry.flag}</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {entry.label}
                </span>
                <span className="text-lg font-bold text-ink">{entry.display}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
