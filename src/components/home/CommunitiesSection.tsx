import { Container } from '@/design-system/components/Container'
import { Section } from '@/design-system/components/Section'
import { Typography } from '@/design-system/components/Typography'

const PARALLAX_IMAGE =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=80'

export function CommunitiesSection() {
  return (
    <>
      {/* Communities */}
      <Section aria-labelledby="communities-heading" className="bg-slate-50 py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
                alt="Playa del Carmen beachfront community"
                className="h-full w-full object-cover"
                style={{ aspectRatio: '4/3' }}
                loading="lazy"
              />
            </div>
            <div className="space-y-5">
              <Typography as="h2" variant="h2" id="communities-heading">
                Playa del Carmen Communities
              </Typography>
              <Typography className="text-base leading-relaxed md:text-lg">
                It is our pleasure to assist you in locating the perfect Riviera Maya vacation
                property in downtown Playa del Carmen, from famed 5th Avenue (La Quinta Avenida),
                Playa&apos;s pedestrian walkway lined with an impressive selection of international
                restaurants, cafes, shops, nightlife, hotels, and malls. Favorite communities
                include Playacar Fase 1, Playacar Fase 2, Coco Bay, Mamitas Beach and the Little
                Italy sections of town, just to mention a few.
              </Typography>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why Vimex parallax */}
      <section
        aria-labelledby="why-parallax-heading"
        className="relative overflow-hidden py-24 text-white md:py-32"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${PARALLAX_IMAGE})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-900/70" />
        <Container>
          <div className="mx-auto max-w-[760px]">
            <div className="rounded-2xl border border-white/30 bg-white/20 p-8 text-center shadow-xl backdrop-blur-lg md:p-12">
              <Typography as="h2" variant="h2" id="why-parallax-heading" className="text-slate-900">
                Why <span className="text-brand-teal">Vimex</span>??
              </Typography>
              <Typography className="mt-4 text-base leading-relaxed text-slate-800 md:text-lg">
                When you vacation in one of our rentals, from start to finish, you will enjoy personal
                attention by our dedicated bilingual Vimex Vacation Rentals staff, who enjoy sharing
                their knowledge of the Riviera Maya, historic attractions, eateries and activities —
                not just in Playa, but from Cancun down through the Mayan Riviera including Akumal
                and Tulum. If you wish to relax, we will pamper you by recommending the best Spa
                options. If you prefer to stay active, dive, zipline or marvel at the ruins — we
                know all the adventure tours in and about the area. If experiencing great cuisine is
                your thing, we have a list of favorites that will keep you coming back for more.
              </Typography>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
