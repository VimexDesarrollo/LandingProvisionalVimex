'use client'

import { type AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/design-system/components/button.variants'
import { cn } from '@/lib/cn'
import { runLiquidClickFromKeyboard, runLiquidClickFromMouse } from '@/lib/liquidClick'

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  VariantProps<typeof buttonVariants> & {
    href: string
  }

export function ButtonLink({ className, variant, size, onMouseDown, onKeyDown, href, ...props }: ButtonLinkProps) {
  const handleMouseDown: AnchorHTMLAttributes<HTMLAnchorElement>['onMouseDown'] = (event) => {
    runLiquidClickFromMouse(event)
    onMouseDown?.(event)
  }

  const handleKeyDown: AnchorHTMLAttributes<HTMLAnchorElement>['onKeyDown'] = (event) => {
    runLiquidClickFromKeyboard(event)
    onKeyDown?.(event)
  }

  const isExternalLink = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

  if (isExternalLink) {
    return (
      <a
        href={href}
        className={cn(buttonVariants({ variant, size }), className)}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }

  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}
