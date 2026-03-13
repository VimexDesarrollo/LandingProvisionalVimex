import { type NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// middleware.ts — Protección de rutas en Next.js
//
// Decisiones de diseño:
// - Las cookies JWT son httpOnly — el middleware no puede leer su contenido,
//   pero sí puede verificar su presencia como señal de sesión activa.
// - La validación real ocurre en el backend al hacer el primer request
//   autenticado — el middleware solo evita parpadeos de UI.
// - /auth redirecciona a '/' si ya hay cookie (usuario probablemente autenticado),
//   evitando que usuarios autenticados vean la pantalla de login.
// - Rutas futuras protegidas (ej: /dashboard, /my-bookings) deben agregarse
//   en PROTECTED_ROUTES y se redirigen a /auth si no hay cookie.
// ---------------------------------------------------------------------------

/** Cookie seteada por el backend al autenticarse (ver auth_utils.py) */
const ACCESS_COOKIE_NAME = 'vimex_access'

/** Rutas que requieren autenticación (agregar cuando existan) */
const PROTECTED_ROUTES: string[] = [
  // '/dashboard',
  // '/my-bookings',
]

/** Rutas que no deben verse si el usuario ya está autenticado */
const AUTH_ROUTES = ['/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasAccessCookie = request.cookies.has(ACCESS_COOKIE_NAME)

  // Redirigir a '/' si el usuario autenticado intenta ver la pantalla de auth
  // Excepción: /auth/callback es el landing del OAuth — siempre accesible
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && pathname !== '/auth/callback') {
    if (hasAccessCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteger rutas privadas — redirigir a /auth con returnUrl si no hay cookie
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!hasAccessCookie) {
      const authUrl = new URL('/auth', request.url)
      authUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(authUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - archivos de imagen públicos
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
