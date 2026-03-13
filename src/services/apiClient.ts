// ---------------------------------------------------------------------------
// apiClient.ts — Wrapper HTTP centralizado
//
// Responsabilidades:
// - Una sola superficie para todos los fetches al backend
// - Manejo uniforme de errores (ApiError con status + body)
// - credentials: 'include' para enviar cookies JWT httpOnly en cada request
// - X-CSRFToken en todas las mutaciones (POST/PUT/PATCH/DELETE)
//   Django requiere este header cuando hay auth basada en cookies
//
// CSRF: Django setea la cookie `csrftoken` (NO httpOnly — JS puede leerla).
// Al incluirla como header, Django valida que la petición proviene de código
// legítimo ejecutado en la misma sesión del navegador.
// ---------------------------------------------------------------------------

interface ApiClientOptions extends RequestInit {
  headers?: HeadersInit
}

export class ApiError extends Error {
  public readonly status: number
  public readonly body: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function readErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const textBody = await response.text()
  return textBody || null
}

/**
 * Lee el CSRF token de la cookie que Django setea automáticamente.
 * La cookie `csrftoken` es legible por JS (no es httpOnly) por diseño de Django.
 * Devuelve null en SSR (no hay document) o si la cookie no existe aún.
 */
function getDjangoCsrfToken(): string | null {
  if (typeof document === 'undefined') {
    return null
  }
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export class ApiClient {
  async get<T>(url: string, options: ApiClientOptions = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new ApiError(`API request failed for ${url}`, response.status, await readErrorBody(response))
    }

    return (await response.json()) as T
  }

  async post<TBody, TResponse>(url: string, body: TBody, options: ApiClientOptions = {}): Promise<TResponse> {
    const csrfToken = getDjangoCsrfToken()

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
        ...options.headers,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new ApiError(`API request failed for ${url}`, response.status, await readErrorBody(response))
    }

    return (await response.json()) as TResponse
  }

  async patch<TBody, TResponse>(url: string, body: TBody, options: ApiClientOptions = {}): Promise<TResponse> {
    const csrfToken = getDjangoCsrfToken()

    const response = await fetch(url, {
      ...options,
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
        ...options.headers,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new ApiError(`API request failed for ${url}`, response.status, await readErrorBody(response))
    }

    return (await response.json()) as TResponse
  }

  async delete(url: string, options: ApiClientOptions = {}): Promise<void> {
    const csrfToken = getDjangoCsrfToken()

    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new ApiError(`API request failed for ${url}`, response.status, await readErrorBody(response))
    }
  }
}

export const apiClient = new ApiClient()
