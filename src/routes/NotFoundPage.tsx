import { ButtonLink } from '@/design-system/components/ButtonLink'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'

export function NotFoundPage() {
  return (
    <main className="pb-section pt-28">
      <Container className="py-16">
        <section className="rounded-2xl border border-white/70 bg-white/70 p-8 text-center shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 md:p-12">
          <Typography as="p" variant="caption" className="text-ink-soft">
            Error 404
          </Typography>
          <Typography as="h1" variant="h2" className="mt-2 text-ink">
            Page not found
          </Typography>
          <Typography className="mx-auto mt-4 max-w-[52ch] text-base text-ink-soft md:text-lg">
            The page you requested does not exist or may have moved. You can return to the homepage or continue browsing residences.
          </Typography>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/" variant="hero" size="md" className="liquid-click--hero">
              Back to Home
            </ButtonLink>
            <ButtonLink href="/residences" variant="ghost" size="md" className="border border-white/45 bg-white/55 text-ink hover:bg-white/75">
              Explore Residences
            </ButtonLink>
          </div>
        </section>
      </Container>
    </main>
  )
}
