/**
 * A shimmering placeholder shaped exactly like a ProductCard. Rendered while
 * the catalog is loading so the layout stays stable and the wait feels shorter
 * than a spinner ever could.
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Shimmer />
      </div>
      {/* Body */}
      <div className="space-y-3 p-4">
        <div className="relative h-3 w-1/3 overflow-hidden rounded bg-slate-100">
          <Shimmer />
        </div>
        <div className="relative h-4 w-4/5 overflow-hidden rounded bg-slate-100">
          <Shimmer />
        </div>
        <div className="relative h-3 w-1/2 overflow-hidden rounded bg-slate-100">
          <Shimmer />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="relative h-6 w-20 overflow-hidden rounded bg-slate-100">
            <Shimmer />
          </div>
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-slate-100">
            <Shimmer />
          </div>
        </div>
      </div>
    </div>
  )
}

/** The moving light band shared by every skeleton block. */
function Shimmer() {
  return (
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
  )
}
