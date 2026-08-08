import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Product } from '../../types'
import { discountedPrice, useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/format'

export interface CounterSlot {
  /** Position on the counter, as a fraction of the scene. */
  x: number
  y: number
  /** Width as a fraction of the scene, so goods keep the room's perspective. */
  w: number
  /** Small tilt so the row doesn't read as a rack of identical icons. */
  tilt: number
}

interface CounterProductProps {
  product?: Product
  slot: CounterSlot
  index: number
}

/**
 * One real Sollers Shop product lying on the merchant's counter.
 *
 * The goods on offer are the shop's actual stock, not props borrowed from the
 * painting. Each sits on the counter with a contact shadow so it reads as
 * resting on the surface rather than pasted over it; hovering lifts it toward
 * the viewer, which is both the "pick it up" affordance and how the price and
 * name appear.
 */
export function CounterProduct({ product, slot, index }: CounterProductProps) {
  const still = useReducedMotion()
  const addItem = useCartStore((s) => s.addItem)
  const [taken, setTaken] = useState(false)
  const [photoOk, setPhotoOk] = useState(false)

  useEffect(() => {
    if (!taken) return
    const t = setTimeout(() => setTaken(false), 900)
    return () => clearTimeout(t)
  }, [taken])

  const style = {
    left: `${slot.x * 100}%`,
    top: `${slot.y * 100}%`,
    width: `${slot.w * 100}%`,
  } as const

  if (!product) {
    return (
      <li className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
        <div className="aspect-square w-full animate-pulse rounded-lg bg-parchment/20" />
      </li>
    )
  }

  const price = discountedPrice(product)

  return (
    <motion.li
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={style}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
    >
      <motion.button
        type="button"
        onClick={() => {
          addItem(product)
          setTaken(true)
        }}
        aria-label={`Взять «${product.title}» за ${formatPrice(price)}`}
        className="group relative block w-full rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lantern"
        style={{ rotate: `${slot.tilt}deg` }}
        whileHover={still ? undefined : { y: -14, scale: 1.14, rotate: 0 }}
        whileTap={{ scale: 0.96 }}
        animate={taken && !still ? { y: [0, -22, 0] } : undefined}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {/* A paper mat under each item. Product shots carry their own light
            backgrounds, which read as pasted-on squares against painted wood;
            setting them on a mat makes that edge deliberate — goods displayed
            on paper, the way the rest of this shop labels its wares. */}
        <span
          aria-hidden="true"
          className="absolute -inset-[9%] rounded-[3px] bg-parchment shadow-[0_2px_4px_rgba(20,14,8,0.55)] ring-1 ring-ink/25"
          style={{ rotate: `${slot.tilt * 0.6}deg` }}
        />

        {/* Contact shadow: without it the mat floats above the counter. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-1 h-1.5 rounded-[50%] bg-black/55 blur-[3px] transition-all duration-300 group-hover:-bottom-3 group-hover:opacity-70"
        />

        {/* Local illustration underneath, real product photo over it once it
            loads — so the counter is never empty, online or off. */}
        <img
          src={product.images[0]}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
            photoOk ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={product.thumbnail}
          alt={product.title}
          onLoad={() => setPhotoOk(true)}
          className={`relative h-full w-full object-contain drop-shadow-[0_2px_3px_rgba(20,14,8,0.45)] transition-opacity duration-500 ${
            photoOk ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Price tag, like a paper label set beside the goods. */}
        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-ink/25 bg-parchment-light px-1.5 py-0.5 text-[10px] font-bold text-ink opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {formatPrice(price)}
        </span>
      </motion.button>
    </motion.li>
  )
}
