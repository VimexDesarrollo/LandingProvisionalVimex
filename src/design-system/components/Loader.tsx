import { type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { loaderRingVariants, loaderVariants } from '@/design-system/components/loader.variants'
import { cn } from '@/lib/cn'

type LoaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> &
  VariantProps<typeof loaderVariants> & {
    label?: string
  }

export function Loader({ className, label = 'Loading', size, tone = 'accent', ...props }: LoaderProps) {
  return (
    <div
      className={cn(loaderVariants({ size, tone }), className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      {...props}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden className="absolute inset-0 rounded-full border border-current/20" />
      <span aria-hidden className={loaderRingVariants({ tone, ring: 'outer' })} />
      <span aria-hidden className={loaderRingVariants({ tone, ring: 'inner' })} />
    </div>
  )
}
