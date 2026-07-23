import type { Product } from '../types'

/**
 * The base catalog from DummyJSON is finite (~190 items). To give the shop a
 * fuller, more realistic assortment we derive extra product variants from the
 * real ones — different editions, prices, ratings and stock — while reusing the
 * genuine thumbnails, brands and categories so images and filters stay valid.
 */

const EDITIONS = [
  'Pro',
  'Max',
  'Lite',
  'Plus',
  'Ultra',
  'Mini',
  'Air',
  'SE',
  'Prime',
  'Neo',
  'Active',
  '2024',
]

/** Tiny deterministic PRNG so the generated catalog is stable across renders. */
function makeRng(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Returns the original products followed by `variantsPerProduct` generated
 * variants of each, for a catalog roughly `(1 + variantsPerProduct)×` larger.
 */
export function expandCatalog(base: Product[], variantsPerProduct = 2): Product[] {
  if (base.length === 0) return base
  const out: Product[] = [...base]

  for (let v = 1; v <= variantsPerProduct; v++) {
    for (const p of base) {
      const rand = makeRng(p.id * 131 + v * 97)
      const edition = EDITIONS[(p.id + v * 5) % EDITIONS.length]
      const price = round2(Math.max(2, p.price * (0.6 + rand() * 0.9)))
      const rating = round2(3 + rand() * 2) // 3.0 – 5.0
      const discountPercentage = rand() < 0.4 ? round2(rand() * 25) : 0
      const stock = rand() < 0.12 ? 0 : Math.round(5 + rand() * 95)

      out.push({
        ...p,
        id: p.id + v * 100000,
        title: `${p.title} ${edition}`,
        price,
        rating,
        discountPercentage,
        stock,
      })
    }
  }

  return out
}
