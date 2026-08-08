import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Product } from '../../types'
import { discountedPrice, useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/format'

interface CounterGoodProps {
  /** Undefined while the catalog is still loading. */
  product?: Product
  sprite: string
  index: number
}

/**
 * One rolled scroll lying on the counter.
 *
 * Hovering lifts and straightens it, the way you'd tilt something up to read
 * the label — that is the whole point of cutting each good out separately, and
 * it doubles as the affordance that it can be picked up. Taking one adds it to
 * the cart and the scroll bobs once in acknowledgement.
 */
export function CounterGood({ product, sprite, index }: CounterGoodProps) {
  const still = useReducedMotion()
  const addItem = useCartStore((s) => s.addItem)
  const [taken, setTaken] = useState(false)

  useEffect(() => {
    if (!taken) return
    const t = setTimeout(() => setTaken(false), 900)
    return () => clearTimeout(t)
  }, [taken])

  if (!product) {
    return (
      <li className="w-[11.5%] min-w-[58px]">
        <div className="mx-auto h-28 w-3/4 animate-pulse rounded-full bg-parchment/25" />
      </li>
    )
  }

  const price = discountedPrice(product)

  return (
    <motion.li
      className="w-[11.5%] min-w-[58px]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.07, duration: 0.4, ease: 'easeOut' }}
    >
      <motion.button
        type="button"
        onClick={() => {
          addItem(product)
          setTaken(true)
        }}
        title={`${product.title} — ${formatPrice(price)}`}
        aria-label={`Взять «${product.title}» за ${formatPrice(price)}`}
        className="group relative block w-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lantern"
        whileHover={still ? undefined : { y: -18, rotate: -4, scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        animate={taken && !still ? { y: [0, -26, 0] } : undefined}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <img
          src={sprite}
          alt=""
          aria-hidden="true"
          className="w-full drop-shadow-[0_10px_10px_rgba(20,14,8,0.55)]"
        />

        {/* Label unrolls on hover — the price shouldn't shout across all eight
            at once, but must be one gesture away. */}
        <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-ink/25 bg-parchment-light px-2 py-0.5 text-[11px] font-bold text-ink opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {formatPrice(price)}
        </span>
      </motion.button>
    </motion.li>
  )
}
