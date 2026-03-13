/**
 * ForgotPasswordPage.test.tsx
 *
 * Objetivo: intentar romper el flujo. Si un test falla es porque hay
 * un bug real — se arregla el código de producción, no el test.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

vi.mock('next/navigation', () => ({
  useRouter:       () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

const mockRequestPasswordReset = vi.fn()
vi.mock('@/services/authService', () => ({
  requestPasswordReset: (...args: unknown[]) => mockRequestPasswordReset(...args),
}))

import { ForgotPasswordPage } from '@/routes/ForgotPasswordPage'

describe('ForgotPasswordPage — validación y happy path', () => {
  beforeEach(() => {
    mockRequestPasswordReset.mockReset()
    mockRequestPasswordReset.mockResolvedValue(undefined)
  })

  it('no llama al servicio con email vacío', async () => {
    render(<ForgotPasswordPage />)
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(mockRequestPasswordReset).not.toHaveBeenCalled()
  })

  it('no llama al servicio con email inválido', async () => {
    render(<ForgotPasswordPage />)
    await userEvent.type(screen.getByLabelText(/email/i), 'notanemail')
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(mockRequestPasswordReset).not.toHaveBeenCalled()
  })

  it('muestra el mismo mensaje de éxito para email existente y no existente (anti-enumeración)', async () => {
    render(<ForgotPasswordPage />)
    await userEvent.type(screen.getByLabelText(/email/i), 'notregistered@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => expect(screen.getByText(/check your inbox/i)).toBeInTheDocument())
    // NO debe revelar si el email existe
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/no account/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/not registered/i)).not.toBeInTheDocument()
  })
})

describe('ForgotPasswordPage — protección doble submit', () => {
  beforeEach(() => {
    mockRequestPasswordReset.mockReset()
  })

  it('el botón queda disabled mientras la request está en vuelo', async () => {
    mockRequestPasswordReset.mockImplementation(() => new Promise(() => {}))
    render(<ForgotPasswordPage />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
    })
  })

  it('un doble click rápido solo envía una request', async () => {
    mockRequestPasswordReset.mockResolvedValue(undefined)
    render(<ForgotPasswordPage />)
    const emailInput = screen.getByLabelText(/email/i)
    const submitBtn  = screen.getByRole('button', { name: /send reset link/i })
    await userEvent.type(emailInput, 'user@example.com')
    // Dos clicks consecutivos — el segundo debe ser ignorado
    await userEvent.dblClick(submitBtn)
    await waitFor(() => expect(screen.getByText(/check your inbox/i)).toBeInTheDocument())
    expect(mockRequestPasswordReset).toHaveBeenCalledTimes(1)
  })
})

describe('ForgotPasswordPage — manejo de errores de red', () => {
  beforeEach(() => mockRequestPasswordReset.mockReset())

  /**
   * BUG TEST: si la red falla (fetch throws), el formulario se queda en
   * estado 'submitting' y el usuario no puede reintentar.
   * Este test FALLA si ForgotPasswordPage no tiene try/catch en handleSubmit.
   */
  it('permite reintentar después de un error de red', async () => {
    mockRequestPasswordReset.mockRejectedValueOnce(new Error('Network error'))
    render(<ForgotPasswordPage />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))

    // El botón debe volver a estar habilitado para que el usuario pueda reintentar
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send reset link/i })).not.toBeDisabled()
    })
  })

  it('muestra un mensaje de error cuando la red falla', async () => {
    mockRequestPasswordReset.mockRejectedValueOnce(new Error('Network error'))
    render(<ForgotPasswordPage />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})

describe('ForgotPasswordPage — inputs maliciosos', () => {
  beforeEach(() => mockRequestPasswordReset.mockReset())

  it('no ejecuta XSS en el campo email', async () => {
    render(<ForgotPasswordPage />)
    await userEvent.type(screen.getByLabelText(/email/i), '<img src=x onerror=alert(1)>')
    expect(document.querySelector('img[onerror]')).not.toBeInTheDocument()
    // Formato inválido: debe rechazarse
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(mockRequestPasswordReset).not.toHaveBeenCalled()
  })

  it('no ejecuta script tags en el campo email', async () => {
    render(<ForgotPasswordPage />)
    await userEvent.type(screen.getByLabelText(/email/i), '<script>window.__xss=true</script>@x.com')
    expect((window as unknown as Record<string, unknown>).__xss).toBeUndefined()
  })
})
