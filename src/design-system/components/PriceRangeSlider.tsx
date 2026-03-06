import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

interface PriceRangeSliderProps {
  prices: number[]
  selectedMin?: number
  selectedMax?: number
  onChange: (nextRange: { min?: number; max?: number }) => void
}

const HEIGHT_LEVEL_CLASSES = ['h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8', 'h-9', 'h-10', 'h-11', 'h-12'] as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function PriceRangeSlider({ prices, selectedMin, selectedMax, onChange }: PriceRangeSliderProps) {
  const sanitizedPrices = useMemo(() => prices.filter((value) => Number.isFinite(value) && value > 0), [prices])
  const fallbackPrices = useMemo(() => (sanitizedPrices.length > 0 ? sanitizedPrices : [100, 1000]), [sanitizedPrices])

  const limits = useMemo(() => {
    const minValue = Math.min(...fallbackPrices)
    const maxValue = Math.max(...fallbackPrices)
    const min = Math.floor(minValue / 10) * 10
    const max = Math.ceil(maxValue / 10) * 10

    return {
      min,
      max: max === min ? min + 10 : max,
    }
  }, [fallbackPrices])

  const currentMin = clamp(selectedMin ?? limits.min, limits.min, limits.max)
  const currentMax = clamp(selectedMax ?? limits.max, limits.min, limits.max)
  const boundedMin = Math.min(currentMin, currentMax)
  const boundedMax = Math.max(currentMin, currentMax)
  const [draftRange, setDraftRange] = useState<{ min: number; max: number }>({
    min: boundedMin,
    max: boundedMax,
  })
  const draftRangeRef = useRef<{ min: number; max: number }>({ min: boundedMin, max: boundedMax })
  const isDraggingRef = useRef<boolean>(false)
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null)

  useEffect(() => {
    if (isDraggingRef.current) {
      return
    }

    const nextDraft = { min: boundedMin, max: boundedMax }
    draftRangeRef.current = nextDraft
    setDraftRange(nextDraft)
  }, [boundedMax, boundedMin])

  const bins = useMemo(() => {
    const binCount = 28
    const width = (limits.max - limits.min) / binCount
    const counts = new Array<number>(binCount).fill(0)

    fallbackPrices.forEach((value) => {
      const normalized = (value - limits.min) / (limits.max - limits.min)
      const index = Math.min(binCount - 1, Math.max(0, Math.floor(normalized * binCount)))
      counts[index] += 1
    })

    const maxCount = Math.max(...counts, 1)

    return counts.map((count, index) => {
      const level = count === 0 ? 0 : Math.max(1, Math.round((count / maxCount) * HEIGHT_LEVEL_CLASSES.length))
      const binStart = limits.min + width * index
      const binEnd = binStart + width
      const isSelected = binEnd >= draftRange.min && binStart <= draftRange.max

      return {
        key: `bin-${index}`,
        className: level === 0 ? 'h-0' : HEIGHT_LEVEL_CLASSES[level - 1],
        hasData: count > 0,
        isSelected,
      }
    })
  }, [draftRange.max, draftRange.min, fallbackPrices, limits.max, limits.min])

  const minPercent = ((draftRange.min - limits.min) / (limits.max - limits.min)) * 100
  const maxPercent = ((draftRange.max - limits.min) / (limits.max - limits.min)) * 100

  const emitRange = useCallback((nextMin: number, nextMax: number) => {
    onChange({
      min: nextMin <= limits.min ? undefined : nextMin,
      max: nextMax >= limits.max ? undefined : nextMax,
    })
  }, [limits.max, limits.min, onChange])

  const commitDraftRange = useCallback(() => {
    const { min, max } = draftRangeRef.current
    emitRange(min, max)
  }, [emitRange])

  const startDragging = (thumb: 'min' | 'max') => {
    isDraggingRef.current = true
    setActiveThumb(thumb)
  }

  const stopDraggingAndCommit = () => {
    if (!isDraggingRef.current) {
      return
    }

    isDraggingRef.current = false
    setActiveThumb(null)
    commitDraftRange()
  }

  const updateDraftRange = (nextRange: { min: number; max: number }) => {
    draftRangeRef.current = nextRange
    setDraftRange(nextRange)
  }

  return (
    <section className="space-y-3 border-t border-card-border pt-4" aria-label="Price range">
      <div>
        <h4 className="text-base font-semibold text-ink">Price range</h4>
        <p className="text-sm text-ink-soft">Use the slider to define your nightly budget.</p>
      </div>

      <div className="rounded-xl border border-card-border bg-white/82 p-3">
        <div className="mx-auto w-full max-w-[36rem]">
          <div className="grid h-14 grid-cols-[repeat(28,minmax(0,1fr))] items-end gap-1 border-b border-card-border/80 pb-2">
            {bins.map((bin) => (
              <span
                key={bin.key}
                aria-hidden
                className={cn(
                  'w-full rounded-t-sm transition-colors duration-200',
                  bin.className,
                  bin.hasData ? (bin.isSelected ? 'bg-accent/90' : 'bg-accent/25') : 'bg-transparent',
                )}
              />
            ))}
          </div>

          <div className="relative mt-3 h-9">
            <div aria-hidden className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-muted" />
            <div
              aria-hidden
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent/55 transition-[left,width] duration-180 ease-out"
              style={{ left: `${minPercent}%`, width: `${Math.max(0, maxPercent - minPercent)}%` }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
              <span
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-180 ease-out"
                style={{ left: `${minPercent}%` }}
              >
                <span
                  className={`price-range-visual-thumb block h-5 w-5 rounded-full border-2 border-accent bg-white shadow-[0_8px_18px_-12px_rgba(13,31,74,0.65)] transition-all duration-180 ${
                    activeThumb === 'min'
                      ? 'scale-105 shadow-[0_10px_20px_-10px_rgba(13,31,74,0.78)]'
                      : 'animate-[price-thumb-breathe_1.65s_ease-in-out_infinite]'
                  }`}
                />
              </span>
              <span
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-180 ease-out"
                style={{ left: `${maxPercent}%` }}
              >
                <span
                  className={`price-range-visual-thumb block h-5 w-5 rounded-full border-2 border-accent bg-white shadow-[0_8px_18px_-12px_rgba(13,31,74,0.65)] transition-all duration-180 ${
                    activeThumb === 'max'
                      ? 'scale-105 shadow-[0_10px_20px_-10px_rgba(13,31,74,0.78)]'
                      : 'animate-[price-thumb-breathe_1.65s_ease-in-out_infinite]'
                  }`}
                />
              </span>
            </div>
            <input
              type="range"
              min={limits.min}
              max={limits.max}
              step={10}
              value={draftRange.min}
              aria-label="Minimum nightly price"
              className="price-range-input absolute inset-0 z-10 w-full"
              onChange={(event) => {
                const nextMin = Math.min(Number(event.currentTarget.value), draftRangeRef.current.max)
                const nextRange = { min: nextMin, max: draftRangeRef.current.max }
                updateDraftRange(nextRange)
                if (!isDraggingRef.current) {
                  emitRange(nextRange.min, nextRange.max)
                }
              }}
              onPointerDown={() => startDragging('min')}
              onPointerUp={stopDraggingAndCommit}
              onBlur={() => {
                setActiveThumb(null)
                commitDraftRange()
              }}
            />
            <input
              type="range"
              min={limits.min}
              max={limits.max}
              step={10}
              value={draftRange.max}
              aria-label="Maximum nightly price"
              className="price-range-input absolute inset-0 z-20 w-full"
              onChange={(event) => {
                const nextMax = Math.max(Number(event.currentTarget.value), draftRangeRef.current.min)
                const nextRange = { min: draftRangeRef.current.min, max: nextMax }
                updateDraftRange(nextRange)
                if (!isDraggingRef.current) {
                  emitRange(nextRange.min, nextRange.max)
                }
              }}
              onPointerDown={() => startDragging('max')}
              onPointerUp={stopDraggingAndCommit}
              onBlur={() => {
                setActiveThumb(null)
                commitDraftRange()
              }}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">Minimum</p>
              <p className="inline-flex min-w-[7.5rem] justify-center rounded-pill border border-card-border bg-white px-3 py-1.5 text-sm font-semibold text-ink">
                {formatUsd(draftRange.min)}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">Maximum</p>
              <p className="ml-auto inline-flex min-w-[7.5rem] justify-center rounded-pill border border-card-border bg-white px-3 py-1.5 text-sm font-semibold text-ink">
                {formatUsd(draftRange.max)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] font-medium text-ink-soft/80">
            Drag the handles to adjust your price range.
          </p>
        </div>
      </div>
    </section>
  )
}
