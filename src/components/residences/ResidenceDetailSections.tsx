import { Typography } from '@/design-system/components/Typography'
import { getAmenityIcon, getAmenityLabel } from '@/components/residences/amenity.meta'
import { ResidenceLocationMap } from '@/components/residences/ResidenceLocationMap'
import { ResidenceReviewsSection } from '@/components/residences/ResidenceReviewsSection'
import { getRoomDetailIcon } from '@/components/residences/roomDetail.meta'
import type { ResidenceDetail } from '@/types/content'

interface ResidenceDetailSectionsProps {
  detail: ResidenceDetail
}

export function ResidenceDetailSections({ detail }: ResidenceDetailSectionsProps) {
  const amenityChips = detail.amenities.map((slug, index) => ({
    key: `${slug}-${index}`,
    slug,
    label: detail.fullAmenities[index] ?? getAmenityLabel(slug),
  }))

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-soft backdrop-blur-sm md:p-6">
        <Typography as="h3" variant="h3" className="text-2xl">
          {detail.descriptionTitle}
        </Typography>
        <Typography className="mt-2 leading-relaxed text-ink-soft">{detail.shortDescription}</Typography>
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-soft backdrop-blur-sm md:p-6">
        <Typography as="h3" variant="h3" className="text-2xl">
          {detail.amenitiesTitle}
        </Typography>
        <ul className="mt-3 flex flex-wrap gap-2">
          {amenityChips.map((amenity) => (
            <li
              key={amenity.key}
              className="inline-flex items-center gap-2 rounded-pill border border-card-border bg-white/80 px-3 py-2 text-sm font-medium text-ink transition-all duration-200 hover:border-accent/45 hover:bg-white"
            >
              <span aria-hidden className="text-base leading-none text-ink-soft">
                {getAmenityIcon(amenity.slug)}
              </span>
              <Typography className="text-sm text-ink">{amenity.label}</Typography>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-soft backdrop-blur-sm md:p-6">
        <Typography as="h3" variant="h3" className="text-2xl">
          {detail.locationSection.title}
        </Typography>
        <Typography className="mt-2 leading-relaxed text-ink-soft">{detail.locationSection.description}</Typography>
      </section>

      <ResidenceReviewsSection
        title={detail.reviewsSection.title}
        ctaLabel={detail.reviewsSection.cta.label}
        reviews={detail.reviewsSection.items}
      />

      <section className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-soft backdrop-blur-sm md:p-6">
        <Typography as="h3" variant="h3" className="text-2xl">
          {detail.roomDetailsSection.title}
        </Typography>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
          {detail.roomDetailsSection.items.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/75 bg-white/72 px-3 py-2.5">
              <div className="inline-flex items-center gap-1.5 text-ink-soft">
                <span aria-hidden className="text-sm leading-none">
                  {getRoomDetailIcon(item)}
                </span>
                <Typography className="text-[11px] uppercase tracking-[0.09em] text-ink-soft">{item.label}</Typography>
              </div>
              <Typography className="mt-1 text-base font-semibold text-ink">{item.value}</Typography>
            </div>
          ))}
        </div>
      </section>

      <ResidenceLocationMap
        title={detail.mapSection.title}
        badgeLabel={detail.mapSection.badgeLabel}
        actionLabel={detail.mapSection.cta.label}
        residenceName={detail.name}
        residenceLocation={detail.location}
        imageUrl={detail.imageUrl}
        nightlyRateUsd={detail.nightlyRateUsd}
        promotionalNightlyRateUsd={detail.promotionalNightlyRateUsd}
        latitude={detail.latitude}
        longitude={detail.longitude}
      />
    </div>
  )
}
