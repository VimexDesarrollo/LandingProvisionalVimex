import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/design-system/components/Button'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { ownerAuthService } from '@/services/ownerAuthService'

interface OwnerLoginFormState {
  email: string
  password: string
}

const initialOwnerLoginForm: OwnerLoginFormState = {
  email: '',
  password: '',
}

export function PropertyOwnersLoginPage() {
  const router = useRouter()
  const [formState, setFormState] = useState<OwnerLoginFormState>(initialOwnerLoginForm)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)

  const updateField =
    (field: keyof OwnerLoginFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((previous) => ({ ...previous, [field]: event.target.value }))
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedbackMessage('')
    setHasError(false)

    const result = await ownerAuthService.login(formState)

    setFeedbackMessage(result.message)
    setHasError(!result.success)
    setIsSubmitting(false)

    if (result.success) {
      setTimeout(() => router.push('/residences'), 550)
    }
  }

  return (
    <main className="pb-section pt-28">
      <section className="relative isolate overflow-hidden pb-16 text-white">
        <img
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=2400&q=80"
          alt="Modern luxury living room with ocean-inspired tones"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(10,26,64,0.55),rgba(6,14,34,0.82))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/55" />
        <Container className="relative z-10 space-y-4 py-14">
          <Typography as="p" variant="caption" className="text-white/80">
            Property Owners
          </Typography>
          <Typography as="h1" variant="display" className="max-w-4xl">
            Owner login
          </Typography>
          <Typography className="max-w-3xl text-lg text-white/85 md:text-xl">
            Access your owner tools, performance snapshots, reservations, and account information.
          </Typography>
        </Container>
      </section>

      <section className="-mt-14">
        <Container>
          <div className="mx-auto max-w-xl rounded-2xl border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Property owner login form">
              <label className="block space-y-1 text-sm font-semibold text-ink-soft">
                Email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={formState.email}
                  onChange={updateField('email')}
                  className="booking-field h-11 px-3 text-base"
                  placeholder="owner@company.com"
                />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-ink-soft">
                Password
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={formState.password}
                  onChange={updateField('password')}
                  className="booking-field h-11 px-3 text-base"
                  placeholder="Enter your password"
                />
              </label>

              <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-sm text-ink-soft">
                Demo credentials: <span className="font-semibold text-ink">owner@vimex.com / demo1234</span>
              </div>

              {feedbackMessage ? (
                <p className={hasError ? 'text-sm font-semibold text-[#B13A4C]' : 'text-sm font-semibold text-success'}>{feedbackMessage}</p>
              ) : null}

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" size="lg" variant="hero" className="liquid-click--hero min-w-44" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
                <a
                  href="/contact"
                  className="text-sm font-semibold uppercase tracking-[0.05em] text-ink-soft transition-colors hover:text-ink"
                  aria-label="Contact support for account access"
                >
                  Need help?
                </a>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </main>
  )
}
