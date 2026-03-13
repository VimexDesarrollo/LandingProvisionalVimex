'use client'

// ---------------------------------------------------------------------------
// /auth/callback — Landing tras el OAuth de Google
//
// El backend redirige aquí después de:
// 1. Intercambiar el code de Google por tokens de Google
// 2. Crear o encontrar el usuario local
// 3. Setear las cookies JWT httpOnly en la response
//
// Lo que hace esta página:
// 1. Llama a revalidate() del AuthContext para leer las cookies recién seteadas
// 2. Lee el returnUrl guardado en sessionStorage por initiateGoogleAuth()
// 3. Redirige al returnUrl (o a '/' como fallback)
// ---------------------------------------------------------------------------

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { readAndClearReturnUrl } from '@/services/authService'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { revalidate } = useAuth()

  useEffect(() => {
    async function handleCallback() {
      // Re-verificar la sesión para leer las cookies recién seteadas por el backend
      await revalidate()

      // Recuperar el returnUrl guardado antes de la redirección a Google
      const returnUrl = readAndClearReturnUrl()
      router.replace(returnUrl)
    }

    void handleCallback()
  }, [revalidate, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
        aria-label="Completing sign in…"
        role="status"
      />
      <p className="text-sm text-ink-soft">Completing sign in…</p>
    </main>
  )
}
