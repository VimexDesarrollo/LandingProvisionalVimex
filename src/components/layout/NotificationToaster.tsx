'use client'

import { useUI } from '@/hooks/useUI'

const TONE_CLASSES: Record<'info' | 'warning' | 'error' | 'success', string> = {
  info: 'border-accent/30 bg-white/92 text-ink',
  warning: 'border-amber-300/55 bg-amber-50/96 text-amber-900',
  error: 'border-rose-300/55 bg-rose-50/96 text-rose-900',
  success: 'border-emerald-300/55 bg-emerald-50/96 text-emerald-900',
}

export function NotificationToaster() {
  const { notifications, dismissNotification } = useUI()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[320] flex items-center px-3 md:bottom-7">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto w-[min(34rem,calc(100vw-1.5rem))] rounded-xl border px-3.5 py-3 text-sm font-medium shadow-soft backdrop-blur-sm transition-all duration-200 ${TONE_CLASSES[notification.tone]}`}
        >
          <div className="flex items-start gap-2.5">
            <p className="flex-1 leading-snug">{notification.message}</p>
            <button
              type="button"
              className="rounded-full border border-current/20 px-2 py-0.5 text-xs font-semibold opacity-75 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
              onClick={() => dismissNotification(notification.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
