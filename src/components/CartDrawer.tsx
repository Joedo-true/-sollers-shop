import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingCart, X } from 'lucide-react'
import { useEffect } from 'react'
import {
  selectTotalCount,
  selectTotalPrice,
  useCartStore,
} from '../store/cartStore'
import { formatPrice } from '../utils/format'
import { CartItemRow } from './CartItemRow'

/**
 * The slide-in shopping cart. Renders a dimmed backdrop and a right-hand panel
 * that lists every line item, keeps a live running total, and offers a
 * checkout call-to-action. Closes on backdrop click or the Escape key.
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const clear = useCartStore((s) => s.clear)
  const items = useCartStore((s) => s.items)

  const count = selectTotalCount(items)
  const total = selectTotalPrice(items)

  // Close on Escape, and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Корзина покупок"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-brand-600" />
                <h2 className="text-lg font-bold text-slate-900">Корзина</h2>
                {count > 0 && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
                    {count}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Закрыть корзину"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <EmptyCart onClose={closeCart} />
            ) : (
              <>
                <ul className="scrollbar-thin flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItemRow key={item.product.id} item={item} />
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Footer / summary */}
                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-500">
                    <span>Товаров</span>
                    <span>{count} шт.</span>
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-700">
                      Итого
                    </span>
                    <motion.span
                      key={total}
                      initial={{ opacity: 0.4, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-extrabold text-slate-900"
                    >
                      {formatPrice(total)}
                    </motion.span>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
                  >
                    Оформить заказ
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    className="mt-2 w-full rounded-xl py-2 text-xs font-medium text-slate-400 transition-colors hover:text-rose-500"
                  >
                    Очистить корзину
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/** Friendly empty state shown when the basket has no items. */
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <ShoppingCart className="h-9 w-9 text-slate-300" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-800">Корзина пуста</p>
        <p className="mt-1 text-sm text-slate-500">
          Добавьте товары из каталога, чтобы оформить заказ.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Перейти к покупкам
      </button>
    </div>
  )
}
