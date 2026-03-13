import { Suspense } from 'react'
import { ForgotPasswordPage } from '@/routes/ForgotPasswordPage'

export const metadata = {
  title: 'Reset password — Vimex',
  description: 'Request a password reset link for your Vimex account.',
  robots: { index: false },
}

export default function Page() {
  return (
    <Suspense>
      <ForgotPasswordPage />
    </Suspense>
  )
}
