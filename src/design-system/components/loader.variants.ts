import { cva } from 'class-variance-authority'

export const loaderVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center',
  {
    variants: {
      size: {
        sm: 'size-5',
        md: 'size-8',
        lg: 'size-12',
      },
      tone: {
        accent: 'text-accent',
        neutral: 'text-ink-soft',
        inverse: 'text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      tone: 'accent',
    },
  },
)

export const loaderRingVariants = cva(
  'absolute rounded-full border-2 border-transparent motion-reduce:animate-none',
  {
    variants: {
      ring: {
        outer: 'inset-0 animate-spin [animation-duration:0.9s]',
        inner: 'inset-[22%] animate-spin [animation-direction:reverse] [animation-duration:1.4s]',
      },
      tone: {
        accent: 'border-t-accent border-r-accent/80',
        neutral: 'border-t-ink-soft border-r-ink-soft/80',
        inverse: 'border-t-white border-r-white/80',
      },
    },
    defaultVariants: {
      ring: 'outer',
      tone: 'accent',
    },
  },
)
