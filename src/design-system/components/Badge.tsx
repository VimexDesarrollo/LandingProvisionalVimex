import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const badgeVariants = cva('inline-flex items-center rounded-pill px-4 py-2 text-sm font-semibold', {
  variants: {
    variant: {
      accent: 'bg-accent/95 text-white',
      success: 'bg-success/90 text-white',
    },
  },
  defaultVariants: {
    variant: 'accent',
  },
})

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
