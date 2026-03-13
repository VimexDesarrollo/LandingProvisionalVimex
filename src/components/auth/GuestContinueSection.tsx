'use client'

import { Button } from '@/design-system/components/Button'
import { GlassPanel } from '@/design-system/components/GlassPanel'

interface GuestContinueSectionProps {
  onContinueAsGuest: () => void
}

/**
 * Sección de "continuar como invitado".
 *
 * Muestra claramente la opción de reservar sin crear cuenta y explica
 * qué datos se recopilarán. Separado del consentimiento de marketing
 * (se puede agregar después).
 */
export function GuestContinueSection({ onContinueAsGuest }: GuestContinueSectionProps) {
  return (
    <section aria-labelledby="guest-section-heading">
      <GlassPanel
        tone="soft"
        depth="subtle"
        radius="glass"
        padding="md"
        className="text-center backdrop-blur-xl supports-[backdrop-filter]:bg-white/26"
      >
        <p id="guest-section-heading" className="font-body text-sm font-medium text-ink">
          No account needed
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Continue without signing in. We only use your contact information to
          confirm your reservation request.
        </p>

        <Button
          variant="ghost"
          className="mt-4 w-full border border-ink/15 bg-white/70 text-ink hover:bg-white/90"
          onClick={onContinueAsGuest}
          type="button"
        >
          Continue as guest
        </Button>
      </GlassPanel>
    </section>
  )
}
