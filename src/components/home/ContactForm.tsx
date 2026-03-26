'use client'

import { useState } from 'react'
import { z } from 'zod'
import { buildContactMessage, buildOwnerMessage, buildWhatsAppUrl } from '@/config/whatsapp'
import { useLocale } from '@/i18n/LocaleContext'

type ContactMode = 'guest' | 'owner'

const guestSchema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().max(20).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.coerce.number().min(1).max(20).optional().or(z.literal('')),
  message: z.string().max(500).optional(),
  company: z.string().max(200).optional(),
})

const ownerSchema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().max(20).optional(),
  propertyType: z.string().max(100).optional(),
  propertyLocation: z.string().max(100).optional(),
  message: z.string().max(500).optional(),
  company: z.string().max(200).optional(),
})

type GuestFields = z.infer<typeof guestSchema>
type OwnerFields = z.infer<typeof ownerSchema>
type Errors = Partial<Record<string, string>>

const INITIAL_GUEST: GuestFields = { name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '', message: '', company: '' }
const INITIAL_OWNER: OwnerFields = { name: '', email: '', phone: '', propertyType: '', propertyLocation: '', message: '', company: '' }

const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors focus:ring-2'
const inputCls = (err: boolean) =>
  `${inputBase} ${err ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-accent focus:ring-accent/20'}`

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

export function ContactForm() {
  const [mode, setMode] = useState<ContactMode>('guest')
  const [guestFields, setGuestFields] = useState<GuestFields>(INITIAL_GUEST)
  const [ownerFields, setOwnerFields] = useState<OwnerFields>(INITIAL_OWNER)
  const [errors, setErrors] = useState<Errors>({})
  const { locale, t } = useLocale()
  const f = t.contact.form

  const setGuest = (key: keyof GuestFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setGuestFields((prev) => ({ ...prev, [key]: e.target.value }))

  const setOwner = (key: keyof OwnerFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setOwnerFields((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (mode === 'guest') {
      const result = guestSchema.safeParse(guestFields)
      if (!result.success) {
        const errs: Errors = {}
        result.error.issues.forEach((issue) => { errs[issue.path[0] as string] = issue.message })
        setErrors(errs)
        return
      }
      if (result.data.company?.trim()) { setErrors({ form: f.submitError }); return }
      const data = result.data
      const msg = buildContactMessage({
        locale, name: data.name, email: data.email, phone: data.phone,
        checkIn: data.checkIn, checkOut: data.checkOut,
        guests: typeof data.guests === 'number' ? data.guests : undefined,
        message: data.message?.trim() || f.defaultMessage,
      })
      const url = buildWhatsAppUrl(msg)
      if (!url) { setErrors({ form: f.submitError }); return }
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      const result = ownerSchema.safeParse(ownerFields)
      if (!result.success) {
        const errs: Errors = {}
        result.error.issues.forEach((issue) => { errs[issue.path[0] as string] = issue.message })
        setErrors(errs)
        return
      }
      if (result.data.company?.trim()) { setErrors({ form: f.submitError }); return }
      const data = result.data
      const msg = buildOwnerMessage({
        locale, name: data.name, email: data.email, phone: data.phone,
        propertyType: data.propertyType, propertyLocation: data.propertyLocation,
        message: data.message?.trim() || f.ownerDefaultMessage,
      })
      const url = buildWhatsAppUrl(msg)
      if (!url) { setErrors({ form: f.submitError }); return }
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Toggle */}
      <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => { setMode('guest'); setErrors({}) }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${mode === 'guest' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
        >
          {f.toggleGuest}
        </button>
        <button
          type="button"
          onClick={() => { setMode('owner'); setErrors({}) }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${mode === 'owner' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
        >
          {f.toggleOwner}
        </button>
      </div>

      {/* Shared fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={f.name} error={errors.name}>
          <input type="text" value={mode === 'guest' ? guestFields.name : ownerFields.name} onChange={mode === 'guest' ? setGuest('name') : setOwner('name')} maxLength={100} placeholder={f.namePlaceholder} className={inputCls(!!errors.name)} />
        </Field>
        <Field label={f.email} error={errors.email}>
          <input type="email" value={mode === 'guest' ? guestFields.email : ownerFields.email} onChange={mode === 'guest' ? setGuest('email') : setOwner('email')} maxLength={100} placeholder={f.emailPlaceholder} className={inputCls(!!errors.email)} />
        </Field>
      </div>

      <Field label={f.phone}>
        <input type="tel" value={mode === 'guest' ? (guestFields.phone ?? '') : (ownerFields.phone ?? '')} onChange={mode === 'guest' ? setGuest('phone') : setOwner('phone')} maxLength={20} placeholder={f.phonePlaceholder} className={inputCls(false)} />
      </Field>

      {/* Guest-only fields */}
      {mode === 'guest' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={f.checkIn}>
              <input type="date" value={guestFields.checkIn ?? ''} onChange={setGuest('checkIn')} className={inputCls(false)} />
            </Field>
            <Field label={f.checkOut}>
              <input type="date" value={guestFields.checkOut ?? ''} onChange={setGuest('checkOut')} className={inputCls(false)} />
            </Field>
          </div>
          <Field label={f.guests}>
            <input type="number" value={guestFields.guests as string} onChange={setGuest('guests')} min={1} max={20} placeholder={f.guestsPlaceholder} className={inputCls(false)} />
          </Field>
        </>
      )}

      {/* Owner-only fields */}
      {mode === 'owner' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={f.propertyType}>
            <input type="text" value={ownerFields.propertyType ?? ''} onChange={setOwner('propertyType')} maxLength={100} placeholder={f.propertyTypePlaceholder} className={inputCls(false)} />
          </Field>
          <Field label={f.propertyLocation}>
            <input type="text" value={ownerFields.propertyLocation ?? ''} onChange={setOwner('propertyLocation')} maxLength={100} placeholder={f.propertyLocationPlaceholder} className={inputCls(false)} />
          </Field>
        </div>
      )}

      <Field label={f.message} error={errors.message}>
        <textarea
          value={mode === 'guest' ? (guestFields.message ?? '') : (ownerFields.message ?? '')}
          onChange={mode === 'guest' ? setGuest('message') : setOwner('message')}
          maxLength={500} rows={4}
          placeholder={mode === 'guest' ? f.messagePlaceholder : f.ownerMessagePlaceholder}
          className={`${inputCls(!!errors.message)} resize-none`}
        />
      </Field>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company-field">{f.honeypotLabel}</label>
        <input id="company-field" type="text" value={mode === 'guest' ? (guestFields.company ?? '') : (ownerFields.company ?? '')} onChange={mode === 'guest' ? setGuest('company') : setOwner('company')} tabIndex={-1} autoComplete="off" />
      </div>

      {errors.form && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {f.submit}
      </button>
    </form>
  )
}
