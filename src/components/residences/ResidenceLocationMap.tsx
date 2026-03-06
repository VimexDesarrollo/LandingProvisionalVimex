'use client'

import dynamic from 'next/dynamic'

interface ResidenceLocationMapProps {
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

const ResidenceLocationMapClient = dynamic(
  () => import('@/components/residences/ResidenceLocationMap.client').then((module) => module.ResidenceLocationMapClient),
  { ssr: false },
)

export function ResidenceLocationMap({
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
}: ResidenceLocationMapProps) {
  return (
    <ResidenceLocationMapClient
      title={title}
      badgeLabel={badgeLabel}
      actionLabel={actionLabel}
      residenceName={residenceName}
      residenceLocation={residenceLocation}
      imageUrl={imageUrl}
      nightlyRateUsd={nightlyRateUsd}
      promotionalNightlyRateUsd={promotionalNightlyRateUsd}
      latitude={latitude}
      longitude={longitude}
    />
  )
}
