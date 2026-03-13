// ---------------------------------------------------------------------------
// authService.ts — Capa de servicio para autenticación de clientes
//
// Responsabilidades:
// - Llamar a los endpoints de auth del backend
// - Adaptar snake_case → camelCase para los tipos del frontend
// - Extraer mensajes de error legibles de las respuestas de error
// - Iniciar el flujo OAuth de Google (redireccion del navegador)
//
// Lo que NO hace:
// - Gestionar estado de React (eso es responsabilidad de auth-context)
// - Almacenar tokens (los maneja el backend vía httpOnly cookies)
// - Validar formularios (eso es responsabilidad de los componentes con Zod)
// ---------------------------------------------------------------------------

import { ApiError, apiClient } from './apiClient'
import { endpoints } from './endpoints'
import type { CustomerProfile, LoginPayload, RegisterPayload } from '@/types/auth'

// ---------------------------------------------------------------------------
// Adapter — snake_case del backend → camelCase del frontend
// ---------------------------------------------------------------------------

interface RawCustomerProfile {
  email: string
  first_name: string
  last_name: string
  phone: string
  country_code: string | null
  is_email_verified: boolean
}

function adaptCustomerProfile(raw: RawCustomerProfile): CustomerProfile {
  return {
    email:           raw.email,
    firstName:       raw.first_name,
    lastName:        raw.last_name,
    phone:           raw.phone,
    countryCode:     raw.country_code,
    isEmailVerified: raw.is_email_verified,
  }
}

// ---------------------------------------------------------------------------
// Extracción de errores — convierte errores DRF a mensajes legibles
// ---------------------------------------------------------------------------

interface DjangoFieldErrors {
  [field: string]: string[] | string
}

export interface AuthServiceError {
  nonFieldErrors?: string
  fieldErrors?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
  }
}

function parseAuthError(error: unknown): AuthServiceError {
  if (!(error instanceof ApiError)) {
    return { nonFieldErrors: 'An unexpected error occurred. Please try again.' }
  }

  const body = error.body as DjangoFieldErrors | null

  if (!body || typeof body !== 'object') {
    return { nonFieldErrors: 'Something went wrong. Please try again.' }
  }

  const result: AuthServiceError = {}

  // DRF pone errores de campos como { campo: ["mensaje"] }
  // y errores generales como { non_field_errors: ["mensaje"] }
  const fieldMap: Record<string, keyof NonNullable<AuthServiceError['fieldErrors']>> = {
    first_name: 'firstName',
    last_name:  'lastName',
    email:      'email',
    phone:      'phone',
    password:   'password',
  }

  for (const [rawKey, frontendKey] of Object.entries(fieldMap)) {
    const fieldError = body[rawKey]
    if (fieldError) {
      if (!result.fieldErrors) result.fieldErrors = {}
      result.fieldErrors[frontendKey] = Array.isArray(fieldError) ? fieldError[0] : String(fieldError)
    }
  }

  const nonField = body['non_field_errors']
  if (nonField) {
    result.nonFieldErrors = Array.isArray(nonField) ? nonField[0] : String(nonField)
  }

  // Si no hay errores de campo ni non_field_errors, usamos un mensaje genérico
  if (!result.fieldErrors && !result.nonFieldErrors) {
    result.nonFieldErrors = 'Something went wrong. Please try again.'
  }

  return result
}

// ---------------------------------------------------------------------------
// register — POST /api/auth/register/
// ---------------------------------------------------------------------------

export async function register(payload: RegisterPayload): Promise<CustomerProfile> {
  try {
    const raw = await apiClient.post<
      { first_name: string; last_name: string; email: string; phone: string; password: string },
      RawCustomerProfile
    >(endpoints.authRegister, {
      first_name: payload.firstName,
      last_name:  payload.lastName,
      email:      payload.email,
      phone:      payload.phone,
      password:   payload.password,
    })
    return adaptCustomerProfile(raw)
  } catch (error) {
    throw parseAuthError(error)
  }
}

// ---------------------------------------------------------------------------
// login — POST /api/auth/login/
// ---------------------------------------------------------------------------

export async function login(payload: LoginPayload): Promise<CustomerProfile> {
  try {
    const raw = await apiClient.post<
      { email: string; password: string },
      RawCustomerProfile
    >(endpoints.authLogin, {
      email:    payload.email,
      password: payload.password,
    })
    return adaptCustomerProfile(raw)
  } catch (error) {
    throw parseAuthError(error)
  }
}

// ---------------------------------------------------------------------------
// logout — POST /api/auth/logout/
// ---------------------------------------------------------------------------

export async function logout(): Promise<void> {
  try {
    // El backend devuelve 204 sin body — no parseamos JSON
    await fetch(endpoints.authLogout, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
    })
  } catch {
    // Ignoramos errores de red en logout — el estado local se limpia de todas formas
  }
}

// ---------------------------------------------------------------------------
// getMe — GET /api/auth/me/
// Devuelve null si el usuario no está autenticado (401)
// ---------------------------------------------------------------------------

export async function getMe(): Promise<CustomerProfile | null> {
  try {
    const raw = await apiClient.get<RawCustomerProfile>(endpoints.authMe)
    return adaptCustomerProfile(raw)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

// ---------------------------------------------------------------------------
// refreshToken — POST /api/auth/refresh/
// Renueva el access token usando el refresh cookie.
// Devuelve true si tuvo éxito, false si la sesión expiró.
// ---------------------------------------------------------------------------

export async function refreshToken(): Promise<boolean> {
  try {
    await apiClient.post<Record<string, never>, { detail: string }>(
      endpoints.authRefresh,
      {},
    )
    return true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// initiateGoogleAuth — redirige el navegador al flujo OAuth de Google
//
// Flujo:
// 1. Llama al backend para obtener la URL de autorización de Google
// 2. El backend guarda el `state` en la sesión para validación CSRF
// 3. Redirigimos el navegador completo (no un fetch) a la URL de Google
// 4. Google redirige al backend callback, que setea cookies y redirige aquí
// ---------------------------------------------------------------------------

const RETURN_URL_STORAGE_KEY = 'vimex_auth_return_url'

export async function initiateGoogleAuth(returnUrl?: string): Promise<void> {
  // Guardamos el returnUrl antes de salir del dominio para restaurarlo en el callback.
  // Safari en modo privado puede lanzar SecurityError al escribir en sessionStorage —
  // el try/catch evita que eso rompa el flujo; si falla, el usuario simplemente
  // llega a '/' en lugar de a su destino original.
  if (returnUrl && typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(RETURN_URL_STORAGE_KEY, returnUrl)
    } catch {
      // degradación aceptable: returnUrl se pierde, el usuario llega a '/'
    }
  }

  try {
    const data = await apiClient.get<{ authUrl: string }>(endpoints.authGoogleInit)
    // Redirección completa del navegador — necesario para el flujo OAuth
    window.location.href = data.authUrl
  } catch {
    throw new Error('Could not initiate Google authentication. Please try again.')
  }
}

// ---------------------------------------------------------------------------
// requestPasswordReset — POST /api/auth/password-reset/
// Siempre resuelve (el backend no revela si el email existe)
// ---------------------------------------------------------------------------

export async function requestPasswordReset(email: string): Promise<void> {
  await fetch(endpoints.authPasswordReset, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ email }),
  })
}

// ---------------------------------------------------------------------------
// confirmPasswordReset — POST /api/auth/password-reset/confirm/
// Lanza error con mensaje legible si el token es inválido o la contraseña débil
// ---------------------------------------------------------------------------

export async function confirmPasswordReset(
  uid: string,
  token: string,
  newPassword: string,
): Promise<void> {
  const res = await fetch(endpoints.authPasswordResetConfirm, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ uid, token, new_password: newPassword }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(body.detail ?? 'Something went wrong. Please try again.')
  }
}

export function readAndClearReturnUrl(): string {
  if (typeof sessionStorage === 'undefined') return '/'
  try {
    const url = sessionStorage.getItem(RETURN_URL_STORAGE_KEY) ?? '/'
    sessionStorage.removeItem(RETURN_URL_STORAGE_KEY)
    return url
  } catch {
    return '/'
  }
}
