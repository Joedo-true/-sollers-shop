import { motion } from 'framer-motion'
import { Search, ShoppingBag, ShoppingCart, X } from 'lucide-react'
import { selectTotalCount, useCartStore } from '../store/cartStore'

interface HeaderProps {
  search: string
  onSearchChange: (value: string) => void
}

/**
 * Sticky top bar: brand logo, the always-visible live search field, and the
 * cart button with a live item-count badge. The search is wired to the app's
 * global filter state and debounced upstream.
 */
export function Header({ search, onSearchChange }: HeaderProps) {
  const items = useCartStore((s) => s.items)
  const openCart = useCartStore((s) => s.openCart)
  const count = selectTotalCount(items)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-slate-900 sm:block">
            Sollers<span className="text-brand-600"> Shop</span>
          </span>
        </a>

        {/* Live search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск товаров…"
            aria-label="Поиск товаров"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Очистить поиск"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Cart button */}
        <button
          type="button"
          onClick={openCart}
          aria-label={`Открыть корзину, товаров: ${count}`}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white"
            >
              {count > 99 ? '99+' : count}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  )
}
