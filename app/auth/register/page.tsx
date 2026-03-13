import { Suspense } from 'react'
import { AuthModePage } from '@/routes/AuthModePage'

export const metadata = {
  title: 'Create account — Vimex',
  description: 'Create your Vimex account to manage reservations and continue the booking flow securely.',
  robots: { index: false },
}

export default function Page() {
  return (
    <Suspense>
      <AuthModePage mode="register" />
    </Suspense>
  )
}
