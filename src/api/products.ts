import type { Category, Product } from '../types'
import { CATEGORIES, PRODUCTS } from '../data/products'

/**
 * Data-access layer for the catalog.
 *
 * The shop previously fetched everything from the remote DummyJSON REST API,
 * which meant a slow or unstable connection left the page empty. The catalog
 * now ships as a bundled local dataset (`src/data/products.ts`), so it loads
 * instantly and works fully offline.
 *
 * These functions keep their async signatures (and the optional AbortSignal)
 * so the rest of the app — loading skeletons, error handling — stays exactly
 * the same and could be swapped back to a real API without touching the UI.
 */

/** Return the full local catalog. */
export async function fetchProducts(_signal?: AbortSignal): Promise<Product[]> {
  return PRODUCTS
}

/** Return the list of catalog categories. */
export async function fetchCategories(_signal?: AbortSignal): Promise<Category[]> {
  return CATEGORIES
}
