import { Suspense } from 'react'
import { ResetPasswordPage } from '@/routes/ResetPasswordPage'

export const metadata = {
  title: 'Set new password — Vimex',
  description: 'Set a new password for your Vimex account.',
  robots: { index: false },
}

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  )
}
