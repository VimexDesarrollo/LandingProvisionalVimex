import { useMemo, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa6'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { Button } from '@/design-system/components/Button'

interface FormState {
  name: string
  email: string
  phone: string
  message: string
  arrival: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
  arrival: '',
}

const whatsappNumber = '5219848032231'

export function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent('Hi Vimex team, I would like to plan a stay in Playa del Carmen.')
    return `https://wa.me/${whatsappNumber}?text=${text}`
  }, [])

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // In a real backend-ready flow, dispatch to API endpoint here
  }

  return (
    <main className="pb-section pt-28">
      <section className="relative isolate overflow-hidden pb-16 text-white">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80"
          alt="Calm Caribbean sea at sunset"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(10,26,64,0.55),rgba(6,14,34,0.82))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/55" />
        <Container className="relative z-10 space-y-4 py-14">
          <Typography as="p" variant="caption" className="text-white/80">
            Contact
          </Typography>
          <Typography as="h1" variant="display" className="max-w-4xl">
            Tell us about your stay, we will curate the rest
          </Typography>
          <Typography className="max-w-3xl text-lg text-white/85 md:text-xl">
            A concierge will reply promptly with tailored recommendations and availability.
          </Typography>
        </Container>
      </section>

      <section className="-mt-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm font-semibold text-ink-soft">
                  Full Name
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    className="booking-field h-11 px-3 text-base"
                    placeholder="Your name"
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold text-ink-soft">
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="booking-field h-11 px-3 text-base"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold text-ink-soft">
                  Phone (optional)
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className="booking-field h-11 px-3 text-base"
                    placeholder="+52 1 ..."
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold text-ink-soft">
                  Preferred Arrival
                  <input
                    type="date"
                    value={form.arrival}
                    onChange={handleChange('arrival')}
                    className="booking-field h-11 px-3 text-base"
                    onClick={(event) => event.currentTarget.showPicker?.()}
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-1 text-sm font-semibold text-ink-soft">
                How can we help?
                <textarea
                  required
                  value={form.message}
                  onChange={handleChange('message')}
                  className="booking-field min-h-[140px] w-full px-3 py-3 text-base"
                  placeholder="Tell us about your stay, guests, and any special requests."
                />
              </label>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="submit" size="lg" variant="hero" className="liquid-click--hero">
                  Send Inquiry
                </Button>
                <a
                  className="liquid-click liquid-click--nav inline-flex h-14 items-center gap-2 rounded-pill border border-accent/40 bg-accent/12 px-5 text-base font-semibold uppercase tracking-[0.04em] text-accent transition-colors duration-300 hover:bg-accent/18"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Start WhatsApp chat"
                >
                  <FaWhatsapp aria-hidden className="h-5 w-5" />
                  WhatsApp
                </a>
              </div>
            </form>

            <div className="rounded-2xl border border-white/70 bg-white/55 p-6 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/45">
              <Typography as="h3" variant="h3" className="text-3xl">
                Our concierge is local and responsive
              </Typography>
              <Typography className="mt-3 text-base text-ink-soft">
                Expect quick follow-up with curated options, airport transfer coordination, and in-villa services tailored to your stay.
              </Typography>
              <div className="mt-6 space-y-4 text-base">
                <div>
                  <Typography className="font-semibold">Call us</Typography>
                  <Typography className="text-ink-soft">US & Canada: +1 510 990 3091</Typography>
                  <Typography className="text-ink-soft">Mexico: +52 984 803 2231</Typography>
                </div>
                <div>
                  <Typography className="font-semibold">Email</Typography>
                  <a className="text-accent underline decoration-2 decoration-accent/60 transition-colors hover:text-accent-strong" href="mailto:info@vimexvacationrentals.com">
                    info@vimexvacationrentals.com
                  </a>
                </div>
                <div>
                  <Typography className="font-semibold">Office</Typography>
                  <Typography className="text-ink-soft">Playa del Carmen, Quintana Roo, Mexico</Typography>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
