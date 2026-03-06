import type { ReactNode } from 'react'

interface CalendarModalOverlayProps {
  children: ReactNode
}

export function CalendarModalOverlay({ children }: CalendarModalOverlayProps) {
  return (
    <div
      data-testid="calendar-overlay"
      className="fixed inset-0 z-[220] h-screen w-screen flex items-center justify-center bg-[rgb(8_42_92_/_0.34)] backdrop-blur-lg"
    >
      {children}
    </div>
  )
}
