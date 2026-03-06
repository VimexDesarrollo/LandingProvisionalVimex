import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const typographyVariants = cva('', {
  variants: {
    variant: {
      display: 'font-display text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl',
      h2: 'font-display text-4xl font-semibold leading-tight text-ink md:text-5xl',
      h3: 'font-display text-3xl font-semibold leading-tight text-ink md:text-4xl',
      body: 'font-body text-lg text-ink-soft md:text-xl',
      caption: 'font-body text-sm font-medium uppercase tracking-[0.2em] text-white/85',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

interface TypographyProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof HTMLElementTagNameMap
}

export function Typography({ as = 'p', variant, className, ...props }: TypographyProps) {
  const Element = as
  return <Element className={cn(typographyVariants({ variant }), className)} {...props} />
}
