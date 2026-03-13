import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'liquid-click relative isolate overflow-hidden inline-flex items-center justify-center rounded-pill font-body text-base font-semibold uppercase tracking-[0.04em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent-strong',
        brand: 'bg-[linear-gradient(135deg,rgba(72,191,214,0.96)_0%,rgba(13,77,157,0.97)_58%,rgba(8,56,118,0.99)_100%)] bg-[length:200%_200%] bg-[position:0%_50%] text-white ring-1 ring-white/24 shadow-[0_18px_34px_-18px_rgba(11,44,105,0.62)] transition-[background-position,transform,box-shadow,filter] hover:-translate-y-0.5 hover:bg-[position:100%_50%] hover:brightness-[1.03] hover:shadow-[0_22px_42px_-18px_rgba(11,44,105,0.68)]',
        ghost: 'bg-white/20 text-white hover:bg-white/30',
        hero: 'hero-liquid bg-accent/95 text-white ring-1 ring-white/35 shadow-soft backdrop-blur-sm hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-[0_22px_44px_-18px_rgba(11,29,79,0.65)]',
      },
      size: {
        sm: 'h-10 px-5 text-sm tracking-[0.03em]',
        md: 'h-12 px-8',
        lg: 'h-14 px-10 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)
