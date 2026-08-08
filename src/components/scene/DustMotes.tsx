import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

/**
 * Specks drifting in the shaft of light from the skylight.
 *
 * This is the one purely atmospheric animation in the scene, and it earns its
 * place by giving the light volume — without it the glow reads as a flat
 * overlay rather than air in a room. Positions are seeded once so they don't
 * reshuffle on every render.
 */
export function DustMotes({ count = 18 }: { count?: number }) {
  const still = useReducedMotion()

  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
        return {
          left: 18 + r(1) * 64,
          top: 4 + r(2) * 46,
          size: 2 + r(3) * 3.5,
          drift: 14 + r(4) * 26,
          duration: 11 + r(5) * 12,
          delay: r(6) * 8,
          opacity: 0.22 + r(7) * 0.4,
        }
      }),
    [count],
  )

  if (still) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#ffe9bd]"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
          }}
          animate={{ y: [0, m.drift, 0], x: [0, m.drift * 0.4, 0] }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
