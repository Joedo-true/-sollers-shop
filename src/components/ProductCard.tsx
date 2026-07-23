import { motion } from 'framer-motion'
import { Check, ShoppingCart } from 'lucide-react'
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-[box-shadow,border-color] duration-200 hover:border-brand-200 hover:shadow-xl hover:shadow-slate-300/50"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-slate-50 to-white p-5">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm shadow-rose-500/30">
              −{Math.round(product.discountPercentage)}%
            </span>
          )}
          {product.rating >= 4.5 && (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-sm">
              ХИТ
            </span>
          )}
        </div>
        {product.stock === 0 && (
          <span className="absolute inset-x-3 bottom-3 rounded-lg bg-slate-900/80 py-1.5 text-center text-xs font-semibold text-white backdrop-blur-sm">
            Нет в наличии
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-brand-600">
            {product.brand || humanize(product.category)}
          </p>
          <StarRating value={product.rating} />
        </div>

        <h3 className="clamp-2 mt-1.5 min-h-[2.5rem] text-sm font-semibold leading-tight text-slate-800">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-slate-900">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <motion.button
          type="button"
          onClick={handleAdd}
          disabled={product.stock === 0}
          whileTap={{ scale: 0.97 }}
          aria-label={`Добавить «${product.title}» в корзину`}
          className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none ${
            justAdded
              ? 'bg-emerald-500'
              : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              Добавлено
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
              {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
            </>
          )}
        </motion.button>
      </div>
    </motion.article>
  )
}
