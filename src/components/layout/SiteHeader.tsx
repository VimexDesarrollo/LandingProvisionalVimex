'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/design-system/components/Container'
import { cn } from '@/lib/cn'
import { runLiquidClickFromKeyboard, runLiquidClickFromMouse } from '@/lib/liquidClick'
import type { HeaderContent } from '@/types/content'

interface SiteHeaderProps {
  content: HeaderContent
  ctas?: unknown
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

export function SiteHeader({ content }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      setIsMenuOpen(false)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinkClass = (isContact: boolean) =>
    cn(
      'nav-liquid liquid-click liquid-click--nav rounded-pill px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-colors duration-200',
      isContact
        ? 'bg-accent text-white hover:bg-accent-strong'
        : isScrolled
          ? 'text-ink'
          : 'text-white',
    )

  return (
    <header
      className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-400', isScrolled ? 'pt-3' : 'pt-4')}
      aria-label="Main navigation"
    >
      <Container>
        <div
          className={cn(
            'flex items-center justify-between rounded-xl px-4 py-3 md:px-6 transition-all duration-400',
            isScrolled
              ? 'border border-white/55 bg-white/55 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/45'
              : 'border border-transparent bg-transparent',
          )}
        >
          {/* Logo */}
          <Link href="/" aria-label="Vimex home" className="inline-flex items-center shrink-0">
            <img src="/logo.svg" alt="Vimex" className="h-12 w-auto lg:h-14" loading="eager" decoding="async" />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {content.menuItems.map((item) => {
              const isContact = item.id === 'contact'
              const sharedProps = {
                className: navLinkClass(isContact),
                'aria-label': item.label,
                onMouseDown: runLiquidClickFromMouse,
                onKeyDown: runLiquidClickFromKeyboard,
              }
              return isExternal(item.href) ? (
                <a key={item.id} href={item.href} target="_blank" rel="noreferrer" {...sharedProps}>
                  <span className="relative z-[1]">{item.label}</span>
                </a>
              ) : (
                <Link key={item.id} href={item.href} {...sharedProps}>
                  <span className="relative z-[1]">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="liquid-click liquid-click--nav inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/35 text-ink shadow-soft transition-colors duration-300 hover:bg-white/50 lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onMouseDown={runLiquidClickFromMouse}
            onKeyDown={runLiquidClickFromKeyboard}
            onClick={() => setIsMenuOpen((o) => !o)}
          >
            <span className="relative flex h-4 w-6 items-center justify-center">
              <span className={cn('absolute block h-[2px] w-6 rounded-full bg-ink transition-all duration-200', isMenuOpen ? 'rotate-45' : '-translate-y-1.5')} />
              <span className={cn('absolute block h-[2px] w-6 rounded-full bg-ink transition-all duration-200', isMenuOpen ? 'opacity-0' : 'opacity-100')} />
              <span className={cn('absolute block h-[2px] w-6 rounded-full bg-ink transition-all duration-200', isMenuOpen ? '-rotate-45' : 'translate-y-1.5')} />
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-3 rounded-xl border border-white/60 bg-white/92 p-4 shadow-soft backdrop-blur-xl lg:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
              {content.menuItems.map((item) => {
                const isContact = item.id === 'contact'
                const cls = cn(
                  'flex items-center justify-center rounded-lg px-3 py-2 text-center text-base font-semibold uppercase tracking-[0.07em] transition-colors',
                  isContact ? 'bg-accent text-white' : 'text-ink hover:bg-surface-muted',
                )
                return isExternal(item.href) ? (
                  <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className={cls} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.id} href={item.href} className={cls} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </Container>
    </header>
  )
}
