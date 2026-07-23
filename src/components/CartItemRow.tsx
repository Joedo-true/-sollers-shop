import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '../types'
import { discountedPrice, useCartStore } from '../store/cartStore'
import { formatPrice } from '../utils/format'

interface CartItemRowProps {
  item: CartItem
}

/**
 * A single line in the cart drawer: thumbnail, title, per-line total and the
 * +/- quantity controls. Dropping the quantity to zero removes the line (the
 * store handles that); the row animates out via the parent's AnimatePresence.
 */
export function CartItemRow({ item }: CartItemRowProps) {
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const removeItem = useCartStore((s) => s.removeItem)

  const { product, quantity } = item
  const unit = discountedPrice(product)
  const lineTotal = Math.round(unit * quantity * 100) / 100

  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, x: 24, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex gap-3 overflow-hidden py-4"
    >
      {/* Thumbnail */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1.5">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h4 className="clamp-2 text-sm font-semibold leading-tight text-slate-800">
            {product.title}
          </h4>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={`Удалить «${product.title}» из корзины`}
            className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-0.5 text-xs text-slate-400">{formatPrice(unit)} / шт.</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity stepper */}
          <div className="flex items-center rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => decrement(product.id)}
              aria-label="Уменьшить количество"
              className="flex h-8 w-8 items-center justify-center rounded-l-lg text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => increment(product.id)}
              aria-label="Увеличить количество"
              className="flex h-8 w-8 items-center justify-center rounded-r-lg text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-900">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </motion.li>
  )
}
