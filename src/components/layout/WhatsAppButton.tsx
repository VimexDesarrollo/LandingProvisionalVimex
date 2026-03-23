'use client'

import { useEffect, useState } from 'react'
import type { FooterContactContent } from '@/types/content'

interface ContactModalProps {
  contact: FooterContactContent
  onClose: () => void
}

function ContactModal({ contact, onClose }: ContactModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact options"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Full-screen blur overlay */}
      <div
        data-testid="contact-modal-overlay"
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close contact options"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
          Contact Us
        </h2>

        <div className="space-y-3">
          {/* Phone buttons grouped by country */}
          {contact.phones.map((phone) => {
            const digits = phone.replace(/[\s()\-]/g, '')
            const isMx = !digits.startsWith('+1')
            const waNumber = digits.replace('+', '')
            const phoneWaHref = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello! I want information about a vacation rental in Playa del Carmen.')}`

            return (
              <div key={phone} className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{isMx ? '🇲🇽' : '🇺🇸'}</span>
                  <div className="flex flex-col">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400">
                      {isMx ? 'México' : 'US & Canada'}
                    </span>
                    <span className="text-base font-bold text-gray-900">{phone}</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <a
                    href={`tel:${digits}`}
                    aria-label={`Call ${phone}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                    </svg>
                    Call
                  </a>
                  {isMx && (
                    <a
                      href={phoneWaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${phone}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )
          })}

          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 transition-colors hover:border-accent/40 hover:bg-accent/5"
          >
            <span className="text-2xl" aria-hidden="true">✉️</span>
            <div className="flex flex-col">
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400">Email</span>
              <span className="text-base font-bold text-gray-900">{contact.email}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

interface WhatsAppButtonProps {
  contact: FooterContactContent
}

export function WhatsAppButton({ contact }: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open contact options"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 fill-white">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.736 5.47 2.027 7.773L0 32l8.418-2.004A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.765-1.853l-.485-.288-5.001 1.191 1.233-4.865-.317-.5A13.266 13.266 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.273-9.97c-.398-.199-2.354-1.162-2.718-1.294-.365-.133-.631-.199-.897.199-.266.398-1.03 1.294-1.263 1.56-.232.266-.465.299-.863.1-.398-.199-1.681-.62-3.201-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.162-1.23-2.959-.324-.776-.653-.671-.897-.683l-.764-.013c-.266 0-.697.1-.1063.498-.365.398-1.396 1.362-1.396 3.322s1.43 3.854 1.629 4.12c.199.266 2.814 4.298 6.82 6.027.954.412 1.699.658 2.279.843.957.305 1.829.262 2.518.159.768-.114 2.354-.962 2.686-1.891.332-.93.332-1.727.232-1.891-.099-.166-.365-.266-.763-.465z" />
        </svg>
      </button>

      {open && <ContactModal contact={contact} onClose={() => setOpen(false)} />}
    </>
  )
}
