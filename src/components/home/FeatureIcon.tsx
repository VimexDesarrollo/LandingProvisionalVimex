import type { WhyFeature } from '@/types/content'

interface FeatureIconProps {
  icon: WhyFeature['icon']
}

export function FeatureIcon({ icon }: FeatureIconProps) {
  if (icon === 'experience') {
    return (
      <svg aria-hidden="true" className="h-11 w-11 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2l2.4 4.86L20 7.64l-4 3.9.95 5.46L12 14.8l-4.95 2.2L8 11.54l-4-3.9 5.6-.78L12 2z" strokeWidth="1.5" />
      </svg>
    )
  }

  if (icon === 'support') {
    return (
      <svg aria-hidden="true" className="h-11 w-11 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 13a8 8 0 1116 0v4a2 2 0 01-2 2h-2v-6h4" strokeWidth="1.5" />
        <path d="M4 13v4a2 2 0 002 2h2v-6H4zM12 18h1" strokeWidth="1.5" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="h-11 w-11 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" strokeWidth="1.5" />
      <path d="M9 12.5h6M9 16h4" strokeWidth="1.5" />
    </svg>
  )
}
