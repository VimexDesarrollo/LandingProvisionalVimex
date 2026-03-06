interface ApiClientOptions extends RequestInit {
  headers?: HeadersInit
}

export class ApiError extends Error {
  public readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
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
      throw new ApiError(`API request failed for ${url}`, response.status)
    }

    return (await response.json()) as T
  }

  async post<TBody, TResponse>(url: string, body: TBody, options: ApiClientOptions = {}): Promise<TResponse> {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new ApiError(`API request failed for ${url}`, response.status)
    }

    return (await response.json()) as TResponse
  }
}

export const apiClient = new ApiClient()
