import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string
}

export const Section = forwardRef<HTMLElement, SectionProps>(({ className, ...props }, ref) => (
  <section ref={ref} className={cn('py-section', className)} {...props} />
))

Section.displayName = 'Section'
