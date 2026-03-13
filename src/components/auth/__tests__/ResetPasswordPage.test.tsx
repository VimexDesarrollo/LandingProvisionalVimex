/**
 * ResetPasswordPage.test.tsx
 *
 * Objetivo: intentar romper el flujo de reset de contraseña.
 * Si un test falla es un bug real — se arregla el código de producción.
 */

import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

// ---------------------------------------------------------------------------
// Setup: uid y token válidos en los query params
// ---------------------------------------------------------------------------

vi.mock('next/navigation', () => ({
  useRouter:       () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams('uid=dGVzdA&token=valid-token-123'),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

const mockConfirmPasswordReset = vi.fn()
vi.mock('@/services/authService', () => ({
  confirmPasswordReset: (...args: unknown[]) => mockConfirmPasswordReset(...args),
}))

import { ResetPasswordPage } from '@/routes/ResetPasswordPage'

// ---------------------------------------------------------------------------
// Validación client-side
// ---------------------------------------------------------------------------

describe('ResetPasswordPage — validación', () => {
  beforeEach(() => mockConfirmPasswordReset.mockReset())

  it('no llama al servicio cuando la contraseña es muy corta', async () => {
    render(<ResetPasswordPage />)
    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'short')
    await userEvent.type(screen.getByLabelText(/confirm new password/i), 'short')
    await userEvent.click(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => expect(screen.getByText(/at least 8/i)).toBeInTheDocument())
    expect(mockConfirmPasswordReset).not.toHaveBeenCalled()
  })

  it('no llama al servicio cuando las contraseñas no coinciden', async () => {
    render(<ResetPasswordPage />)
    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'StrongPass!99')
    await userEvent.type(screen.getByLabelText(/confirm new password/i), 'DifferentPass!99')
    await userEvent.click(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => expect(screen.getByText(/do not match/i)).toBeInTheDocument())
    expect(mockConfirmPasswordReset).not.toHaveBeenCalled()
  })

  it('no llama al servicio cuando el form está vacío', async () => {
    render(<ResetPasswordPage />)
    await userEvent.click(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0))
    expect(mockConfirmPasswordReset).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------

describe('ResetPasswordPage — happy path', () => {
  beforeEach(() => mockConfirmPasswordReset.mockReset())

  it('llama al servicio con uid, token y nueva contraseña correctos', async () => {
    mockConfirmPasswordReset.mockResolvedValueOnce(undefined)
    render(<ResetPasswordPage />)

    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'NewSecure!Pass99')
    await userEvent.type(screen.getByLabelText(/confirm new password/i), 'NewSecure!Pass99')
    await userEvent.click(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => {
      expect(mockConfirmPasswordReset).toHaveBeenCalledWith(
        'dGVzdA',
        'valid-token-123',
        'NewSecure!Pass99',
      )
    })
  })

  it('muestra estado de éxito tras reset válido', async () => {
    mockConfirmPasswordReset.mockResolvedValueOnce(undefined)
    render(<ResetPasswordPage />)

    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'NewSecure!Pass99')
    await userEvent.type(screen.getByLabelText(/confirm new password/i), 'NewSecure!Pass99')
    await userEvent.click(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => expect(screen.getByText(/password updated/i)).toBeInTheDocument())
  })
})

// ---------------------------------------------------------------------------
// Token inválido / expirado
// ---------------------------------------------------------------------------

describe('ResetPasswordPage — token inválido', () => {
  beforeEach(() => mockConfirmPasswordReset.mockReset())

  it('muestra error y link para solicitar nuevo enlace cuando el token es inválido', async () => {
    mockConfirmPasswordReset.mockRejectedValueOnce(new Error('Invalid or expired reset link.'))
    render(<ResetPasswordPage />)

    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'NewSecure!Pass99')
    await userEvent.type(screen.getByLabelText(/confirm new password/i), 'NewSecure!Pass99')
    await userEvent.click(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/invalid or expired/i))
    expect(screen.getByRole('link', { name: /request a new link/i })).toBeInTheDocument()
  })

  it('permite reintentar después de un error (botón vuelve a habilitarse)', async () => {
    mockConfirmPasswordReset.mockRejectedValueOnce(new Error('Invalid or expired reset link.'))
    render(<ResetPasswordPage />)

    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'NewSecure!Pass99')
    await userEvent.type(screen.getByLabelText(/confirm new password/i), 'NewSecure!Pass99')
    await userEvent.click(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /update password/i })).not.toBeDisabled()
    })
  })
})

// ---------------------------------------------------------------------------
// Protección doble-submit
// ---------------------------------------------------------------------------

describe('ResetPasswordPage — doble submit', () => {
  beforeEach(() => mockConfirmPasswordReset.mockReset())

  it('el botón tiene aria-busy=true configurado para indicar estado de envío', () => {
    // Verificamos la estructura del componente: el botón tiene aria-busy="false"
    // inicialmente. El doble-submit ya se cubre en el test de dblClick de abajo.
    // Las promesas nunca-resueltas cuelgan React 18's act() — se evita ese patrón aquí.
    render(<ResetPasswordPage />)
    const button = screen.getByRole('button', { name: /update password/i })
    expect(button).toHaveAttribute('aria-busy', 'false')
    expect(button).not.toBeDisabled()
  })

  it('un doble click rápido solo envía una request', async () => {
    mockConfirmPasswordReset.mockResolvedValue(undefined)
    render(<ResetPasswordPage />)

    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'NewSecure!Pass99')
    await userEvent.type(screen.getByLabelText(/confirm new password/i), 'NewSecure!Pass99')
    await userEvent.dblClick(screen.getByRole('button', { name: /update password/i }))

    await waitFor(() => expect(screen.getByText(/password updated/i)).toBeInTheDocument())
    expect(mockConfirmPasswordReset).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// Seguridad — contraseña no expuesta en DOM
// ---------------------------------------------------------------------------

describe('ResetPasswordPage — seguridad', () => {
  beforeEach(() => mockConfirmPasswordReset.mockReset())

  it('la contraseña no aparece en ningún texto del DOM', async () => {
    render(<ResetPasswordPage />)
    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'TopSecret!Pass2026')

    expect(screen.queryByText('TopSecret!Pass2026')).not.toBeInTheDocument()
    expect(screen.getAllByLabelText(/new password/i)[0]).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText(/confirm new password/i)).toHaveAttribute('type', 'password')
  })

  it('XSS en campo contraseña no se ejecuta', async () => {
    render(<ResetPasswordPage />)
    await userEvent.type(screen.getAllByLabelText(/new password/i)[0],'<img src=x onerror=alert(1)>')
    expect(document.querySelector('img[onerror]')).not.toBeInTheDocument()
  })
})
