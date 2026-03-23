import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-muted': 'rgb(var(--color-surface-muted) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--color-ink-soft) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-strong': 'rgb(var(--color-accent-strong) / <alpha-value>)',
        'card-border': 'rgb(var(--color-card-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        'brand-teal': '#66C2D0',
      },
      fontFamily: {
        display: ['"Eczar"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 18px 48px -20px rgb(var(--color-shadow) / 0.35)',
      },
      spacing: {
        section: 'var(--space-section)',
        49: '12.25rem',
        50: '12.5rem',
        51: '12.75rem',
        53: '13.25rem',
        54: '13.5rem',
        55: '13.75rem',
      },
      transitionDuration: {
        400: '400ms',
      },
      keyframes: {
        'step-in': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'step-in': 'step-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'mist-gradient': 'linear-gradient(180deg, rgb(239 246 255 / 0.9) 0%, rgb(224 238 252 / 0.94) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
