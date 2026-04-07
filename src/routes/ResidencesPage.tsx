import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ResidenceCard } from '@/components/home/ResidenceCard'
import { ResidenceCardSkeleton } from '@/components/residences/ResidenceCardSkeleton'
import { ResidencesFiltersModal } from '@/components/residences/ResidencesFiltersModal'
import { ResidencesResultsToolbar } from '@/components/residences/ResidencesResultsToolbar'
import type { ViewportChangeSource } from '@/components/residences/ResidencesMapPanel'
import { ButtonLink } from '@/design-system/components/ButtonLink'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { useBooking } from '@/context/booking-context'
import { useResidences } from '@/hooks/useResidences'
import { useUI } from '@/hooks/useUI'
import { useUrlSearchParams } from '@/hooks/useUrlSearchParams'
import { getGuestTotal, parseGuestDetailsFromSearchParams, writeGuestDetailsToSearchParams } from '@/lib/guestDetails'
import type { ResidenceFilters } from '@/services/residenceService'
import { DEFAULT_GUEST_DETAILS, type GuestDetails } from '@/types/guests'
import type { ResidenceListing } from '@/types/content'

const DEFAULT_DESTINATION = 'Playa del Carmen'
const PRICE_FILTER_DEBOUNCE_MS = 180

const ResidencesMapPanel = dynamic(
  () => import('@/components/residences/ResidencesMapPanel').then((module) => module.ResidencesMapPanel),
  {
    ssr: false,
    loading: () => (
      <aside className="order-2 rounded-2xl border border-card-border bg-white/70 p-6 shadow-soft xl:order-2" aria-label="Map panel loading">
        <Typography as="h2" variant="h2">
          Map View
        </Typography>
        <Typography className="mt-2 text-ink-soft">Loading map...</Typography>
      </aside>
    ),
  },
)

function buildFiltersFromSearchParams(searchParams: URLSearchParams): ResidenceFilters {
  const guestDetails = parseGuestDetailsFromSearchParams(searchParams)
  const hasGuestCapacityFilter =
    searchParams.has('guests') || searchParams.has('adults') || searchParams.has('children') || searchParams.has('infants')

  return {
    destination: searchParams.get('destination') || undefined,
    category: searchParams.get('category') || undefined,
    location: searchParams.get('zone') || searchParams.get('location') || undefined,
    bedsMin: searchParams.get('beds') ? Number.parseInt(searchParams.get('beds')!.replace('+', ''), 10) : undefined,
    guestsMin: hasGuestCapacityFilter ? getGuestTotal(guestDetails) : undefined,
    guestDetails,
    petsAllowed: searchParams.get('pets') === 'true',
    priceMin: searchParams.get('priceMin') ? Number.parseInt(searchParams.get('priceMin')!, 10) : undefined,
    priceMax: searchParams.get('priceMax') ? Number.parseInt(searchParams.get('priceMax')!, 10) : undefined,
    flexibleCheckin: searchParams.get('flexibleCheckin') === 'true',
    checkin: searchParams.get('checkin') || undefined,
    checkout: searchParams.get('checkout') || undefined,
    amenities: searchParams.getAll('amenity'),
    quickFilters: searchParams.getAll('quick'),
  }
}

function getUniqueFilterValues(items: ResidenceListing[], key: 'destination' | 'category'): string[] {
  return Array.from(new Set(items.map((item) => item[key]))).sort()
}

function sortResidences(residences: ResidenceListing[], sortValue: string): ResidenceListing[] {
  const next = [...residences]

  if (sortValue === 'price-asc') {
    next.sort((a, b) => a.nightlyRateUsd - b.nightlyRateUsd)
  } else if (sortValue === 'price-desc') {
    next.sort((a, b) => b.nightlyRateUsd - a.nightlyRateUsd)
  } else if (sortValue === 'guests-desc') {
    next.sort((a, b) => b.guests - a.guests)
  } else if (sortValue === 'beds-desc') {
    next.sort((a, b) => b.beds - a.beds)
  }

  return next
}

function countActiveFilters(filters: ResidenceFilters): number {
  let total = 0

  if (filters.checkin) total += 1
  if (filters.checkout) total += 1
  if (filters.flexibleCheckin) total += 1
  if (filters.bedsMin) total += 1
  if (filters.guestsMin) total += 1
  if (filters.petsAllowed) total += 1
  if (filters.destination) total += 1
  if (filters.category) total += 1
  if (filters.location) total += 1
  if (filters.priceMin) total += 1
  if (filters.priceMax) total += 1
  total += filters.amenities?.length ?? 0
  total += filters.quickFilters?.length ?? 0

  return total
}

export function ResidencesPage() {
  const [searchParams, setSearchParams] = useUrlSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [visibleResidenceIds, setVisibleResidenceIds] = useState<string[] | null>(null)
  const [isMapViewportFiltering, setIsMapViewportFiltering] = useState<boolean>(false)
  const pageSize = 6
  const hasInitializedDefaultDestinationRef = useRef<boolean>(false)
  const mapViewportFilterTimeoutRef = useRef<number | null>(null)
  const priceFilterDebounceTimeoutRef = useRef<number | null>(null)
  const resultsTopRef = useRef<HTMLDivElement | null>(null)
  const { isFiltersPanelOpen, openFiltersPanel, closeFiltersPanel } = useUI()
  const { setSelectedRange, setSelectedGuestDetails } = useBooking()

  const filters = useMemo(() => buildFiltersFromSearchParams(searchParams), [searchParams])
  const sortValue = searchParams.get('sort') ?? 'price-asc'

  const { residences, isLoading, error: fetchError } = useResidences(filters)
  const { residences: allResidences } = useResidences({})

  useEffect(() => {
    if (hasInitializedDefaultDestinationRef.current) {
      return
    }

    hasInitializedDefaultDestinationRef.current = true

    if (searchParams.get('destination')) {
      return
    }

    const next = new URLSearchParams(searchParams)
    next.set('destination', DEFAULT_DESTINATION)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    setSelectedRange({
      from: filters.checkin,
      to: filters.checkout,
    })
  }, [filters.checkin, filters.checkout, setSelectedRange])

  useEffect(() => {
    setSelectedGuestDetails(filters.guestDetails ?? DEFAULT_GUEST_DETAILS)
  }, [filters.guestDetails, setSelectedGuestDetails])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const sortedResidences = useMemo(() => sortResidences(residences, sortValue), [residences, sortValue])
  const residencesWithinMapView = useMemo(() => {
    if (!visibleResidenceIds) {
      return sortedResidences
    }

    const visibleSet = new Set(visibleResidenceIds)
    return sortedResidences.filter((residence) => visibleSet.has(residence.id))
  }, [sortedResidences, visibleResidenceIds])

  const totalPages = Math.max(1, Math.ceil(residencesWithinMapView.length / pageSize))
  const paginatedResidences = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return residencesWithinMapView.slice(start, start + pageSize)
  }, [residencesWithinMapView, currentPage])

  const destinationOptions = useMemo(() => getUniqueFilterValues(allResidences, 'destination'), [allResidences])
  const categoryOptions = useMemo(() => getUniqueFilterValues(allResidences, 'category'), [allResidences])

  const handleVisibleResidencesChange = useCallback((nextVisibleIds: string[], source: ViewportChangeSource) => {
    // Do not apply map viewport filtering on initial/programmatic map moves.
    if (source === 'initial') {
      return
    }

    let hasChanged = false

    setVisibleResidenceIds((currentVisibleIds) => {
      if (
        currentVisibleIds &&
        currentVisibleIds.length === nextVisibleIds.length &&
        currentVisibleIds.every((value, index) => value === nextVisibleIds[index])
      ) {
        return currentVisibleIds
      }

      hasChanged = true
      return nextVisibleIds
    })

    if (!hasChanged) {
      return
    }

    setIsMapViewportFiltering(true)

    if (mapViewportFilterTimeoutRef.current) {
      window.clearTimeout(mapViewportFilterTimeoutRef.current)
    }

    mapViewportFilterTimeoutRef.current = window.setTimeout(() => {
      setIsMapViewportFiltering(false)
      mapViewportFilterTimeoutRef.current = null
    }, 220)
  }, [])

  const updateSingleParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)

    if (!value) {
      next.delete(key)
    } else {
      next.set(key, value)
    }

    setSearchParams(next, { replace: true })
  }

  const updateMultiParam = (key: 'amenity' | 'quick', value: string, checked: boolean) => {
    const next = new URLSearchParams(searchParams)
    const currentValues = new Set(next.getAll(key))

    if (checked) {
      currentValues.add(value)
    } else {
      currentValues.delete(value)
    }

    next.delete(key)
    currentValues.forEach((currentValue) => next.append(key, currentValue))
    setSearchParams(next, { replace: true })
  }

  const updateDateRangeParams = (range: { from?: string; to?: string }) => {
    const next = new URLSearchParams(searchParams)

    if (!range.from) {
      next.delete('checkin')
    } else {
      next.set('checkin', range.from)
    }

    if (!range.to) {
      next.delete('checkout')
    } else {
      next.set('checkout', range.to)
    }

    setSearchParams(next, { replace: true })
  }

  const updateGuestParams = (guestDetails: GuestDetails) => {
    const next = new URLSearchParams(searchParams)
    writeGuestDetailsToSearchParams(next, guestDetails)
    setSearchParams(next, { replace: true })
  }

  const updatePriceRangeParams = (range: { min?: number; max?: number }) => {
    if (priceFilterDebounceTimeoutRef.current) {
      window.clearTimeout(priceFilterDebounceTimeoutRef.current)
    }

    priceFilterDebounceTimeoutRef.current = window.setTimeout(() => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)

          if (!range.min) {
            next.delete('priceMin')
          } else {
            next.set('priceMin', String(range.min))
          }

          if (!range.max) {
            next.delete('priceMax')
          } else {
            next.set('priceMax', String(range.max))
          }

          return next
        },
        { replace: true },
      )
    }, PRICE_FILTER_DEBOUNCE_MS)
  }

  const clearAllFilters = () => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      ;[
        'destination',
        'category',
        'zone',
        'location',
        'beds',
        'guests',
        'adults',
        'children',
        'infants',
        'pets',
        'priceMin',
        'priceMax',
        'flexibleCheckin',
        'checkin',
        'checkout',
        'amenity',
        'quick',
      ].forEach((key) => next.delete(key))
      return next
    }, { replace: true })
  }

  useEffect(() => {
    setVisibleResidenceIds(null)
    setIsMapViewportFiltering(false)
  }, [sortedResidences])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    return () => {
      if (mapViewportFilterTimeoutRef.current) {
        window.clearTimeout(mapViewportFilterTimeoutRef.current)
      }

      if (priceFilterDebounceTimeoutRef.current) {
        window.clearTimeout(priceFilterDebounceTimeoutRef.current)
      }
    }
  }, [])

  const activeFiltersCount = useMemo(() => countActiveFilters(filters), [filters])
  const showResidenceSkeletons = isLoading || isMapViewportFiltering

  const scrollToResultsTop = () => {
    resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goToPreviousPage = () => {
    setCurrentPage((currentPageValue) => {
      const nextPage = Math.max(1, currentPageValue - 1)
      if (nextPage !== currentPageValue) {
        requestAnimationFrame(scrollToResultsTop)
      }
      return nextPage
    })
  }

  const goToNextPage = () => {
    setCurrentPage((currentPageValue) => {
      const nextPage = Math.min(totalPages, currentPageValue + 1)
      if (nextPage !== currentPageValue) {
        requestAnimationFrame(scrollToResultsTop)
      }
      return nextPage
    })
  }

  return (
    <>
      <section className="relative isolate overflow-hidden pb-16 pt-28 text-white">
        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80"
          alt="Turquoise Caribbean shoreline with palm trees in Playa del Carmen"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,46,97,0.55),rgba(7,18,45,0.82))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/55" />
        <Container className="relative z-10 space-y-4">
          <Typography as="p" variant="caption" className="text-white/80">
            Search Results
          </Typography>
          <Typography as="h1" variant="display" className="max-w-4xl">
            Luxury vacation rentals in Playa del Carmen
          </Typography>
          <Typography className="max-w-3xl text-lg text-white/85 md:text-xl">
            Filter by dates, amenities, and capacity to secure the perfect stay.
          </Typography>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink
              href="#booking-filters"
              variant="hero"
              size="lg"
              className="liquid-click--hero"
              aria-label="Jump to booking filters"
            >
              Go to Booking
            </ButtonLink>
          </div>
        </Container>
      </section>

      <main className="pb-section pt-10">
        <Container>
          <div id="booking-filters" className="grid gap-6 scroll-mt-28 xl:grid-cols-3">
            <section className="order-1 xl:order-1 xl:col-span-2" aria-label="Residences results">
              <div ref={resultsTopRef} />
              <ResidencesResultsToolbar
                isLoading={isLoading}
                totalResults={residencesWithinMapView.length}
                activeFiltersCount={activeFiltersCount}
                destinationOptions={destinationOptions}
                selectedDestination={filters.destination ?? 'All'}
                guestDetails={filters.guestDetails ?? DEFAULT_GUEST_DETAILS}
                dateRange={{ from: filters.checkin, to: filters.checkout }}
                onOpenFilters={openFiltersPanel}
                onDestinationChange={(value) => updateSingleParam('destination', value)}
                onGuestDetailsChange={updateGuestParams}
                onDateRangeChange={updateDateRangeParams}
              />

              {fetchError ? (
                <div className="mt-8 rounded-xl border border-card-border bg-white/60 p-8 text-center">
                  <Typography as="p" className="text-lg">
                    Could not connect to the server. Please try again later.
                  </Typography>
                </div>
              ) : showResidenceSkeletons ? (
                <div className="mt-8 grid gap-4 md:grid-cols-2" aria-live="polite" aria-label="Loading filtered properties">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ResidenceCardSkeleton key={`residence-skeleton-${index}`} />
                  ))}
                </div>
              ) : sortedResidences.length === 0 ? (
                <div className="mt-8 rounded-xl border border-card-border bg-white/60 p-8 text-center">
                  <Typography as="p" className="text-lg">
                    No properties match the selected filters.
                  </Typography>
                </div>
              ) : residencesWithinMapView.length === 0 ? (
                <div className="mt-8 rounded-xl border border-card-border bg-white/60 p-8 text-center">
                  <Typography as="p" className="text-lg">
                    No properties are visible in the current map area.
                  </Typography>
                </div>
              ) : (
                <>
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {paginatedResidences.map((residence) => (
                      <ResidenceCard
                        key={residence.id}
                        residence={residence}
                        checkin={filters.checkin}
                        checkout={filters.checkout}
                        guestDetails={filters.guestDetails}
                      />
                    ))}
                  </div>

                  <nav
                    aria-label="Results pagination"
                    className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-white/60 bg-white/58 px-4 py-3 shadow-soft backdrop-blur-xl md:flex-row md:justify-between"
                  >
                    <Typography className="text-sm text-ink-soft">
                      Page {currentPage} of {totalPages}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="liquid-click liquid-click--nav rounded-pill border border-white/55 bg-white/35 px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <div className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-ink shadow-inner">{currentPage}</div>
                      <button
                        type="button"
                        className="liquid-click liquid-click--nav rounded-pill border border-white/55 bg-white/35 px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </nav>
                </>
              )}
            </section>

            <ResidencesMapPanel
              residences={sortedResidences}
              checkin={filters.checkin}
              checkout={filters.checkout}
              guestDetails={filters.guestDetails}
              onVisibleResidencesChange={handleVisibleResidencesChange}
            />
          </div>
        </Container>
      </main>

      <ResidencesFiltersModal
        isOpen={isFiltersPanelOpen}
        filters={filters}
        availablePrices={allResidences.map((residence) => residence.nightlyRateUsd)}
        filteredResultsCount={residencesWithinMapView.length}
        isLoadingResults={isLoading}
        destinationOptions={destinationOptions}
        categoryOptions={categoryOptions}
        updateSingleParam={updateSingleParam}
        updateGuestParams={updateGuestParams}
        updatePriceRangeParams={updatePriceRangeParams}
        updateMultiParam={updateMultiParam}
        clearAllFilters={clearAllFilters}
        onClose={closeFiltersPanel}
      />
    </>
  )
}
