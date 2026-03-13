'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const glassPanelVariants = cva(
  'relative overflow-hidden border border-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/24',
  {
    variants: {
      tone: {
        mist: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.44)_0%,rgba(229,239,246,0.3)_100%)]',
        soft: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(240,245,249,0.3)_100%)]',
      },
      depth: {
        default: 'shadow-[0_24px_80px_-36px_rgba(16,36,64,0.5)]',
        elevated: 'shadow-[0_28px_100px_-48px_rgba(18,42,80,0.55)]',
        subtle: 'shadow-[0_18px_60px_-40px_rgba(17,37,70,0.5)]',
      },
      radius: {
        xl: 'rounded-2xl',
        glass: 'rounded-[28px]',
        hero: 'rounded-[32px]',
      },
      padding: {
        md: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      tone: 'mist',
      depth: 'default',
      radius: 'glass',
      padding: 'md',
    },
  },
)

type GlassPanelProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof glassPanelVariants> & {
    as?: 'section' | 'div' | 'article'
    children: ReactNode
    sheen?: boolean
  }

export function GlassPanel({
  as: Component = 'section',
  className,
  children,
  tone,
  depth,
  radius,
  padding,
  sheen = true,
  ...props
}: GlassPanelProps) {
  return (
    <Component className={cn(glassPanelVariants({ tone, depth, radius, padding }), className)} {...props}>
      {sheen ? (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/80" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-3 h-16 rounded-full bg-white/16 blur-2xl" />
        </>
      ) : null}
      {children}
    </Component>
  )
}
