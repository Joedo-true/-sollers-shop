import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'

/**
 * A slim announcement bar above the header. Scrolls away with the page while
 * the sticky header stays pinned — a small touch that makes the shop feel
 * finished and trustworthy.
 */
export function PromoBar() {
  return (
    <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2 text-xs font-medium sm:gap-8 sm:px-6 lg:px-8">
        <span className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" />
          Бесплатная доставка от $50
        </span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <RotateCcw className="h-3.5 w-3.5" />
          Возврат 30 дней
        </span>
        <span className="hidden items-center gap-1.5 md:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Безопасная оплата
        </span>
      </div>
    </div>
  )
}
