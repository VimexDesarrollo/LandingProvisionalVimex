// ---------------------------------------------------------------------------
// auth.ts — Tipos del flujo de autenticación de clientes
//
// Filosofía:
// - El backend es la fuente de verdad. Estos tipos reflejan exactamente
//   lo que el backend devuelve, no lo que el frontend quisiera.
// - CustomerProfile es la respuesta de /api/auth/me/, /api/auth/login/ y
//   /api/auth/register/ — un único shape reutilizable.
// - Los tipos de petición son separados de los tipos de respuesta.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Perfil del cliente — respuesta de me / login / register
// ---------------------------------------------------------------------------

export interface CustomerProfile {
  email: string
  firstName: string
  lastName: string
  phone: string
  countryCode: string | null
  isEmailVerified: boolean
}

// ---------------------------------------------------------------------------
// Payloads de petición
// ---------------------------------------------------------------------------

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

// ---------------------------------------------------------------------------
// Estado de autenticación en el contexto
// ---------------------------------------------------------------------------

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthState {
  status: AuthStatus
  user: CustomerProfile | null
}

// ---------------------------------------------------------------------------
// Errores de auth — shape consistente con los errores de la API
// ---------------------------------------------------------------------------

export interface AuthFieldErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  nonFieldErrors?: string
}

// ---------------------------------------------------------------------------
// Valores de formulario de login
// ---------------------------------------------------------------------------

export interface LoginFormValues {
  email: string
  password: string
}

// ---------------------------------------------------------------------------
// Valores de formulario de registro
// ---------------------------------------------------------------------------

export interface RegisterFormValues {
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phone: string
  password: string
}

// ---------------------------------------------------------------------------
// Legado — alias para no romper el ownerAuthService existente
// (se puede eliminar cuando el flujo de owners migre al nuevo sistema)
// ---------------------------------------------------------------------------

export interface OwnerLoginCredentials {
  email: string
  password: string
}

export interface OwnerLoginResult {
  success: boolean
  message: string
}
