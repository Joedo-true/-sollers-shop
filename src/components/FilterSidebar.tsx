import { RotateCcw, SlidersHorizontal, Tag } from 'lucide-react'
import type { Category, Filters } from '../types'
import { humanize } from '../utils/format'
import { RangeSlider } from './RangeSlider'

interface FilterSidebarProps {
  categories: Category[]
  brands: string[]
  loading: boolean
  filters: Filters
  priceBounds: [number, number]
  resultCount: number
  onToggleCategory: (slug: string) => void
  onToggleBrand: (brand: string) => void
  onPriceChange: (range: [number, number]) => void
  onReset: () => void
}

/**
 * The left-hand control panel: category checkboxes, brand checkboxes and the
 * price range slider. Categories and brands are derived dynamically from the
 * loaded catalog, so the filters always match the available inventory. While
 * data loads we render skeleton rows so the panel reserves its space and
 * doesn't jump when the real filters arrive (avoids layout shift / CLS).
 */
export function FilterSidebar({
  categories,
  brands,
  loading,
  filters,
  priceBounds,
  resultCount,
  onToggleCategory,
  onToggleBrand,
  onPriceChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] !== priceBounds[0] ||
    filters.priceRange[1] !== priceBounds[1]

  return (
    <div className="flex flex-col gap-6">
      {/* Heading + reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <h2 className="text-base font-bold">Фильтры</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-brand-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Сбросить
          </button>
        )}
      </div>

      {/* Price */}
      <FilterSection title="Цена">
        <RangeSlider
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={filters.priceRange}
          onChange={onPriceChange}
        />
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Категории">
        {loading ? (
          <SkeletonRows count={8} />
        ) : (
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <CheckboxRow
                  label={cat.name}
                  checked={filters.categories.includes(cat.slug)}
                  onChange={() => onToggleCategory(cat.slug)}
                />
              </li>
            ))}
          </ul>
        )}
      </FilterSection>

      {/* Brands */}
      {(loading || brands.length > 0) && (
        <FilterSection title="Бренды">
          {loading ? (
            <SkeletonRows count={8} />
          ) : (
            <ul className="space-y-1">
              {brands.map((brand) => (
                <li key={brand}>
                  <CheckboxRow
                    label={brand}
                    checked={filters.brands.includes(brand)}
                    onChange={() => onToggleBrand(brand)}
                    icon={<Tag className="h-3.5 w-3.5 text-slate-400" />}
                  />
                </li>
              ))}
            </ul>
          )}
        </FilterSection>
      )}

      {/* Result count footer */}
      <div className="rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50 to-indigo-50 px-4 py-3 text-center text-sm text-slate-600">
        Найдено товаров:{' '}
        <span className="font-bold text-brand-700">{resultCount}</span>
      </div>
    </div>
  )
}

/** Placeholder checkbox rows shown while the filters load (reserves height). */
function SkeletonRows({ count }: { count: number }) {
  return (
    <ul className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="h-4 w-4 shrink-0 rounded bg-slate-200" />
          <span
            className="h-3 animate-pulse rounded bg-slate-200"
            style={{ width: `${55 + ((i * 13) % 35)}%` }}
          />
        </li>
      ))}
    </ul>
  )
}

/** A titled group of controls. */
function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {children}
    </section>
  )
}

/** A single labelled checkbox row used for categories and brands. */
function CheckboxRow({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string
  checked: boolean
  onChange: () => void
  icon?: React.ReactNode
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? 'border-brand-600 bg-brand-600'
            : 'border-slate-300 bg-white group-hover:border-brand-400'
        }`}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5 5 9l4.5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {icon}
      <span
        className={`truncate text-sm capitalize ${
          checked ? 'font-medium text-slate-900' : 'text-slate-600'
        }`}
      >
        {label.includes('-') ? humanize(label) : label}
      </span>
    </label>
  )
}
