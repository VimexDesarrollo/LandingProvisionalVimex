'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/design-system/components/Button'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'

export function BookingRequestSuccessPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slugParam = params?.slug
  const residenceSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam
  const requestId = searchParams.get('requestId')

  return (
    <main className="pb-section pt-44">
      <Container>
        <section className="mx-auto max-w-3xl rounded-2xl border border-white/70 bg-mist-gradient p-8 text-center shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46">
          <Typography as="h1" variant="h3">
            Booking request sent
          </Typography>
          <Typography className="mt-3 text-base text-ink-soft">
            We received your request and the reservations team will contact you shortly with the next step.
          </Typography>
          {requestId ? (
            <Typography className="mt-4 text-sm font-medium text-ink-soft">
              Request reference: {requestId}
            </Typography>
          ) : null}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => router.push('/residences')}>View more residences</Button>
            {residenceSlug ? (
              <Button variant="ghost" onClick={() => router.push(`/residences/${residenceSlug}`)}>
                Back to residence
              </Button>
            ) : null}
          </div>
        </section>
      </Container>
    </main>
  )
}
