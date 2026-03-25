'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        },
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileWidgetProps {
  siteKey: string
  onTokenChange: (token: string | null) => void
}

export function TurnstileWidget({ siteKey, onTokenChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const scriptId = useId()

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile || widgetIdRef.current) {
      return
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'light',
      callback: (token) => onTokenChange(token),
      'expired-callback': () => onTokenChange(null),
      'error-callback': () => onTokenChange(null),
    })

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [onTokenChange, scriptReady, siteKey])

  return (
    <>
      <Script
        id={`turnstile-${scriptId}`}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </>
  )
}
