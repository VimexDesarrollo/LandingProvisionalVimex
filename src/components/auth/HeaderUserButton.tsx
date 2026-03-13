'use client'

// ---------------------------------------------------------------------------
// HeaderUserButton.tsx — Icono de usuario en el navbar
//
// Siempre muestra el icono de usuario.
// Al hacer click abre un dropdown con:
//   - No autenticado → "Sign in" link
//   - Autenticado    → nombre, email y "Sign out"
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react'
import { FiLogOut, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { buildAuthHref } from '@/lib/authNavigation'
import { cn } from '@/lib/cn'

interface HeaderUserButtonProps {
  isScrolled?: boolean
}

export function HeaderUserButton({ isScrolled = false }: HeaderUserButtonProps) {
  const { status, isAuthenticated, user, logout } = useAuth()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Construye el returnUrl con la URL actual para que después del login
  // el usuario regrese exactamente a donde estaba.
  const currentUrl  = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
  const signInHref  = buildAuthHref('login', currentUrl)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const onOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
    }
  }, [isOpen, close])

  if (status === 'loading') return null

  const userInitial = user?.firstName?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase()
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || ''

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Account menu"
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          isAuthenticated
            ? 'bg-accent border-accent/20 text-white text-sm font-bold hover:bg-accent/90'
            : isScrolled
              ? 'border-ink/15 bg-white/70 text-ink hover:bg-white'
              : 'border-white/45 bg-white/16 text-white hover:bg-white/26',
        )}
      >
        {isAuthenticated && userInitial
          ? userInitial
          : <FiUser aria-hidden className="h-4 w-4" />
        }
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 min-w-44 rounded-xl border border-white/70 bg-white/95 p-1.5 shadow-lg backdrop-blur-xl"
        >
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 border-b border-ink/8 mb-1">
                <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
                <p className="text-xs text-ink-soft truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={async () => { close(); await logout() }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FiLogOut aria-hidden className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <Link
              href={signInHref}
              role="menuitem"
              onClick={close}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <FiUser aria-hidden className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      ) : null}
    </div>
  )
}
