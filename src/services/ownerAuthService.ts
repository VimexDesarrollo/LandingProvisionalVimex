import { env } from '@/config/env'
import { ApiError, apiClient } from '@/services/apiClient'
import { endpoints } from '@/services/endpoints'
import type { OwnerLoginCredentials, OwnerLoginResult } from '@/types/auth'

interface OwnerLoginApiResponse {
  success: boolean
  message?: string
}

const useMocks = env.useMocks

const MOCK_OWNER_EMAIL = 'owner@vimex.com'
const MOCK_OWNER_PASSWORD = 'demo1234'

function buildMockFailureMessage(credentials: OwnerLoginCredentials): string {
  if (!credentials.email.trim() || !credentials.password.trim()) {
    return 'Email and password are required.'
  }

  return 'Invalid credentials. Please verify your email and password.'
}

export const ownerAuthService = {
  async login(credentials: OwnerLoginCredentials): Promise<OwnerLoginResult> {
    if (useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 380))

      const isValidDemoCredentials =
        credentials.email.trim().toLowerCase() === MOCK_OWNER_EMAIL &&
        credentials.password === MOCK_OWNER_PASSWORD

      if (isValidDemoCredentials) {
        return {
          success: true,
          message: 'Welcome back. Redirecting to owner dashboard...',
        }
      }

      return {
        success: false,
        message: buildMockFailureMessage(credentials),
      }
    }

    try {
      const response = await apiClient.post<OwnerLoginCredentials, OwnerLoginApiResponse>(endpoints.ownerLogin, credentials)

      return {
        success: response.success,
        message: response.message ?? (response.success ? 'Login successful.' : 'Unable to sign in with these credentials.'),
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return {
          success: false,
          message: 'Invalid credentials. Please verify your email and password.',
        }
      }

      return {
        success: false,
        message: 'Unable to complete login right now. Please try again.',
      }
    }
  },
}
