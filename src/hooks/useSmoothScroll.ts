import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Shared Lenis instance so any component (e.g. the "scroll to top" button or
 * the cart drawer's scroll lock) can drive the same smooth-scroll engine.
 */
let lenisInstance: Lenis | null = null
export function getLenis(): Lenis | null {
  return lenisInstance
}

/**
 * Enables buttery, eased mouse-wheel and touch scrolling for the whole page.
 *
 * Plain CSS `scroll-behavior: smooth` only smooths programmatic/anchor jumps —
 * it does nothing for the mouse wheel. Lenis intercepts wheel/touch input and
 * animates the scroll position on a requestAnimationFrame loop, which is what
 * actually makes wheel scrolling feel smooth. Disabled when the user asks the
 * OS for reduced motion.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenisInstance = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}
