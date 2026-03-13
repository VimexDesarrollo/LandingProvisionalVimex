import Link from 'next/link'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import type { LegalPageContent } from '@/content/legal'

interface LegalPageLayoutProps {
  page: LegalPageContent
}

export function LegalPageLayout({ page }: LegalPageLayoutProps) {
  return (
    <main className="pb-section pt-28 md:pt-36">
      <Container>
        <article className="mx-auto max-w-4xl rounded-[2rem] border border-white/70 bg-white/75 px-6 py-8 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 md:px-10 md:py-12">
          <header className="border-b border-card-border/70 pb-8">
            <Typography as="p" variant="caption" className="text-ink-soft">
              Legal
            </Typography>
            <Typography as="h1" variant="h2" className="mt-3 text-balance text-ink md:text-[3.6rem]">
              {page.title}
            </Typography>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">
              Last updated: <time dateTime="2026-03-12">{page.updatedAt}</time>
            </p>
            <div className="mt-6 space-y-4">
              {page.intro.map((paragraph) => (
                <Typography key={paragraph} className="text-base leading-8 text-ink-soft md:text-lg">
                  {paragraph}
                </Typography>
              ))}
            </div>
          </header>

          <div className="mt-8 space-y-8 md:space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading} aria-labelledby={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                <Typography
                  as="h2"
                  variant="h3"
                  id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  className="text-[2rem] md:text-[2.4rem]"
                >
                  {section.heading}
                </Typography>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <Typography key={paragraph} className="text-base leading-8 text-ink-soft md:text-lg">
                      {paragraph}
                    </Typography>
                  ))}
                  {section.bullets ? (
                    <ul className="space-y-3 pl-5 text-base leading-8 text-ink-soft md:text-lg">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          {page.relatedLinks && page.relatedLinks.length > 0 ? (
            <aside className="mt-10 border-t border-card-border/70 pt-8" aria-labelledby="related-legal-pages">
              <Typography as="h2" id="related-legal-pages" className="font-display text-2xl font-semibold text-ink">
                Related legal pages
              </Typography>
              <nav aria-label="Related legal pages" className="mt-4 flex flex-wrap gap-3">
                {page.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-card-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>
          ) : null}
        </article>
      </Container>
    </main>
  )
}
