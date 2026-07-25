import { AnimatePresence, motion } from 'framer-motion'
import { Plus, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchCategories, fetchProducts } from './api/products'
import { CartDrawer } from './components/CartDrawer'
import { CategoryChips } from './components/CategoryChips'
import { ErrorState } from './components/ErrorState'
import { FilterSidebar } from './components/FilterSidebar'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProductGrid } from './components/ProductGrid'
import { PromoBar } from './components/PromoBar'
import { ScrollToTop } from './components/ScrollToTop'
import { SortSelect } from './components/SortSelect'
import { useDebounce } from './hooks/useDebounce'
import { getLenis, useSmoothScroll } from './hooks/useSmoothScroll'
import { discountedPrice } from './store/cartStore'
import type { Category, Filters, Product, SortOption } from './types'

/** How many products to reveal per "page" of the infinite-scroll grid. */
const PAGE_SIZE = 24

export default function App() {
  // Smooth, eased mouse-wheel / touch scrolling for the whole page.
  useSmoothScroll()

  /* ---- Server data ---- */
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Bumping this key re-runs the data effect (used by "try again").
  const [reloadKey, setReloadKey] = useState(0)

  /* ---- Filter state ---- */
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>('default')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [priceTouched, setPriceTouched] = useState(false)

  // Mobile filter panel visibility.
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Lock background scroll while the mobile filter drawer is open.
  useEffect(() => {
    if (!mobileFiltersOpen) return
    document.body.style.overflow = 'hidden'
    getLenis()?.stop()
    return () => {
      document.body.style.overflow = ''
      getLenis()?.start()
    }
  }, [mobileFiltersOpen])

  /* ---- Data fetching (products + categories in parallel) ---- */
  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [productList, categoryList] = await Promise.all([
          fetchProducts(controller.signal),
          fetchCategories(controller.signal),
        ])
        setProducts(productList)
        setCategories(categoryList)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(
          err instanceof Error
            ? err.message
            : 'Неизвестная ошибка при загрузке каталога.',
        )
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [reloadKey])

  /* ---- Derived catalog metadata ---- */

  // Price bounds are based on the price the shopper actually sees (discounted).
  const priceBounds = useMemo<[number, number]>(() => {
    if (products.length === 0) return [0, 0]
    const prices = products.map(discountedPrice)
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
  }, [products])

  // Once we know the real bounds, snap the slider to the full range (until the
  // user drags it themselves).
  useEffect(() => {
    if (!priceTouched && priceBounds[1] > 0) {
      setPriceRange(priceBounds)
    }
  }, [priceBounds, priceTouched])

  // Unique, alphabetically sorted brand list derived from the loaded catalog.
  const brands = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) {
      if (p.brand?.trim()) set.add(p.brand.trim())
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [products])

  /* ---- Filtering + sorting pipeline ---- */
  const visibleProducts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    const [low, high] = priceRange

    const filtered = products.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query)) return false
      if (selectedCategories.length && !selectedCategories.includes(p.category))
        return false
      if (selectedBrands.length && !(p.brand && selectedBrands.includes(p.brand)))
        return false
      const price = discountedPrice(p)
      if (priceTouched && (price < low || price > high)) return false
      return true
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => discountedPrice(a) - discountedPrice(b))
        break
      case 'price-desc':
        sorted.sort((a, b) => discountedPrice(b) - discountedPrice(a))
        break
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    return sorted
  }, [
    products,
    debouncedSearch,
    selectedCategories,
    selectedBrands,
    priceRange,
    priceTouched,
    sort,
  ])

  /* ---- Incremental rendering (infinite scroll) ----
     Keep the DOM light by only mounting a page of cards at a time; reveal more
     as the sentinel scrolls into view. This keeps scrolling smooth even with a
     large catalog, and — because the rendered list matches the results — the
     page never grows taller than the products themselves. */
  const [shown, setShown] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Any change to the result set restarts paging from the top.
  useEffect(() => {
    setShown(PAGE_SIZE)
  }, [debouncedSearch, selectedCategories, selectedBrands, priceRange, sort])

  const pageProducts = useMemo(
    () => visibleProducts.slice(0, shown),
    [visibleProducts, shown],
  )
  const hasMore = shown < visibleProducts.length
  const loadMore = useCallback(
    () => setShown((s) => Math.min(s + PAGE_SIZE, visibleProducts.length)),
    [visibleProducts.length],
  )

  // Auto-load the next page when the sentinel becomes visible.
  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, loadMore])

  /* ---- Filter handlers ---- */
  const toggleCategory = useCallback((slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    )
  }, [])

  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    )
  }, [])

  const handlePriceChange = useCallback((range: [number, number]) => {
    setPriceTouched(true)
    setPriceRange(range)
  }, [])

  const resetFilters = useCallback(() => {
    setSearchInput('')
    setSelectedCategories([])
    setSelectedBrands([])
    setSort('default')
    setPriceTouched(false)
    setPriceRange(priceBounds)
  }, [priceBounds])

  // The consolidated filter object handed to the sidebar.
  const filters: Filters = {
    search: debouncedSearch,
    categories: selectedCategories,
    brands: selectedBrands,
    priceRange,
    sort,
  }

  const sidebar = (
    <FilterSidebar
      categories={categories}
      brands={brands}
      loading={loading}
      filters={filters}
      priceBounds={priceBounds}
      resultCount={visibleProducts.length}
      onToggleCategory={toggleCategory}
      onToggleBrand={toggleBrand}
      onPriceChange={handlePriceChange}
      onReset={resetFilters}
    />
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <PromoBar />
      <Header search={searchInput} onSearchChange={setSearchInput} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Hero productCount={products.length} />

        <CategoryChips
          categories={categories}
          selected={selectedCategories}
          onToggle={toggleCategory}
          onClear={() => setSelectedCategories([])}
          loading={loading}
        />

        {/* items-start keeps the tall sidebar from stretching the catalog
            column, and the capped, self-scrolling sidebar means a short,
            filtered result set no longer leaves empty space below the grid. */}
        <div id="catalog" className="flex scroll-mt-24 items-start gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div
              data-lenis-prevent
              className="scrollbar-thin sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
            >
              {sidebar}
            </div>
          </aside>

          {/* Catalog column */}
          <section className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Каталог товаров
                </h2>
                <span className="mt-1.5 block h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-brand-300" />
                {/* Fixed height reserves the line so the grid doesn't shift
                    down when the count appears (avoids layout shift / CLS). */}
                <p className="mt-1.5 h-5 text-sm text-slate-500">
                  {!loading && !error
                    ? `${visibleProducts.length} ${pluralizeProducts(visibleProducts.length)}`
                    : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile filters trigger */}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-soft transition-colors hover:border-brand-300 hover:text-brand-600 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Фильтры
                </button>
                <SortSelect value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Content */}
            {error ? (
              <ErrorState
                message={error}
                onRetry={() => setReloadKey((k) => k + 1)}
              />
            ) : (
              <>
                <ProductGrid
                  products={pageProducts}
                  loading={loading}
                  onResetFilters={resetFilters}
                />

                {/* Infinite-scroll sentinel + manual fallback */}
                {!loading && hasMore && (
                  <div
                    ref={sentinelRef}
                    className="mt-8 flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={loadMore}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600 hover:shadow-card"
                    >
                      <Plus className="h-4 w-4" />
                      Показать ещё
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            {/* Flex column: fixed close header + a body that scrolls only
                when the filters overflow, so the drawer never extends past the
                viewport into empty space. */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85%] flex-col bg-white shadow-2xl lg:hidden"
            >
              <div className="flex shrink-0 justify-end px-4 pt-4">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Закрыть фильтры"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                data-lenis-prevent
                className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-5 pb-5"
              >
                {sidebar}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart drawer (portal-free; controlled by the global store) */}
      <CartDrawer />

      {/* Smooth "back to top" button */}
      <ScrollToTop />
    </div>
  )
}

/** Russian plural forms for "товар" (product). */
function pluralizeProducts(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'товар'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товара'
  return 'товаров'
}
