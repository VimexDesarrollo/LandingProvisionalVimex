export function ResidenceCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-white/65 bg-white/72 p-0 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/62"
    >
      <div className="h-[420px] w-full animate-pulse bg-surface-muted/85" />
      <div className="space-y-3 p-5">
        <div className="h-6 w-2/3 animate-pulse rounded bg-surface-muted/90" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-muted/80" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-muted/80" />
        <div className="h-10 w-full animate-pulse rounded-pill bg-surface-muted/90" />
      </div>
    </article>
  )
}
