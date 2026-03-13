import { Suspense } from 'react'
import { AuthPage } from '@/routes/AuthPage'

export const metadata = {
  title: 'Account access — Vimex',
  description: 'Sign in or create an account to manage your vacation rental reservations.',
  robots: { index: false },  // no indexar páginas de auth
}

export default function Page() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  )
}
