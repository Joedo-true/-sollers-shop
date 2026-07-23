import { PackageX } from 'lucide-react'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

interface ProductGridProps {
  products: Product[]
  loading: boolean
  onResetFilters: () => void
}

const SKELETON_COUNT = 8

/**
 * The responsive product grid. While `loading` is true it shows a grid of
 * shimmering skeletons; otherwise it renders the products (each fades in on
 * mount) or a friendly empty state when nothing matches.
 *
 * The grid is a plain CSS-grid container on purpose: heavy Framer `layout`
 * re-flow animations were dropped because, with a large catalog, they left
 * cards stranded mid-transform (empty space) and hurt scroll smoothness.
 */
export function ProductGrid({ products, loading, onResetFilters }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <PackageX className="h-7 w-7 text-slate-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Ничего не найдено</h3>
          <p className="mt-1 text-sm text-slate-500">
            Попробуйте изменить запрос или сбросить фильтры.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-600"
        >
          Сбросить фильтры
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
