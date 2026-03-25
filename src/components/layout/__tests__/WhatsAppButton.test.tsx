import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import type { FooterContactContent } from '@/types/content'

vi.mock('@/config/whatsapp', () => ({
  WHATSAPP_NUMBER: '529841311019',
}))

const contact: FooterContactContent = {
  title: 'Contact Us',
  addressLines: ['80 Av. Norte', 'Playa del Carmen'],
  phones: ['+52 (984) 131 1019', '+52 (984) 185 7696', '+1 (510) 990 3091'],
  email: 'info@vimexmx.com',
}

describe('WhatsAppButton', () => {
  it('renders the floating button', () => {
    render(<WhatsAppButton contact={contact} />)
    expect(screen.getByRole('button', { name: /open contact options/i })).toBeInTheDocument()
  })

  it('modal is hidden by default', () => {
    render(<WhatsAppButton contact={contact} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the modal when the floating button is clicked', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)

    await user.click(screen.getByRole('button', { name: /open contact options/i }))

    expect(screen.getByRole('dialog', { name: /contact options/i })).toBeInTheDocument()
  })

  it('shows all phone numbers with correct tel: links', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)
    await user.click(screen.getByRole('button', { name: /open contact options/i }))

    const phoneLinks = screen.getAllByRole('link').filter((el) =>
      el.getAttribute('href')?.startsWith('tel:')
    )
    expect(phoneLinks).toHaveLength(3)
    expect(phoneLinks[0]).toHaveAttribute('href', 'tel:+529841311019')
    expect(phoneLinks[2]).toHaveAttribute('href', 'tel:+15109903091')
  })

  it('shows the email link', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)
    await user.click(screen.getByRole('button', { name: /open contact options/i }))

    const emailLink = screen.getByRole('link', { name: /info@vimexmx.com/i })
    expect(emailLink).toHaveAttribute('href', 'mailto:info@vimexmx.com')
  })

  it('shows a WhatsApp link for each Mexican number', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)
    await user.click(screen.getByRole('button', { name: /open contact options/i }))

    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    expect(waLinks).toHaveLength(2)
    expect(waLinks[0]).toHaveAttribute('href', expect.stringContaining('wa.me/529841311019'))
    expect(waLinks[1]).toHaveAttribute('href', expect.stringContaining('wa.me/529841857696'))
  })

  it('closes the modal when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)
    await user.click(screen.getByRole('button', { name: /open contact options/i }))
    await user.click(screen.getByRole('button', { name: /close contact options/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the modal when the overlay is clicked', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)
    await user.click(screen.getByRole('button', { name: /open contact options/i }))
    await user.click(screen.getByTestId('contact-modal-overlay'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the modal when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)
    await user.click(screen.getByRole('button', { name: /open contact options/i }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows Mexico flag for +52 numbers and US flag for +1 numbers', async () => {
    const user = userEvent.setup()
    render(<WhatsAppButton contact={contact} />)
    await user.click(screen.getByRole('button', { name: /open contact options/i }))

    const mxFlags = screen.getAllByText('🇲🇽')
    const usFlags = screen.getAllByText('🇺🇸')
    expect(mxFlags).toHaveLength(2)
    expect(usFlags).toHaveLength(1)
  })
})
