import { motion, useReducedMotion } from 'framer-motion'
import { ScrollText } from 'lucide-react'
import type { Product } from '../../types'
import { SCENE } from '../../assets/scene'
import { CounterProduct, type CounterSlot } from './CounterProduct'
import { DustMotes } from './DustMotes'

interface ShopSceneProps {
  /** The eight goods laid out on the counter. */
  featured: Product[]
  loading: boolean
  onOpenCatalog: () => void
}

/**
 * Where the eight goods sit on the counter, as fractions of the scene.
 *
 * The counter dips through the middle of the room because the whole painting
 * is a fisheye, so the slots follow that curve rather than a straight line,
 * and the goods nearer the lens are drawn slightly larger.
 */
const SLOTS: CounterSlot[] = [
  { x: 0.115, y: 0.788, w: 0.105, tilt: -7 },
  { x: 0.215, y: 0.806, w: 0.110, tilt: -4 },
  { x: 0.318, y: 0.815, w: 0.112, tilt: -2 },
  { x: 0.424, y: 0.822, w: 0.114, tilt: 1 },
  { x: 0.545, y: 0.823, w: 0.114, tilt: 3 },
  { x: 0.658, y: 0.816, w: 0.112, tilt: 5 },
  { x: 0.760, y: 0.806, w: 0.110, tilt: 7 },
  { x: 0.856, y: 0.786, w: 0.104, tilt: 9 },
]

/**
 * The shop the visitor lands in.
 *
 * The room is the reference painting shown whole and unaltered — same framing,
 * same proportions — so the scene box carries the art's aspect ratio and is
 * letterboxed against dark wood rather than cropped to fit the window. Every
 * other layer is positioned in fractions of that same box, which is what keeps
 * the merchant standing on the floor and the goods sitting on the counter at
 * any window size.
 *
 * Motion is per-object and each piece earns it: the banner and the compass
 * drift because hanging cloth and a needle would, the figurine hops, dust hangs
 * in the light, and the merchant breathes so the room reads as occupied. All of
 * it stops under prefers-reduced-motion.
 */
export function ShopScene({ featured, loading, onOpenCatalog }: ShopSceneProps) {
  const still = useReducedMotion()

  return (
    <section
      aria-label="Лавка торговца"
      className="relative flex w-full items-center justify-center overflow-hidden bg-wood-dark py-4"
      style={{ minHeight: 'calc(100vh - 4.25rem)' }}
    >
      {/* The scene box: the painting's own proportions, never distorted.
          Its height is whichever is smaller — what the window's height allows,
          or what its width allows at this aspect ratio — so the whole room
          stays visible and uncropped at any window shape. A percentage height
          cannot be used here: the flex parent is sized by its content, so
          `height: 100%` would have nothing to resolve against. */}
      <div
        className="relative shadow-2xl"
        style={{
          aspectRatio: '848 / 1264',
          height: 'min(calc(100vh - 5.5rem), calc((100vw - 1.5rem) * 1.4906))',
        }}
      >
        <img
          src={SCENE.backdrop}
          alt="Лавка торговца изнутри"
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />

        {/* Banner across the top: hanging cloth, so it drifts. */}
        <motion.img
          src={SCENE.banner}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: '3.5%', top: '0%', width: '94%', transformOrigin: '50% 0%' }}
          animate={still ? undefined : { rotate: [-0.45, 0.45, -0.45] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Compass: the needle never quite settles. */}
        <motion.img
          src={SCENE.compass}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: '83.8%', top: '52.7%', width: '15.7%', transformOrigin: '50% 60%' }}
          animate={still ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* The figurine at the end of the counter. */}
        <motion.img
          src={SCENE.rabbit}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: '89.8%', top: '72.3%', width: '6.9%' }}
          animate={still ? undefined : { y: ['0%', '-16%', '0%', '0%', '0%'] }}
          transition={{ duration: 5.5, repeat: Infinity, times: [0, 0.07, 0.16, 0.55, 1] }}
        />

        <DustMotes />

        {/* The merchant, standing in the room behind his counter. */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ left: '50%', top: '30%', width: '34%', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.img
            src={SCENE.merchant}
            alt="Торговец"
            className="w-full drop-shadow-[0_16px_18px_rgba(18,12,7,0.65)]"
            style={{ transformOrigin: '50% 100%' }}
            animate={still ? undefined : { scaleY: [1, 1.014, 1], y: [0, -3, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Greeting, tucked into the room's left-hand wall. */}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.45, ease: 'easeOut' }}
          className="absolute rounded-xl border border-ink/25 bg-parchment-light/95 px-3 py-2 shadow-xl"
          style={{ left: '4%', top: '17%', width: '40%' }}
        >
          <p className="text-[clamp(0.62rem,1.5vh,0.9rem)] font-semibold leading-snug text-ink">
            Заходите, странник. На прилавке — восемь лучших товаров лавки.
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-ink/25 bg-parchment-light"
          />
        </motion.div>

        {/* The goods: the shop's own best-rated stock, laid out on the counter. */}
        <ul className="absolute inset-0">
          {(loading ? Array.from({ length: SLOTS.length }) : featured).map((p, i) => (
            <CounterProduct
              key={(p as Product)?.id ?? i}
              product={p as Product | undefined}
              slot={SLOTS[i] ?? SLOTS[SLOTS.length - 1]}
              index={i}
            />
          ))}
        </ul>

        {/* Way into the full catalog, resting on the shop floor. */}
        <div className="absolute inset-x-0" style={{ bottom: '2.5%' }}>
          <div className="flex justify-center">
            <motion.button
              type="button"
              onClick={onOpenCatalog}
              whileHover={still ? undefined : { y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-lg border border-ink/40 bg-parchment px-4 py-2 text-[clamp(0.65rem,1.5vh,0.85rem)] font-bold text-ink shadow-lg transition-colors hover:bg-parchment-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lantern"
            >
              <ScrollText className="h-3.5 w-3.5" />
              Весь товар лавки
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
