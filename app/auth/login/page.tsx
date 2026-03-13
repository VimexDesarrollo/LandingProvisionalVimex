import { Suspense } from 'react'
import { AuthModePage } from '@/routes/AuthModePage'

export const metadata = {
  title: 'Sign in — Vimex',
  description: 'Sign in to manage your reservations and continue your booking flow securely.',
  robots: { index: false },
}

export default function Page() {
  return (
    <Suspense>
      <AuthModePage mode="login" />
    </Suspense>
  )
}
