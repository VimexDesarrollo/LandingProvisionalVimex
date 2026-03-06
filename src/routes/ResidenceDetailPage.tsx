import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FaBath, FaBed } from 'react-icons/fa'
import { FiHome, FiUsers } from 'react-icons/fi'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BookingPanel } from '@/components/residences/BookingPanel'
import { ResidenceDetailSkeleton } from '@/components/residences/ResidenceDetailSkeleton'
import { ResidenceDetailSections } from '@/components/residences/ResidenceDetailSections'
import { ResidencePhotoGallery } from '@/components/residences/ResidencePhotoGallery'
import { useBooking } from '@/context/booking-context'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { usePricing } from '@/hooks/usePricing'
import { useResidenceDetail } from '@/hooks/useResidenceDetail'
import { useUI } from '@/hooks/useUI'
import { parseGuestDetailsFromSearchParams, writeGuestDetailsToSearchParams } from '@/lib/guestDetails'
import type { ResidenceDetail } from '@/types/content'

function parseIntegerFromDetailValue(value: string | undefined): number | null {
  if (!value) {
    return null
  }

  const parsedValue = Number.parseInt(value, 10)
  if (!Number.isFinite(parsedValue)) {
    return null
  }

  return parsedValue
}

function countNights(from: string | undefined, to: string | undefined): number {
  if (!from || !to) return 0
  const start = new Date(from)
  const end = new Date(to)
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000))
}

function getRoomMetric(items: ResidenceDetail['roomDetailsSection']['items'], label: 'Bedrooms' | 'Bathrooms'): number | null {
  const matchedItem = items.find((item) => item.label === label)
  return parseIntegerFromDetailValue(matchedItem?.value)
}

export function ResidenceDetailPage() {
  const params = useParams<{ slug: string }>()
  const slugParam = params?.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { residence, isLoading, error } = useResidenceDetail(slug)
  const { showNotification } = useUI()

  const { selectedRange, setSelectedRange, selectedGuestDetails, setSelectedGuestDetails } = useBooking()
  const { pricing, isLoading: isPricingLoading } = usePricing(slug, selectedRange.from, selectedRange.to)
  const [hasHydratedBookingState, setHasHydratedBookingState] = useState<boolean>(false)

  // Initialise context from URL params on first mount.
  // This runs inside the loading skeleton so there is no visible flash.
  useEffect(() => {
    const from = searchParams.get('checkin') ?? undefined
    const to = searchParams.get('checkout') ?? undefined
    const hasGuestParams =
      searchParams.has('guests') ||
      searchParams.has('adults') ||
      searchParams.has('children') ||
      searchParams.has('infants') ||
      searchParams.has('pets')

    if (from || to) {
      setSelectedRange({ from, to })
    }

    if (hasGuestParams) {
      const guestDetailsFromUrl = parseGuestDetailsFromSearchParams(new URLSearchParams(searchParams.toString()))
      setSelectedGuestDetails(guestDetailsFromUrl)
    }

    setHasHydratedBookingState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false)
  const bookingPanelWrapperRef = useRef<HTMLDivElement | null>(null)
  const panelTopBeforeDockChangeRef = useRef<number | null>(null)

  useEffect(() => {
    const footer = document.getElementById('site-footer')

    if (!footer) {
      setIsFooterVisible(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible((current) => {
          if (current === entry.isIntersecting) {
            return current
          }

          if (typeof window !== 'undefined' && window.innerWidth >= 1024 && bookingPanelWrapperRef.current) {
            panelTopBeforeDockChangeRef.current = bookingPanelWrapperRef.current.getBoundingClientRect().top
          }

          return entry.isIntersecting
        })
      },
      {
        root: null,
        threshold: 0,
      },
    )

    observer.observe(footer)

    return () => {
      observer.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) {
      panelTopBeforeDockChangeRef.current = null
      return
    }

    const panelElement = bookingPanelWrapperRef.current
    const previousTop = panelTopBeforeDockChangeRef.current

    if (!panelElement || previousTop === null) {
      return
    }

    panelTopBeforeDockChangeRef.current = null
    const nextTop = panelElement.getBoundingClientRect().top
    const deltaY = previousTop - nextTop

    if (Math.abs(deltaY) < 1) {
      return
    }

    const travelDistancePx = Math.abs(deltaY)
    const animationDurationMs = Math.min(760, Math.max(520, 400 + travelDistancePx * 0.75))

    const animation = panelElement.animate(
      [
        { transform: `translateY(${deltaY}px)` },
        { transform: 'translateY(0)' },
      ],
      {
        duration: animationDurationMs,
        easing: 'cubic-bezier(0.2, 0.72, 0.2, 1)',
      },
    )

    return () => {
      animation.cancel()
    }
  }, [isFooterVisible])

  useEffect(() => {
    if (!hasHydratedBookingState) {
      return
    }

    const params = new URLSearchParams()
    if (selectedRange.from) params.set('checkin', selectedRange.from)
    if (selectedRange.to) params.set('checkout', selectedRange.to)
    writeGuestDetailsToSearchParams(params, selectedGuestDetails)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydratedBookingState, selectedRange, selectedGuestDetails])

  useEffect(() => {
    if (!selectedRange.from || !selectedRange.to) {
      return
    }

    const minNightsRequired = Math.max(1, residence?.minNights ?? 1)
    const selectedNights = countNights(selectedRange.from, selectedRange.to)
    const isTooShort = selectedNights > 0 && selectedNights < minNightsRequired

    if (isTooShort) {
      showNotification(`Minimum stay for this residence is ${minNightsRequired} ${minNightsRequired === 1 ? 'night' : 'nights'}.`, 'info')
      setSelectedRange({ from: undefined, to: undefined })
    }
  }, [residence?.minNights, selectedRange.from, selectedRange.to, setSelectedRange, showNotification])

  if (isLoading) {
    return <ResidenceDetailSkeleton />
  }

  if (error || !residence) {
    return (
      <main className="pb-section pt-44">
        <Container>
          <Typography as="h1" variant="h2">
            {error ? 'Could not connect to the server. Please try again later.' : 'Residence Not Found'}
          </Typography>
        </Container>
      </main>
    )
  }

  const roomsCount = getRoomMetric(residence.roomDetailsSection.items, 'Bedrooms') ?? Math.max(1, Math.ceil(residence.beds / 2))
  const bathroomsCount = getRoomMetric(residence.roomDetailsSection.items, 'Bathrooms') ?? Math.max(1, Math.ceil(roomsCount / 2))
  const detailForSections: ResidenceDetail = residence
  const residenceFacts = [
    {
      key: 'guests',
      label: 'Guests',
      value: residence.guests,
      icon: <FiUsers aria-hidden className="h-4.5 w-4.5 text-accent" />,
    },
    {
      key: 'rooms',
      label: 'Rooms',
      value: roomsCount,
      icon: <FiHome aria-hidden className="h-4.5 w-4.5 text-accent" />,
    },
    {
      key: 'beds',
      label: 'Beds',
      value: residence.beds,
      icon: <FaBed aria-hidden className="h-4 w-4 text-accent" />,
    },
    {
      key: 'bathrooms',
      label: 'Bathrooms',
      value: bathroomsCount,
      icon: <FaBath aria-hidden className="h-4 w-4 text-accent" />,
    },
  ]

  return (
    <main className="pb-section pt-48 md:pt-50 lg:pt-52">
      <Container>
        <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8 xl:grid-cols-[1fr_24rem]">

          <div className="space-y-4">
            <header className="relative overflow-hidden rounded-2xl border border-white/70 bg-mist-gradient p-4 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(255,255,255,0.84),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(175,198,242,0.3),transparent_42%)]" />
              <div className="relative">
                <Typography as="h1" variant="h3" className="leading-tight text-ink">
                  {residence.name}
                </Typography>
                <Typography className="mt-1 text-sm text-ink-soft md:text-base">{residence.location}</Typography>
              </div>
            </header>
            <ResidencePhotoGallery
              residenceName={residence.name}
              imageUrl={residence.imageUrl}
              imageGallery={residence.imageGallery}
            />
            <section className="rounded-2xl border border-card-border/80 bg-white/62 p-3 shadow-soft backdrop-blur-sm md:p-4" aria-label="Residence facts">
              <Typography className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                Main features
              </Typography>
              <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                {residenceFacts.map((fact) => (
                  <li
                    key={fact.key}
                    className="group relative overflow-hidden rounded-xl border border-white/75 bg-white/72 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-18px_rgba(23,56,123,0.35)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(54,88,171,0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex items-center gap-2.5 px-3 py-2.5 md:px-3.5 md:py-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/15 bg-accent/10">
                        {fact.icon}
                      </span>
                      <div className="min-w-0 flex items-baseline gap-1.5">
                        <Typography className="text-lg font-semibold leading-none text-ink md:text-xl">{fact.value}</Typography>
                        <Typography className="truncate text-[11px] uppercase tracking-[0.09em] text-ink-soft">{fact.label}</Typography>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <ResidenceDetailSections detail={detailForSections} />
          </div>

          <div className="mt-4 lg:relative lg:mt-0 lg:self-stretch">
            <div
              ref={bookingPanelWrapperRef}
              className={
                isFooterVisible
                  ? 'lg:absolute lg:bottom-0 lg:right-0 lg:w-[22rem] lg:will-change-transform xl:w-[24rem]'
                  : 'lg:fixed lg:top-52 lg:z-30 lg:w-[22rem] lg:right-[max(2rem,calc((100vw-1200px)/2+2rem))] lg:will-change-transform xl:w-[24rem]'
              }
            >
              <BookingPanel
                nightlyRateUsd={residence.nightlyRateUsd}
                promotionalNightlyRateUsd={residence.promotionalNightlyRateUsd}
                maxGuests={residence.guests}
                minNights={residence.minNights}
                selectedRange={selectedRange}
                selectedGuestDetails={selectedGuestDetails}
                onGuestDetailsChange={setSelectedGuestDetails}
                onDateRangeChange={setSelectedRange}
                pricing={pricing}
                isPricingLoading={isPricingLoading}
              />
            </div>
          </div>

        </div>
      </Container>
    </main>
  )
}
