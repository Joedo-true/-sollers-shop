import { LayoutGrid } from 'lucide-react'
import type { Category } from '../types'

interface CategoryChipsProps {
  categories: Category[]
  selected: string[]
  onToggle: (slug: string) => void
  onClear: () => void
  loading: boolean
}

/**
 * A horizontally-scrollable strip of category pills for quick browsing. Shares
 * the same selection state as the sidebar checkboxes, so toggling here updates
 * everything in sync. An "Все" pill clears the category filter.
 */
export function CategoryChips({
  categories,
  selected,
  onToggle,
  onClear,
  loading,
}: CategoryChipsProps) {
  if (loading) {
    return (
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-slate-200/70"
          />
        ))}
      </div>
    )
  }

  if (categories.length === 0) return null

  const allActive = selected.length === 0

  return (
    <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={onClear}
        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          allActive
            ? 'border-transparent bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
            : 'border-slate-200 bg-white text-slate-600 shadow-soft hover:border-brand-300 hover:text-brand-600'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        Все
      </button>

      {categories.map((cat) => {
        const active = selected.includes(cat.slug)
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onToggle(cat.slug)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? 'border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
