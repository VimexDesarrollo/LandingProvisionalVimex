'use client'

import { useEffect, useState } from 'react'
import { FiMapPin } from 'react-icons/fi'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import {
  createLocationPinIcon,
  formatNightlyPrice,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from '@/components/residences/map.utils'
import { Typography } from '@/design-system/components/Typography'

const DETAIL_MAP_ZOOM = 16

interface ResidenceLocationMapClientProps {
  title: string
  badgeLabel: string
  actionLabel: string
  residenceName: string
  residenceLocation: string
  imageUrl: string
  nightlyRateUsd: number
  promotionalNightlyRateUsd?: number
  latitude: number
  longitude: number
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

function FocusSingleLocation({
  latitude,
  longitude,
  centerRequestId,
}: {
  latitude: number
  longitude: number
  centerRequestId: number
}) {
  const map = useMap()

  useEffect(() => {
    const target: [number, number] = [latitude, longitude]
    map.setView(target, DETAIL_MAP_ZOOM, { animate: false })
    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false })
      map.setView(target, DETAIL_MAP_ZOOM, { animate: false })
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [latitude, longitude, map])

  useEffect(() => {
    if (centerRequestId === 0) {
      return
    }

    map.flyTo([latitude, longitude], DETAIL_MAP_ZOOM, {
      animate: true,
      duration: 0.65,
    })
  }, [centerRequestId, latitude, longitude, map])

  return null
}

export function ResidenceLocationMapClient({
  title,
  badgeLabel,
  actionLabel,
  residenceName,
  residenceLocation,
  imageUrl,
  nightlyRateUsd,
  promotionalNightlyRateUsd,
  latitude,
  longitude,
}: ResidenceLocationMapClientProps) {
  const [centerRequestId, setCenterRequestId] = useState<number>(0)
  const effectiveNightlyRateUsd = sanitizePromotionalNightlyRate(nightlyRateUsd, promotionalNightlyRateUsd) ?? nightlyRateUsd
  const hasPromotion = effectiveNightlyRateUsd !== nightlyRateUsd

  return (
    <section className="rounded-2xl border border-white/70 bg-white/58 p-4 shadow-soft backdrop-blur-xl" aria-label="Residence map">
      <div className="flex items-center justify-between gap-3">
        <Typography as="h3" variant="h3" className="text-2xl">
          {title}
        </Typography>
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/65 bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
          <FiMapPin aria-hidden className="h-4 w-4" />
          {badgeLabel}
        </span>
      </div>

      <div className="mt-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/70 bg-white/75">
        <MapContainer
          key={`${latitude}-${longitude}`}
          center={[latitude, longitude]}
          zoom={DETAIL_MAP_ZOOM}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
          <FocusSingleLocation latitude={latitude} longitude={longitude} centerRequestId={centerRequestId} />
          <Marker position={[latitude, longitude]} icon={createLocationPinIcon()}>
            <Popup>
              <article className="w-[220px] overflow-hidden rounded-lg border border-card-border bg-white shadow-sm">
                <img
                  src={imageUrl}
                  alt={residenceName}
                  className="h-24 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-1 p-2.5">
                  <p className="line-clamp-1 text-sm font-semibold text-ink">{residenceName}</p>
                  <p className="line-clamp-1 text-xs text-ink-soft">{residenceLocation}</p>
                  {hasPromotion ? (
                    <p className="text-xs text-ink-soft">
                      <span className="line-through">{`${formatNightlyPrice(nightlyRateUsd)} USD / night`}</span>
                    </p>
                  ) : null}
                  <p className="text-sm font-semibold text-accent">{`${formatNightlyPrice(effectiveNightlyRateUsd)} USD / night`}</p>
                </div>
              </article>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="liquid-click liquid-click--hero rounded-pill bg-accent px-5 py-2 text-sm font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-strong"
          onClick={() => setCenterRequestId((current) => current + 1)}
        >
          {actionLabel}
        </button>
      </div>
    </section>
  )
}
