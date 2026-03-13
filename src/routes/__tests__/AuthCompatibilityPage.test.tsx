import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthPage } from '@/routes/AuthPage'

const mockRouterReplace = vi.fn()
let mockSearchParams = new URLSearchParams('returnUrl=/residences/villa-test/checkout')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
  useSearchParams: () => mockSearchParams,
}))

describe('AuthPage compatibility redirect', () => {
  beforeEach(() => {
    mockRouterReplace.mockReset()
    mockSearchParams = new URLSearchParams('returnUrl=/residences/villa-test/checkout')
  })

  it('redirects /auth to /auth/login preserving the internal returnUrl', async () => {
    render(<AuthPage />)

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/auth/login?returnUrl=%2Fresidences%2Fvilla-test%2Fcheckout')
    })
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  })

  it('redirects /auth?tab=register to /auth/register', async () => {
    mockSearchParams = new URLSearchParams('tab=register&returnUrl=/residences/villa-test/checkout')

    render(<AuthPage />)

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/auth/register?returnUrl=%2Fresidences%2Fvilla-test%2Fcheckout')
    })
  })

  it('drops external returnUrl values to avoid open redirects', async () => {
    mockSearchParams = new URLSearchParams('returnUrl=https://evil.example/phish')

    render(<AuthPage />)

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/auth/login')
    })
  })
})
