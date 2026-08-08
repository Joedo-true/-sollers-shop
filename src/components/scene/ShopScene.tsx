import { motion, useReducedMotion } from 'framer-motion'
import { ScrollText } from 'lucide-react'
import type { Product } from '../../types'
import { GOOD_SPRITES, SCENE } from '../../assets/scene'
import { CounterGood } from './CounterGood'
import { DustMotes } from './DustMotes'

interface ShopSceneProps {
  /** The eight goods laid out on the counter. */
  featured: Product[]
  loading: boolean
  onOpenCatalog: () => void
}

/**
 * The room the visitor lands in: a lantern-lit barrel shop seen through a
 * fisheye, with the merchant behind his counter and eight goods laid out in
 * front of him.
 *
 * Every layer is a sprite cut from the reference art, stacked in depth order
 * and given its own motion. Nothing here loops for decoration's sake — the
 * banner and the compass drift because cloth and a needle would, the dust
 * hangs in the light shaft, and the merchant breathes so the room reads as
 * inhabited rather than a still. All of it stops under prefers-reduced-motion.
 */
export function ShopScene({ featured, loading, onOpenCatalog }: ShopSceneProps) {
  const still = useReducedMotion()

  return (
    <section
      aria-label="Лавка торговца"
      className="relative isolate w-full overflow-hidden bg-wood-dark"
      style={{ minHeight: 'min(88vh, 60rem)' }}
    >
      {/* One stage shared by the backdrop and every overlay.
          The sprites were cut as fractions of the source art, so as long as
          they are positioned with those same fractions inside a box that has
          the art's aspect ratio, each overlay lands exactly on top of the
          object it was cut from — no second compass floating beside the
          painted one. translateY picks the band of the (tall) painting that
          the viewport shows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 w-full"
        style={{ aspectRatio: '848 / 1264', transform: 'translateY(-33%)' }}
      >
        <img src={SCENE.backdrop} alt="" className="absolute inset-0 h-full w-full" />

        {/* Compass on its stand: the needle never quite settles. */}
        <motion.img
          src={SCENE.compass}
          alt=""
          className="absolute"
          style={{ left: '83.8%', top: '52.7%', width: '15.7%',
                   transformOrigin: '50% 60%' }}
          animate={still ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* The figurine at the end of the counter. */}
        <motion.img
          src={SCENE.rabbit}
          alt=""
          className="absolute"
          style={{ left: '89.8%', top: '72.3%', width: '6.9%' }}
          animate={still ? undefined : { y: ['0%', '-14%', '0%', '0%', '0%'] }}
          transition={{ duration: 5.5, repeat: Infinity,
                        times: [0, 0.07, 0.16, 0.5, 1] }}
        />
      </div>

      {/* Lantern light from the skylight, and the dark barrel edges. Both are
          painted in the original; deepening them lets the merchant and the
          goods sit clearly in front of the room. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 40% at 50% 12%, rgba(255,228,170,0.34), transparent 72%),' +
            'radial-gradient(80% 64% at 50% 60%, transparent 28%, rgba(24,17,11,0.88) 100%)',
        }}
      />

      <DustMotes />

      {/* The merchant. He breathes; that alone makes the room feel occupied. */}
      <motion.div
        className="absolute bottom-[27%] left-1/2 w-[30%] min-w-[230px] max-w-[400px] -translate-x-1/2"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.img
          src={SCENE.merchant}
          alt="Торговец за прилавком"
          className="w-full drop-shadow-2xl"
          style={{ transformOrigin: '50% 100%' }}
          animate={still ? undefined : { scaleY: [1, 1.012, 1], y: [0, -3, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Greeting. Speaks as a trader would, about this shop's actual stock. */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.45, ease: 'easeOut' }}
        className="absolute left-[6%] top-[13%] w-[78%] max-w-xs rounded-2xl border border-ink/20 bg-parchment-light/95 px-5 py-3 shadow-xl sm:w-[42%]"
      >
        <p className="text-sm font-semibold leading-snug text-ink">
          Заходите, странник. Сегодня на прилавке — восемь лучших свитков
          из моего обоза.
        </p>
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-10 h-4 w-4 rotate-45 border-b border-r border-ink/20 bg-parchment-light"
        />
      </motion.div>

      {/* The figurine on the end of the counter, watching the shop. */}
      <motion.img
        src={SCENE.rabbit}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[19%] right-[6%] w-[5%] min-w-[34px]"
        animate={still ? undefined : { y: [0, -7, 0, 0, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, times: [0, 0.07, 0.16, 0.5, 1] }}
      />

      {/* Counter: the eight goods on offer. */}
      <div className="absolute inset-x-0 bottom-0 pb-6 pt-2">
        <ul className="mx-auto flex max-w-4xl items-end justify-center gap-[1.1%] px-3">
          {(loading ? Array.from({ length: 8 }) : featured).map((p, i) => (
            <CounterGood
              key={(p as Product)?.id ?? i}
              product={p as Product | undefined}
              sprite={GOOD_SPRITES[i % GOOD_SPRITES.length]}
              index={i}
            />
          ))}
        </ul>

        <div className="mt-4 flex justify-center">
          <motion.button
            type="button"
            onClick={onOpenCatalog}
            whileHover={still ? undefined : { y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/30 bg-parchment px-6 py-3 text-sm font-bold text-ink shadow-lg transition-colors hover:bg-parchment-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lantern"
          >
            <ScrollText className="h-4 w-4" />
            Развернуть полный список товаров
          </motion.button>
        </div>
      </div>
    </section>
  )
}
