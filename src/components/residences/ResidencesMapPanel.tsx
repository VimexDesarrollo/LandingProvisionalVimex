import { useCallback, useEffect, useRef } from 'react'
import { latLngBounds } from 'leaflet'
import { FiMapPin } from 'react-icons/fi'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { createPriceIcon, formatNightlyPrice, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, MAP_TILE_ATTRIBUTION, MAP_TILE_URL } from '@/components/residences/map.utils'
import { Typography } from '@/design-system/components/Typography'
import { writeGuestDetailsToSearchParams } from '@/lib/guestDetails'
import type { ResidenceListing } from '@/types/content'
import type { GuestDetails } from '@/types/guests'

const MARKER_OFFSETS: Array<[number, number]> = [
  [0, 0],
  [0.00012, -0.0001],
  [-0.00012, 0.0001],
  [0.0001, 0.00012],
  [-0.0001, -0.00012],
]

function getMarkerPosition(residence: ResidenceListing, index: number): [number, number] {
  const [latOffset, lonOffset] = MARKER_OFFSETS[index % MARKER_OFFSETS.length]
  return [residence.latitude + latOffset, residence.longitude + lonOffset]
}

export type ViewportChangeSource = 'initial' | 'interaction'

function AutoFitResidences({ residences }: { residences: ResidenceListing[] }) {
  const map = useMap()

  useEffect(() => {
    if (residences.length === 0) {
      map.setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM)
      return
    }

    if (residences.length === 1) {
      map.setView([residences[0].latitude, residences[0].longitude], 13)
      return
    }

    const bounds = latLngBounds(residences.map((item) => [item.latitude, item.longitude] as [number, number]))
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 })
  }, [map, residences])

  return null
}

interface MapVisibleResidencesObserverProps {
  residences: ResidenceListing[]
  onVisibleResidencesChange?: (ids: string[], source: ViewportChangeSource) => void
}

function MapVisibleResidencesObserver({ residences, onVisibleResidencesChange }: MapVisibleResidencesObserverProps) {
  const hasUserInteractionRef = useRef<boolean>(false)
  const map = useMapEvents({
    down: () => {
      hasUserInteractionRef.current = true
    },
    mousedown: () => {
      hasUserInteractionRef.current = true
    },
    dragstart: () => {
      hasUserInteractionRef.current = true
    },
    keydown: () => {
      hasUserInteractionRef.current = true
    },
    moveend: () => {
      emitVisibleResidences(hasUserInteractionRef.current ? 'interaction' : 'initial')
      hasUserInteractionRef.current = false
    },
    zoomend: () => {
      emitVisibleResidences(hasUserInteractionRef.current ? 'interaction' : 'initial')
      hasUserInteractionRef.current = false
    },
  })

  useEffect(() => {
    const container = map.getContainer()
    const markUserInteraction = () => {
      hasUserInteractionRef.current = true
    }

    // Capture interactions on Leaflet UI controls (+ / - zoom buttons) and gestures.
    container.addEventListener('pointerdown', markUserInteraction, true)
    container.addEventListener('wheel', markUserInteraction, { passive: true })
    container.addEventListener('touchstart', markUserInteraction, { passive: true })

    return () => {
      container.removeEventListener('pointerdown', markUserInteraction, true)
      container.removeEventListener('wheel', markUserInteraction)
      container.removeEventListener('touchstart', markUserInteraction)
    }
  }, [map])

  const emitVisibleResidences = useCallback((source: ViewportChangeSource) => {
    if (!onVisibleResidencesChange) {
      return
    }

    const bounds = map.getBounds()
    const visibleIds = residences
      .filter((residence, index) => {
        const markerPosition = getMarkerPosition(residence, index)
        return bounds.contains(markerPosition)
      })
      .map((residence) => residence.id)

    onVisibleResidencesChange(visibleIds, source)
  }, [map, onVisibleResidencesChange, residences])

  useEffect(() => {
    emitVisibleResidences('initial')
  }, [emitVisibleResidences])

  return null
}

interface ResidencesMapPanelProps {
  residences: ResidenceListing[]
  checkin?: string
  checkout?: string
  guestDetails?: GuestDetails
  onVisibleResidencesChange?: (ids: string[], source: ViewportChangeSource) => void
}

function sanitizePromotionalNightlyRate(baseNightlyRateUsd: number, promotionalNightlyRateUsd: number | undefined): number | undefined {
  if (!promotionalNightlyRateUsd || !Number.isFinite(promotionalNightlyRateUsd)) {
    return undefined
  }

  if (promotionalNightlyRateUsd <= 0 || promotionalNightlyRateUsd >= baseNightlyRateUsd) {
    return undefined
  }

  return Math.round(promotionalNightlyRateUsd)
}

function buildResidenceDetailHref(slug: string, checkin?: string, checkout?: string, guestDetails?: GuestDetails): string {
  const params = new URLSearchParams()

  if (checkin) {
    params.set('checkin', checkin)
  }

  if (checkout) {
    params.set('checkout', checkout)
  }

  if (guestDetails) {
    writeGuestDetailsToSearchParams(params, guestDetails)
  }

  const queryString = params.toString()
  return `/residences/${slug}${queryString ? `?${queryString}` : ''}`
}

export function ResidencesMapPanel({ residences, checkin, checkout, guestDetails, onVisibleResidencesChange }: ResidencesMapPanelProps) {
  return (
    <aside className="order-2 xl:order-2 xl:col-span-1" aria-label="Map view">
      <div className="rounded-xl border border-white/60 bg-white/58 p-4 shadow-soft backdrop-blur-xl xl:sticky xl:top-28">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Typography as="h2" variant="h3" className="text-3xl">
              Map View
            </Typography>
          </div>
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/65 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
            <FiMapPin aria-hidden className="h-4 w-4" />
            Live area
          </span>
        </div>
        <div className="mt-4 aspect-[4/5] overflow-hidden rounded-xl border border-white/70 bg-white/75">
          <MapContainer center={MAP_DEFAULT_CENTER} zoom={MAP_DEFAULT_ZOOM} className="h-full w-full" scrollWheelZoom>
            <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
            <AutoFitResidences residences={residences} />
            <MapVisibleResidencesObserver residences={residences} onVisibleResidencesChange={onVisibleResidencesChange} />
            {residences.map((residence, index) => {
              const promotionalNightlyRateUsd = sanitizePromotionalNightlyRate(
                residence.nightlyRateUsd,
                residence.promotionalNightlyRateUsd,
              )
              const effectiveNightlyRateUsd = promotionalNightlyRateUsd ?? residence.nightlyRateUsd
              const hasPromotion = promotionalNightlyRateUsd !== undefined

              return (
                <Marker
                  key={residence.id}
                  position={getMarkerPosition(residence, index)}
                  icon={createPriceIcon(effectiveNightlyRateUsd)}
                >
                  <Popup>
                    <article className="w-[200px] overflow-hidden rounded-lg border border-card-border bg-white shadow-sm">
                      <img
                        src={residence.imageUrl}
                        alt={residence.name}
                        className="h-20 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="space-y-1 p-2.5">
                        <p className="line-clamp-1 text-sm font-semibold text-ink">{residence.name}</p>
                        <p className="line-clamp-1 text-xs text-ink-soft">{residence.location}</p>
                        {hasPromotion ? (
                          <p className="text-xs text-ink-soft">
                            <span className="line-through">{`${formatNightlyPrice(residence.nightlyRateUsd)} USD / night`}</span>
                          </p>
                        ) : null}
                        <p className="text-sm font-semibold text-accent">{`${formatNightlyPrice(effectiveNightlyRateUsd)} USD / night`}</p>
                        <div className="pt-1">
                          <a
                            href={buildResidenceDetailHref(residence.slug, checkin, checkout, guestDetails)}
                            className="text-xs font-semibold uppercase tracking-[0.06em] text-accent hover:text-accent-strong"
                          >
                            View details
                          </a>
                        </div>
                      </div>
                    </article>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </div>
    </aside>
  )
}
