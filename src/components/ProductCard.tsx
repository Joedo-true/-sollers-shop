import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { discountedPrice, useCartStore } from '../store/cartStore'
import { formatPrice, humanize } from '../utils/format'
import { StarRating } from './StarRating'

interface ProductCardProps {
  product: Product
}

/**
 * A single product tile: image, brand, title, rating, price and a quick
 * "add to cart" button. Appears with a soft fade/slide via Framer Motion and
 * gives instant visual feedback when added to the basket.
 */
export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [justAdded, setJustAdded] = useState(false)

  const price = discountedPrice(product)
  const hasDiscount = product.discountPercentage >= 1

  // Reset the "added" confirmation after a short beat.
  useEffect(() => {
    if (!justAdded) return
    const timer = setTimeout(() => setJustAdded(false), 1200)
    return () => clearTimeout(timer)
  }, [justAdded])

  const handleAdd = () => {
    addItem(product)
    setJustAdded(true)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-[box-shadow,border-color] duration-200 hover:border-brand-200 hover:shadow-xl hover:shadow-slate-300/50"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-slate-50 to-white p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-white">
            Нет в наличии
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {product.brand || humanize(product.category)}
        </p>
        <h3 className="clamp-2 mt-1 min-h-[2.5rem] text-sm font-semibold leading-tight text-slate-800">
          {product.title}
        </h3>

        <div className="mt-2">
          <StarRating value={product.rating} />
        </div>

        {/* Price + add button pinned to the bottom */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {hasDiscount && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </p>
            )}
            <p className="text-lg font-bold text-slate-900">{formatPrice(price)}</p>
          </div>

          <motion.button
            type="button"
            onClick={handleAdd}
            disabled={product.stock === 0}
            whileTap={{ scale: 0.9 }}
            aria-label={`Добавить «${product.title}» в корзину`}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${
              justAdded
                ? 'bg-emerald-500'
                : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {justAdded ? (
              <Check className="h-5 w-5" strokeWidth={2.5} />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
