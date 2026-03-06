export function ResidenceDetailSkeleton() {
  return (
    <main className="pb-section pt-48 md:pt-50 lg:pt-52" aria-hidden="true">
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8 xl:grid-cols-[1fr_24rem]">

          {/* Left column */}
          <div className="space-y-4">

            {/* Header: name + location */}
            <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/62 p-4 shadow-soft md:p-6">
              <div className="h-7 w-2/3 animate-pulse rounded bg-surface-muted/90" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-surface-muted/70" />
            </div>

            {/* Photo gallery */}
            <div className="h-[420px] w-full animate-pulse rounded-2xl bg-surface-muted/85 md:h-[520px]" />

            {/* Facts row */}
            <div className="rounded-2xl border border-card-border/80 bg-white/62 p-3 shadow-soft md:p-4">
              <div className="mb-2 h-3 w-24 animate-pulse rounded bg-surface-muted/70" />
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-white/75 bg-white/72 px-3 py-2.5 md:px-3.5 md:py-3"
                  >
                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-surface-muted/80" />
                    <div className="space-y-1.5">
                      <div className="h-5 w-8 animate-pulse rounded bg-surface-muted/90" />
                      <div className="h-2.5 w-12 animate-pulse rounded bg-surface-muted/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description section */}
            <div className="space-y-3 rounded-2xl border border-card-border/80 bg-white/62 p-4 shadow-soft md:p-6">
              <div className="h-5 w-1/3 animate-pulse rounded bg-surface-muted/90" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-surface-muted/70" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-muted/70" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-muted/70" />
              </div>
            </div>

            {/* Amenities section */}
            <div className="rounded-2xl border border-card-border/80 bg-white/62 p-4 shadow-soft md:p-6">
              <div className="mb-3 h-5 w-1/4 animate-pulse rounded bg-surface-muted/90" />
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded-lg bg-surface-muted/75" />
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="h-64 animate-pulse rounded-2xl bg-surface-muted/75" />
          </div>

          {/* Right column: booking panel */}
          <div className="mt-4 lg:mt-0">
            <div className="space-y-4 rounded-2xl border border-card-border/80 bg-white/62 p-4 shadow-soft md:p-6">
              <div className="h-6 w-1/2 animate-pulse rounded bg-surface-muted/90" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-surface-muted/80" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-surface-muted/80" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full animate-pulse rounded bg-surface-muted/70" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-muted/70" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted/70" />
              </div>
              <div className="h-11 w-full animate-pulse rounded-pill bg-surface-muted/90" />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
