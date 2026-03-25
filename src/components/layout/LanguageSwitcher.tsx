'use client'

import { useLocale } from '@/i18n/LocaleContext'
import { cn } from '@/lib/cn'

interface LanguageSwitcherProps {
  scrolled?: boolean
}

export function LanguageSwitcher({ scrolled = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale()
  const next = locale === 'en' ? 'es' : 'en'
  const label = locale === 'en' ? 'EN' : 'ES'
  const flag = locale === 'en' ? '🇺🇸' : '🇲🇽'
  const knobPosition = locale === 'en' ? 'translate-x-0' : 'translate-x-8'
  const isSpanish = locale === 'es'

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={locale === 'en' ? 'Cambiar a Español' : 'Switch to English'}
      aria-pressed={locale === 'es'}
      className={cn(
        'group inline-flex items-center gap-3 rounded-full border px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300',
        scrolled
          ? 'border-slate-200/90 bg-white/90 text-slate-900 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.55)] hover:border-slate-300 hover:shadow-[0_16px_38px_-20px_rgba(15,23,42,0.5)]'
          : 'border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))] text-white shadow-[0_14px_34px_-22px_rgba(3,10,26,0.9)] backdrop-blur-md hover:border-white/30 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0.12))]',
      )}
    >
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 transition-all duration-300',
          !isSpanish
            ? scrolled
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-950 shadow-[0_4px_14px_-8px_rgba(255,255,255,0.8)]'
            : 'opacity-50 group-hover:opacity-70',
        )}
      >
        EN
      </span>
      <span
        className={cn(
          'relative flex h-7 w-[3.9rem] items-center rounded-full border transition-all duration-300',
          scrolled
            ? 'border-slate-200 bg-[linear-gradient(180deg,#e2e8f0,#cbd5e1)]'
            : 'border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))]',
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            'absolute inset-y-0 left-0 w-1/2 rounded-full transition-opacity duration-300',
            !isSpanish
              ? scrolled
                ? 'bg-white/35 opacity-100'
                : 'bg-white/16 opacity-100'
              : 'opacity-0',
          )}
        />
        <span
          className={cn(
            'absolute inset-y-0 right-0 w-1/2 rounded-full transition-opacity duration-300',
            isSpanish
              ? scrolled
                ? 'bg-teal-500/20 opacity-100'
                : 'bg-brand-teal/25 opacity-100'
              : 'opacity-0',
          )}
        />
        <span
          className={cn(
            'absolute left-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] shadow-[0_8px_20px_-10px_rgba(15,23,42,0.55)] transition-transform duration-300',
            scrolled
              ? 'bg-white'
              : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.92))]',
            knobPosition,
          )}
        >
          {flag}
        </span>
      </span>
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 transition-all duration-300',
          isSpanish
            ? scrolled
              ? 'bg-brand-teal text-white shadow-sm'
              : 'bg-brand-teal text-slate-950 shadow-[0_8px_18px_-12px_rgba(68,184,206,0.95)]'
            : 'opacity-50 group-hover:opacity-70',
        )}
      >
        ES
      </span>
      <span className="sr-only">{label}</span>
    </button>
  )
}
