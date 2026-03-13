import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa6'
import { FiCompass, FiHome, FiKey, FiMail } from 'react-icons/fi'
import Link from 'next/link'
import { HeaderUserButton } from '@/components/auth/HeaderUserButton'
import { Container } from '@/design-system/components/Container'
import { ButtonLink } from '@/design-system/components/ButtonLink'
import { cn } from '@/lib/cn'
import { runLiquidClickFromKeyboard, runLiquidClickFromMouse } from '@/lib/liquidClick'
import type { Cta, HeaderContent } from '@/types/content'

interface SiteHeaderProps {
  content: HeaderContent
  ctas: {
    primary: Cta
    secondary: Cta
  }
}

function HeaderMenuIcon({ itemId }: { itemId: string }) {
  if (itemId === 'residences') {
    return <FiHome aria-hidden className="h-4 w-4" />
  }

  if (itemId === 'whatsapp') {
    return <FaWhatsapp aria-hidden className="h-4 w-4" />
  }

  if (itemId === 'contact') {
    return <FiMail aria-hidden className="h-4 w-4" />
  }

  return <FiHome aria-hidden className="h-4 w-4" />
}

function getCompactMenuLabel(label: string): string {
  const compactLabel = label.trim().split(/\s+/)[0]
  return compactLabel || label
}

export function SiteHeader({ content, ctas }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const normalizePath = (path: string) => {
    const trimmed = path.trim()
    if (trimmed === '/') {
      return '/'
    }
    return trimmed.replace(/\/+$/, '')
  }
  const primaryCtaPath = normalizePath(ctas.primary.href)
  const navItems = content.menuItems
    .map((item) => {
      if (item.id === 'services') {
        return {
          ...item,
          id: 'whatsapp',
          label: 'WhatsApp',
          href: 'https://wa.me/529848032231?text=Hello%20Vimex%2C%20I%20want%20help%20with%20a%20reservation',
        }
      }

      return item
    })
    .filter((item) => {
      const itemPath = normalizePath(item.href)
      return itemPath !== '/' && itemPath !== primaryCtaPath
    })

  const isExternalHref = (href: string) => /^https?:\/\//.test(href)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      setIsMenuOpen(false)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-400',
        isScrolled ? 'pt-3' : 'pt-4',
      )}
      aria-label="Main navigation"
    >
      <Container>
        <div
          className={cn(
            'relative flex items-center justify-between rounded-xl px-4 py-3 md:px-6',
            'transition-all duration-400',
            isScrolled
              ? 'border border-white/55 bg-white/55 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/45'
              : 'border border-transparent bg-transparent',
          )}
        >
          <nav aria-label="Primary" className="ml-2 hidden flex-1 items-center gap-2 overflow-x-auto lg:flex">
            {navItems.map((item) => (
              isExternalHref(item.href) ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'nav-liquid liquid-click liquid-click--nav rounded-pill px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] whitespace-nowrap',
                    isScrolled ? 'text-ink' : 'text-white',
                  )}
                  aria-label={item.label}
                  onMouseDown={runLiquidClickFromMouse}
                  onKeyDown={runLiquidClickFromKeyboard}
                >
                  <span className="relative z-[1] inline-flex items-center gap-2">
                    <HeaderMenuIcon itemId={item.id} />
                    {getCompactMenuLabel(item.label)}
                  </span>
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'nav-liquid liquid-click liquid-click--nav rounded-pill px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] whitespace-nowrap',
                    isScrolled ? 'text-ink' : 'text-white',
                  )}
                  aria-label={item.label}
                  onMouseDown={runLiquidClickFromMouse}
                  onKeyDown={runLiquidClickFromKeyboard}
                >
                  <span className="relative z-[1] inline-flex items-center gap-2">
                    <HeaderMenuIcon itemId={item.id} />
                    {getCompactMenuLabel(item.label)}
                  </span>
                </Link>
              )
              ))}
          </nav>

          <Link href="/" className="inline-flex items-center gap-3 lg:absolute lg:left-1/2 lg:-translate-x-1/2" aria-label="Vimex home">
            <img src="/logo.svg" alt="Vimex" className="h-12 w-auto lg:h-14" loading="eager" decoding="async" />
          </Link>

          <button
            type="button"
            className="liquid-click liquid-click--nav inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/35 text-ink shadow-soft transition-colors duration-300 hover:bg-white/50 lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onMouseDown={runLiquidClickFromMouse}
            onKeyDown={runLiquidClickFromKeyboard}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="relative flex h-4 w-6 items-center justify-center">
              <span
                className={cn(
                  'absolute block h-[2px] w-6 rounded-full bg-ink transition-all duration-200',
                  isMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5',
                )}
              />
              <span
                className={cn(
                  'absolute block h-[2px] w-6 rounded-full bg-ink transition-all duration-200',
                  isMenuOpen ? 'opacity-0' : 'opacity-100',
                )}
              />
              <span
                className={cn(
                  'absolute block h-[2px] w-6 rounded-full bg-ink transition-all duration-200',
                  isMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5',
                )}
              />
            </span>
          </button>

          <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
            <ButtonLink
              aria-label={ctas.primary.label}
              href={ctas.primary.href}
              size="sm"
              variant="brand"
              className="min-w-40"
            >
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <FiCompass aria-hidden className="h-4 w-4" />
                {ctas.primary.label}
              </span>
            </ButtonLink>
            <ButtonLink
              aria-label={ctas.secondary.label}
              href={ctas.secondary.href}
              size="sm"
              variant="ghost"
              className={cn(
                'min-w-36 border border-white/45 backdrop-blur-sm',
                isScrolled ? 'bg-white/70 text-ink hover:bg-white/85' : 'bg-white/16 text-white hover:bg-white/26',
              )}
            >
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <FiKey aria-hidden className="h-4 w-4" />
                {ctas.secondary.label}
              </span>
            </ButtonLink>
            <HeaderUserButton isScrolled={isScrolled} />
          </div>
        </div>

        {isMenuOpen ? (
          <div className="mt-3 rounded-xl border border-white/60 bg-white/92 p-4 shadow-soft backdrop-blur-xl lg:hidden">
            <nav aria-label="Mobile primary navigation" className="flex flex-col gap-2">
              {navItems.map((item) => (
                isExternalHref(item.href) ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="nav-liquid liquid-click liquid-click--nav flex items-center justify-center rounded-lg px-3 py-2 text-center text-base font-semibold uppercase tracking-[0.07em] text-ink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <HeaderMenuIcon itemId={item.id} />
                      {getCompactMenuLabel(item.label)}
                    </span>
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="nav-liquid liquid-click liquid-click--nav flex items-center justify-center rounded-lg px-3 py-2 text-center text-base font-semibold uppercase tracking-[0.07em] text-ink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <HeaderMenuIcon itemId={item.id} />
                      {getCompactMenuLabel(item.label)}
                    </span>
                  </Link>
                )
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-card-border/70 pt-4">
              <ButtonLink
                aria-label={ctas.primary.label}
                href={ctas.primary.href}
                size="sm"
                variant="brand"
                className="w-full"
              >
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <FiCompass aria-hidden className="h-4 w-4" />
                  {ctas.primary.label}
                </span>
              </ButtonLink>
              <ButtonLink
                aria-label={ctas.secondary.label}
                href={ctas.secondary.href}
                size="sm"
                variant="ghost"
                className="w-full border border-card-border/80 bg-white/75 text-ink hover:bg-white"
              >
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <FiKey aria-hidden className="h-4 w-4" />
                  {ctas.secondary.label}
                </span>
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  )
}
