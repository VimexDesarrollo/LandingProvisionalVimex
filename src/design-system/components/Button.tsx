import { type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { buttonVariants } from '@/design-system/components/button.variants'
import { runLiquidClickFromKeyboard, runLiquidClickFromMouse } from '@/lib/liquidClick'
import { cn } from '@/lib/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', onMouseDown, onKeyDown, ...props }, ref) => {
    const handleMouseDown: ButtonHTMLAttributes<HTMLButtonElement>['onMouseDown'] = (event) => {
      runLiquidClickFromMouse(event)
      onMouseDown?.(event)
    }

    const handleKeyDown: ButtonHTMLAttributes<HTMLButtonElement>['onKeyDown'] = (event) => {
      runLiquidClickFromKeyboard(event)
      onKeyDown?.(event)
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        type={type}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
