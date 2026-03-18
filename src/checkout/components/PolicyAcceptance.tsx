// ---------------------------------------------------------------------------
// PolicyAcceptance.tsx — Checkbox de aceptación de políticas
//
// Componente atómico: un checkbox con su label y estado de error.
// El texto de las políticas viene de constants para no hardcodear en UI.
// ---------------------------------------------------------------------------

import { POLICY_ACCEPTANCE_TEXT } from '../constants'

interface PolicyAcceptanceProps {
  accepted: boolean
  onChange: (accepted: boolean) => void
  error?: string
}

export function PolicyAcceptance({ accepted, onChange, error }: PolicyAcceptanceProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          name="policyAccepted"
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'policy-error' : undefined}
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-ink/30 accent-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        />
        <span>
          {POLICY_ACCEPTANCE_TEXT}{' '}
          <a
            href="/cancellation-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
          >
            View policies
          </a>
        </span>
      </label>
      {error ? (
        <p id="policy-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
