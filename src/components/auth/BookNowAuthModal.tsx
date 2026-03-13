'use client'

// ---------------------------------------------------------------------------
// BookNowAuthModal.tsx — Modal de autenticación interceptado al hacer BOOK NOW
//
// Se muestra cuando un usuario no autenticado intenta reservar.
// Opciones:
//   1. Google OAuth (redirige preservando returnUrl)
//   2. Sign in  → /auth?tab=login&returnUrl=...
//   3. Register → /auth?tab=register&returnUrl=...
//   4. Continue as guest → onContinueAsGuest()
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef } from 'react'
import { FiGift, FiStar, FiX } from 'react-icons/fi'
import { Typography } from '@/design-system/components/Typography'

interface BookNowAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onRegister: () => void
  onContinueAsGuest: () => void
}

const EXCLUSIVE_BENEFITS = [
  { icon: FiGift, text: 'Create your account to unlock Vimex rewards and faster booking' },
  { icon: FiStar, text: 'Save your details for future stays and reservation updates' },
]

export function BookNowAuthModal({
  isOpen,
  onClose,
  onRegister,
  onContinueAsGuest,
}: BookNowAuthModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  // Focus the close button when modal opens
  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus()
    }
  }, [isOpen])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-now-modal-title"
        className="relative w-full max-w-md animate-[fadeInUp_0.22s_ease-out] rounded-t-3xl border border-white/70 bg-mist-gradient p-6 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 sm:rounded-2xl"
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/8 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FiX className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Header */}
        <header className="mb-5 pr-8">
          <Typography as="h2" id="book-now-modal-title" variant="h4" className="text-ink">
            Register with us and unlock rewards
          </Typography>
          <p className="mt-1 text-sm text-ink-soft">
            Create your account to continue faster, keep your details saved, and access member-only perks on future stays.
          </p>
        </header>

        {/* Benefits list */}
        <ul className="mb-5 space-y-2">
          {EXCLUSIVE_BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-ink">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onRegister}
            className="flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Register now
          </button>
        </div>

        {/* Guest option */}
        <div className="mt-4 border-t border-ink/8 pt-4 text-center">
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-sm text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  )
}
