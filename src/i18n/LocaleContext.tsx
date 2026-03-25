'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { en, es, type Translations } from './translations'

type Locale = 'en' | 'es'

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Translations
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => undefined,
  t: en,
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('vimex-locale') as Locale | null
    if (saved === 'en' || saved === 'es') {
      setLocaleState(saved)
    } else {
      const browser = navigator.language.toLowerCase()
      setLocaleState(browser.startsWith('es') ? 'es' : 'en')
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('vimex-locale', l)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: locale === 'es' ? es : en }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
