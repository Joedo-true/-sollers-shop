import { motion, useReducedMotion } from 'framer-motion'
import { ScrollText } from 'lucide-react'
import type { Product } from '../../types'
import { SCENE } from '../../assets/scene'
import { CounterProduct, type CounterSlot } from './CounterProduct'
import { DustMotes } from './DustMotes'

interface ShopSceneProps {
  featured: Product[]
  loading: boolean
  onOpenCatalog: () => void
}

/**
 * The nine goods on display, laid out as the 3x3 grid in the approved
 * composition: three columns down the left of the room, the merchant standing
 * to their right. Values are fractions of the scene frame.
 */
const COLS = [0.088, 0.212, 0.336]
const ROWS = [0.305, 0.545, 0.762]
const SLOTS: CounterSlot[] = ROWS.flatMap((y, r) =>
  COLS.map((x, c) => ({
    x,
    y,
    w: 0.094,
    // A degree or two of tilt each, so nine identical squares read as goods
    // set out by hand rather than a spreadsheet.
    tilt: ((r * 3 + c) % 5) - 2,
  })),
)

/** Warm pools under the shop's two hanging paper lanterns. */
const LANTERNS = [
  { x: 0.545, y: 0.075 },
  { x: 0.793, y: 0.07 },
]

/**
 * The shop the visitor lands in.
 *
 * The room is the reference painting shown whole and undistorted — the frame
 * carries the art's aspect ratio, so the shape of the shop is the shape that
 * was drawn. Everything else is positioned in fractions of that frame: the
 * goods in their 3x3 grid on the left, the merchant standing to their right.
 *
 * The merchant is the relit sprite (tools/relight.py), graded to this room's
 * measured colour and lit from where its lanterns actually hang — a raw
 * cut-out reads as a sticker no matter how well it is masked.
 *
 * Every loop earns its place: the lantern glow breathes, dust hangs in the
 * light, the merchant breathes so the room reads as occupied, and a good lifts
 * when you reach for it. All of it stops under prefers-reduced-motion.
 */
export function ShopScene({ featured, loading, onOpenCatalog }: ShopSceneProps) {
  const still = useReducedMotion()

  return (
    <section
      aria-label="Лавка торговца"
      className="relative flex w-full items-center justify-center overflow-hidden bg-wood-dark px-2 py-3"
      style={{ minHeight: 'calc(100vh - 4.25rem)' }}
    >
      {/* The frame: the painting's proportions, never cropped or stretched.
          Height is whichever is smaller — what the window's height allows or
          what its width allows at this ratio — so the whole room always fits. */}
      <div
        className="relative overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/40"
        style={{
          aspectRatio: '1376 / 768',
          width: 'min(calc(100vw - 1rem), calc((100vh - 6rem) * 1.7917))',
        }}
      >
        <img
          src={SCENE.backdrop2}
          alt="Лавка торговца изнутри"
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />

        {/* Lantern glow. Paper lanterns flicker; matching that in light rather
            than moving the lantern is what makes the room feel lit. */}
        {LANTERNS.map((l, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full"
            style={{
              left: `${l.x * 100}%`,
              top: `${l.y * 100}%`,
              width: '26%',
              aspectRatio: '1',
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(circle, rgba(255,206,122,0.30), transparent 68%)',
              mixBlendMode: 'screen',
            }}
            animate={still ? undefined : { opacity: [0.75, 1, 0.85, 1, 0.78] }}
            transition={{
              duration: 6 + i * 1.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        <DustMotes count={14} />

        {/* The merchant, standing in the room to the right of his goods. */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ left: '73%', top: '13%', width: '37%', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.img
            src={SCENE.merchantLit}
            alt="Торговец"
            className="w-full"
            style={{ transformOrigin: '50% 100%' }}
            animate={still ? undefined : { scaleY: [1, 1.013, 1], y: [0, -4, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Greeting. */}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.45, ease: 'easeOut' }}
          className="absolute rounded-xl border border-ink/25 bg-parchment-light/95 px-3 py-2 shadow-xl"
          style={{ left: '45.5%', top: '13%', width: '25%' }}
        >
          <p className="text-[clamp(0.6rem,1.35vh,0.85rem)] font-semibold leading-snug text-ink">
            Заходите, странник. Слева — девять лучших товаров лавки.
          </p>
          <span
            aria-hidden="true"
            className="absolute -right-1.5 top-6 h-3 w-3 rotate-45 border-r border-t border-ink/25 bg-parchment-light"
          />
        </motion.div>

        {/* The goods: the shop's own best-rated stock. */}
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

        {/* Way into the full catalog. */}
        <div className="absolute" style={{ left: '21%', bottom: '4%', transform: 'translateX(-50%)' }}>
          <motion.button
            type="button"
            onClick={onOpenCatalog}
            whileHover={still ? undefined : { y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-lg border border-ink/40 bg-parchment px-4 py-2 text-[clamp(0.62rem,1.4vh,0.85rem)] font-bold text-ink shadow-lg transition-colors hover:bg-parchment-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lantern"
          >
            <ScrollText className="h-3.5 w-3.5" />
            Весь товар лавки
          </motion.button>
        </div>
      </div>
    </section>
  )
}
