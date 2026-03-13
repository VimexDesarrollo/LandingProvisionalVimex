'use client'

// ---------------------------------------------------------------------------
// auth-context.tsx — Estado global de autenticación del cliente
//
// Responsabilidades:
// - Verificar al montar si hay una sesión activa llamando a /api/auth/me/
// - Si el access token expiró (401), intentar renovarlo via /api/auth/refresh/
// - Exponer el perfil del usuario, el estado de carga y las acciones de auth
// - Limpiar el estado al hacer logout
//
// Decisiones de diseño:
// - Estado 'loading' al inicio: evita flashes de contenido no autenticado
// - refreshToken() antes de rendir 'unauthenticated': UX transparente para el usuario
// - login/register/logout son wrappers que actualizan el contexto post-acción
// - No guarda nada en localStorage — la fuente de verdad son las httpOnly cookies
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  getMe,
  initiateGoogleAuth,
  login as loginService,
  logout as logoutService,
  refreshToken,
  register as registerService,
  type AuthServiceError,
} from '@/services/authService'
import type { AuthStatus, CustomerProfile, LoginPayload, RegisterPayload } from '@/types/auth'

// ---------------------------------------------------------------------------
// Tipos del contexto
// ---------------------------------------------------------------------------

interface AuthContextValue {
  /** Estado de la sesión: 'loading' | 'authenticated' | 'unauthenticated' */
  status: AuthStatus
  /** Perfil del usuario autenticado, null si no hay sesión */
  user: CustomerProfile | null
  /** true mientras se verifica la sesión inicial */
  isLoading: boolean
  /** true si hay un usuario autenticado */
  isAuthenticated: boolean

  /**
   * Inicia sesión con email y contraseña.
   * Actualiza el contexto con el perfil del usuario.
   * Lanza AuthServiceError si las credenciales son inválidas.
   */
  login: (payload: LoginPayload) => Promise<void>

  /**
   * Registra un nuevo cliente.
   * Actualiza el contexto con el perfil del nuevo usuario.
   * Lanza AuthServiceError si el email ya existe o los datos son inválidos.
   */
  register: (payload: RegisterPayload) => Promise<void>

  /**
   * Cierra la sesión: llama al backend para limpiar las cookies
   * y resetea el estado del contexto.
   */
  logout: () => Promise<void>

  /**
   * Inicia el flujo OAuth de Google.
   * Redirige el navegador completo — el callback actualizará el contexto
   * cuando el usuario regrese a /auth/callback.
   */
  loginWithGoogle: () => Promise<void>

  /**
   * Fuerza una re-verificación del perfil desde el backend.
   * Útil después del callback de Google OAuth.
   */
  revalidate: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<CustomerProfile | null>(null)
  // Previene la doble ejecución en StrictMode de React 18+
  const initializationRef = useRef(false)

  // ---------------------------------------------------------------------------
  // Verificación de sesión al montar
  // ---------------------------------------------------------------------------

  const initializeSession = useCallback(async () => {
    try {
      // Intentamos obtener el perfil con el access token actual
      const profile = await getMe()

      if (profile) {
        setUser(profile)
        setStatus('authenticated')
        return
      }

      // Access token ausente o expirado — intentar refresh
      const refreshed = await refreshToken()

      if (refreshed) {
        const profileAfterRefresh = await getMe()
        if (profileAfterRefresh) {
          setUser(profileAfterRefresh)
          setStatus('authenticated')
          return
        }
      }

      // Sin sesión válida — limpiar cookies residuales para que el middleware
      // no bloquee /auth con una cookie expirada
      await logoutService().catch(() => {})
      setUser(null)
      setStatus('unauthenticated')
    } catch {
      // Error de red u otro: limpiar cookies y tratar como no autenticado
      await logoutService().catch(() => {})
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    // Protección contra doble mount en React StrictMode
    if (initializationRef.current) return
    initializationRef.current = true

    void initializeSession()
  }, [initializeSession])

  // ---------------------------------------------------------------------------
  // Acciones
  // ---------------------------------------------------------------------------

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    // loginService lanza AuthServiceError si las credenciales son inválidas
    const profile = await loginService(payload)
    setUser(profile)
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    const profile = await registerService(payload)
    setUser(profile)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    await logoutService()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    // Redirige el navegador — el contexto se actualizará en /auth/callback
    await initiateGoogleAuth()
  }, [])

  const revalidate = useCallback(async (): Promise<void> => {
    setStatus('loading')
    await initializeSession()
  }, [initializeSession])

  // ---------------------------------------------------------------------------
  // Value memo — estabilizar referencias para evitar re-renders innecesarios
  // ---------------------------------------------------------------------------

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isLoading:       status === 'loading',
      isAuthenticated: status === 'authenticated',
      login,
      register,
      logout,
      loginWithGoogle,
      revalidate,
    }),
    [status, user, login, register, logout, loginWithGoogle, revalidate],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

// Re-export para conveniencia en componentes que solo necesitan el tipo de error
export type { AuthServiceError }
