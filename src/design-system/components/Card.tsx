import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-card-border/80 bg-white/85 p-7 shadow-soft backdrop-blur-sm transition-transform duration-300',
        className,
      )}
      {...props}
    />
  )
}
