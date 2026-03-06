import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section'
}

export function Container({ as = 'div', className, ...props }: ContainerProps) {
  const Element = as
  return <Element className={cn('mx-auto w-full max-w-[1200px] px-6 md:px-8', className)} {...props} />
}
