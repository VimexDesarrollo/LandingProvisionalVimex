import { FaFacebookF, FaInstagram, FaPinterestP } from 'react-icons/fa6'
import Link from 'next/link'
import type { FooterSocialLink, FooterContent } from '@/types/content'

interface SiteFooterProps {
  content: FooterContent
}

function SocialIcon({ icon }: { icon: FooterSocialLink['icon'] }) {
  if (icon === 'facebook') {
    return <FaFacebookF aria-hidden className="h-5 w-5" />
  }

  if (icon === 'instagram') {
    return <FaInstagram aria-hidden className="h-5 w-5" />
  }

  return <FaPinterestP aria-hidden className="h-5 w-5" />
}

function FooterLinkItem({ href, label }: { href: string; label: string }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className="text-lg text-white/95 transition-colors duration-300 hover:text-white" aria-label={label}>
        {label}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-lg text-white/95 transition-colors duration-300 hover:text-white"
      aria-label={label}
    >
      {label}
    </a>
  )
}

export function SiteFooter({ content }: SiteFooterProps) {
  return (
    <footer id="site-footer" className="relative mt-12 overflow-hidden text-white">
      <img src={content.backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,119,165,0.88),rgba(32,101,145,0.85),rgba(38,134,179,0.87))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_42%),radial-gradient(circle_at_85%_78%,rgba(255,255,255,0.13),transparent_46%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1.6fr_1fr_1fr] lg:gap-12">
          <div className="flex items-start lg:justify-center">
            <div
              className="flex h-40 w-40 items-center justify-center rounded-full border border-white/35 shadow-[0_22px_45px_-24px_rgba(5,24,56,0.72)]"
              style={{ backgroundColor: content.logoBadgeBackground }}
            >
              <img src="/logo.svg" alt="Vimex" className="h-16 w-auto" loading="lazy" decoding="async" />
            </div>
          </div>

          <div>
            <h3 className="border-b border-white/35 pb-2 font-display text-[2.6rem] leading-none text-white">{content.contact.title}</h3>
            <div className="mt-3 space-y-3 text-[1.5rem] leading-snug text-white/92">
              {content.contact.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-[1.5rem] leading-snug text-white/96">
              {content.contact.phones.map((phone) => (
                <p key={phone}>{phone}</p>
              ))}
              <a href={`mailto:${content.contact.email}`} className="inline-flex transition-colors duration-300 hover:text-white">
                {content.contact.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="border-b border-white/35 pb-2 font-display text-[2.6rem] leading-none text-white">{content.socialize.title}</h3>
            <div className="mt-5 flex items-center gap-4">
              {content.socialize.links.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="liquid-click liquid-click--nav inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/8 text-white transition-all duration-300 hover:bg-white/18"
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="border-b border-white/35 pb-2 font-display text-[2.6rem] leading-none text-white">{content.extraLinks.title}</h3>
            <nav aria-label="Footer quick links" className="mt-4 flex flex-col gap-2">
              {content.extraLinks.links.map((link) => (
                <FooterLinkItem key={link.id} href={link.href} label={link.label} />
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/30 pt-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div className="space-y-2 text-sm text-white/88">
            <p>{content.copyright}</p>
            <p>{content.legalText}</p>
          </div>

          <div>
            <h4 className="border-b border-white/35 pb-2 font-display text-[2.6rem] leading-none text-white">{content.rentalJump.title}</h4>
            <label className="sr-only" htmlFor="footer-rental-jump">
              {content.rentalJump.placeholder}
            </label>
            <select
              id="footer-rental-jump"
              defaultValue=""
              className="mt-4 h-12 w-full rounded-xl border border-white/45 bg-white/95 px-4 text-base text-ink outline-none transition-colors duration-300 focus:border-accent"
            >
              <option value="" disabled>
                {content.rentalJump.placeholder}
              </option>
              {content.rentalJump.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}
