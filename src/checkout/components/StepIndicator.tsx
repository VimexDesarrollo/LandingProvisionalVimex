// ---------------------------------------------------------------------------
// StepIndicator.tsx — Barra visual de progreso del stepper
//
// Responsabilidad única: renderizar el estado visual de cada paso.
// No sabe nada de navegación ni de datos de la reserva.
// ---------------------------------------------------------------------------

import { FiCheck } from 'react-icons/fi'
import { STEPS } from '../constants'
import { isStepCompleted } from '../guards'
import type { CheckoutStepperState } from '../types'

interface StepIndicatorProps {
  state: CheckoutStepperState
  onStepClick?: (index: number) => void
}

export function StepIndicator({ state, onStepClick }: StepIndicatorProps) {
  const { currentStepIndex } = state
  const totalSteps = STEPS.length

  // scaleX(0) en step 0, scaleX(1) en el último paso
  const fillScale = currentStepIndex / (totalSteps - 1)

  return (
    <nav aria-label="Checkout progress" className="mb-8 px-1">
      {/*
        La pista de la línea va del centro del primer círculo (left-4 = 16px)
        al centro del último (right-4 = 16px). Los botones con justify-between
        colocan cada círculo exactamente en esos puntos.
      */}
      <ol className="relative flex items-start justify-between">

        {/* Pista de fondo — inmóvil */}
        <div
          aria-hidden="true"
          className="absolute left-4 right-4 top-4 h-0.5 -translate-y-px rounded-full bg-ink/10"
        />

        {/* Fill animado — se expande de izquierda a derecha */}
        <div
          aria-hidden="true"
          className="absolute left-4 right-4 top-4 h-0.5 -translate-y-px origin-left rounded-full bg-accent transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${fillScale})` }}
        />

        {STEPS.map((step, index) => {
          const isActive    = index === currentStepIndex
          const isCompleted = isStepCompleted(index, state)
          const isPast      = index < currentStepIndex
          const isClickable = onStepClick && (isPast || index === 0)

          return (
            <li key={step.id} className="flex flex-col items-center">
              <button
                type="button"
                aria-label={`${step.label}${isCompleted && !isActive ? ' (completed)' : isActive ? ' (current)' : ''}`}
                aria-current={isActive ? 'step' : undefined}
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(index)}
                className={`group flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:rounded-lg disabled:cursor-default ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Círculo */}
                <span
                  aria-hidden="true"
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                    isCompleted && !isActive
                      ? 'border-accent bg-accent text-white scale-100'
                      : isActive
                        ? 'border-accent bg-white text-accent shadow-[0_0_0_5px_rgba(68,184,206,0.14)] scale-110'
                        : 'border-ink/20 bg-white text-ink-soft scale-100'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <FiCheck className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>

                {/* Label */}
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isActive
                      ? 'text-accent'
                      : isCompleted
                        ? 'text-accent/60'
                        : 'text-ink/30'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
