import { ArrowRight, ShoppingBag, Sparkles, Truck, Zap } from 'lucide-react'
import { getLenis } from '../hooks/useSmoothScroll'

interface HeroProps {
  /** Total number of products in the catalog, shown as a stat. */
  productCount: number
}

/**
 * The landing banner at the top of the catalog. A vivid gradient panel with
 * soft decorative glows, a headline, a call-to-action that glides down to the
 * grid, and a few trust stats — it gives the shop a real storefront identity.
 */
export function Hero({ productCount }: HeroProps) {
  const scrollToCatalog = () => {
    const target = document.getElementById('catalog')
    const lenis = getLenis()
    if (lenis && target) lenis.scrollTo(target, { offset: -80 })
    else target?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 px-6 py-10 text-white shadow-xl shadow-brand-900/20 sm:px-10 sm:py-14">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-brand-400/20 blur-2xl" />

      {/* Oversized watermark icon */}
      <ShoppingBag
        strokeWidth={1.25}
        className="pointer-events-none absolute -right-4 bottom-0 hidden h-56 w-56 text-white/10 lg:block"
      />

      <div className="relative max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Новая коллекция 2026
        </span>

        <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          Технологии, которые
          <span className="block bg-gradient-to-r from-white to-brand-100 bg-clip-text text-transparent">
            вдохновляют
          </span>
        </h1>

        <p className="mt-4 max-w-md text-sm text-white/80 sm:text-base">
          Тысячи товаров ведущих брендов с быстрой доставкой и честными ценами.
          Найдите то, что вам по душе, в Sollers Shop.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={scrollToCatalog}
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 shadow-lg shadow-brand-900/20 transition-transform hover:-translate-y-0.5"
          >
            Перейти в каталог
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="flex items-center gap-4 pl-1 text-xs font-medium text-white/85 sm:gap-6">
            <Stat icon={<Zap className="h-4 w-4" />} label={`${productCount}+ товаров`} />
            <Stat icon={<Truck className="h-4 w-4" />} label="Доставка 1–2 дня" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
        {icon}
      </span>
      {label}
    </span>
  )
}
