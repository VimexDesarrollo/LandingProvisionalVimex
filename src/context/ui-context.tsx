import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export interface UINotification {
  id: string
  message: string
  tone: 'info' | 'warning' | 'error' | 'success'
}

interface UIContextValue {
  prefersReducedMotion: boolean
  isFiltersPanelOpen: boolean
  notifications: UINotification[]
  showNotification: (message: string, tone?: UINotification['tone']) => void
  dismissNotification: (id: string) => void
  openFiltersPanel: () => void
  closeFiltersPanel: () => void
  toggleFiltersPanel: () => void
}

const UIContext = createContext<UIContextValue | undefined>(undefined)

interface UIProviderProps {
  children: ReactNode
}

export function UIProvider({ children }: UIProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<UINotification[]>([])
  const notificationTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const lastNotificationRef = useRef<{ message: string; timestamp: number } | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (!isFiltersPanelOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isFiltersPanelOpen])

  useEffect(() => {
    return () => {
      notificationTimersRef.current.forEach((timerId) => clearTimeout(timerId))
      notificationTimersRef.current.clear()
    }
  }, [])

  const dismissNotification = useCallback((id: string) => {
    const timerId = notificationTimersRef.current.get(id)
    if (timerId) {
      clearTimeout(timerId)
      notificationTimersRef.current.delete(id)
    }

    setNotifications((current) => current.filter((notification) => notification.id !== id))
  }, [])

  const showNotification = useCallback((message: string, tone: UINotification['tone'] = 'warning') => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      return
    }

    const now = Date.now()
    if (
      lastNotificationRef.current &&
      lastNotificationRef.current.message === trimmedMessage &&
      now - lastNotificationRef.current.timestamp < 900
    ) {
      return
    }

    lastNotificationRef.current = { message: trimmedMessage, timestamp: now }

    const id = `${now}-${Math.random().toString(36).slice(2, 8)}`
    const nextNotification: UINotification = {
      id,
      message: trimmedMessage,
      tone,
    }

    setNotifications((current) => [...current, nextNotification])

    const timerId = setTimeout(() => {
      dismissNotification(id)
    }, 3400)

    notificationTimersRef.current.set(id, timerId)
  }, [dismissNotification])

  const value = useMemo(
    () => ({
      prefersReducedMotion,
      isFiltersPanelOpen,
      notifications,
      showNotification,
      dismissNotification,
      openFiltersPanel: () => setIsFiltersPanelOpen(true),
      closeFiltersPanel: () => setIsFiltersPanelOpen(false),
      toggleFiltersPanel: () => setIsFiltersPanelOpen((open) => !open),
    }),
    [prefersReducedMotion, isFiltersPanelOpen, notifications, showNotification, dismissNotification],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export { UIContext }
