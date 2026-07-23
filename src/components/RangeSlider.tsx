import { useCallback } from 'react'
import { formatPrice } from '../utils/format'

interface RangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
}

/**
 * A dual-thumb price range slider built from two overlaid native range inputs.
 * The coloured track between the thumbs is drawn with a gradient so the
 * selected span is always obvious. Thumbs can't cross each other.
 */
export function RangeSlider({ min, max, value, onChange, step = 1 }: RangeSliderProps) {
  const [low, high] = value
  const range = Math.max(1, max - min)

  const lowPercent = ((low - min) / range) * 100
  const highPercent = ((high - min) / range) * 100

  const handleLow = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Math.min(Number(e.target.value), high - step)
      onChange([next, high])
    },
    [high, step, onChange],
  )

  const handleHigh = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Math.max(Number(e.target.value), low + step)
      onChange([low, next])
    },
    [low, step, onChange],
  )

  return (
    <div className="px-1">
      <div className="relative h-5">
        {/* Base track */}
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-slate-200" />
        {/* Selected span */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-500"
          style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
        />
        {/* Lower thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleLow}
          aria-label="Минимальная цена"
          className="range-thumb pointer-events-none absolute h-5 w-full appearance-none bg-transparent"
        />
        {/* Upper thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleHigh}
          aria-label="Максимальная цена"
          className="range-thumb pointer-events-none absolute h-5 w-full appearance-none bg-transparent"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-600">
        <span className="rounded-md bg-slate-100 px-2 py-1">{formatPrice(low)}</span>
        <span className="rounded-md bg-slate-100 px-2 py-1">{formatPrice(high)}</span>
      </div>
    </div>
  )
}
