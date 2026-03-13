import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterForm } from '@/components/auth/RegisterForm'

const mockRegister = vi.fn()

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    register: (payload: unknown) => mockRegister(payload),
  }),
}))

vi.mock('@/hooks/useCountries', () => ({
  useCountries: () => ({
    countries: [
      { code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' },
      { code: 'US', name: 'United States', flagEmoji: '🇺🇸', dialCode: '+1' },
    ],
    isLoading: false,
    error: false,
  }),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegister.mockReset()
  })

  it('submits the phone code and phone number combined into a normalized payload field', async () => {
    mockRegister.mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<RegisterForm />)

    await user.type(screen.getByLabelText(/first name/i), 'Ana')
    await user.type(screen.getByLabelText(/last name/i), 'Garcia')
    await user.type(screen.getByLabelText(/email address/i), 'ana@example.com')
    await user.click(screen.getByRole('combobox', { name: /phone code/i }))
    await user.type(screen.getByRole('combobox', { name: /phone code/i }), '+52')
    await user.click(screen.getByRole('option', { name: /mexico/i }))
    await user.type(screen.getByLabelText(/phone number/i), '984 123 4567')
    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass!42')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'Ana',
        lastName: 'Garcia',
        email: 'ana@example.com',
        phone: '+52 984 123 4567',
        password: 'StrongPass!42',
      })
    })
  })
})
