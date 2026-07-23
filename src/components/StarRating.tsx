import { Star } from 'lucide-react'

interface StarRatingProps {
  /** Rating from 0 to 5. */
  value: number
  /** Show the numeric value next to the stars. */
  showValue?: boolean
}

/**
 * Renders a 5-star rating with support for partial (fractional) fills using a
 * clipped overlay, so a 4.3 rating shows the fourth star 30% filled.
 */
export function StarRating({ value, showValue = true }: StarRatingProps) {
  const rounded = Math.round(value * 10) / 10
  const percent = Math.max(0, Math.min(100, (rounded / 5) * 100))

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative inline-flex" aria-label={`Рейтинг ${rounded} из 5`}>
        {/* Empty (grey) stars in the background */}
        <div className="flex text-slate-300">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        {/* Filled (amber) stars, clipped to the rating percentage */}
        <div
          className="absolute inset-0 flex overflow-hidden text-amber-400"
          style={{ width: `${percent}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 shrink-0" fill="currentColor" strokeWidth={0} />
          ))}
        </div>
      </div>
      {showValue && (
        <span className="text-xs font-medium text-slate-500">{rounded.toFixed(1)}</span>
      )}
    </div>
  )
}
