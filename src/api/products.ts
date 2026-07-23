import type { Category, Product } from '../types'

/**
 * Async data-access layer for the catalog.
 *
 * All network I/O for Sollers Shop funnels through this module so the rest of
 * the app stays framework-agnostic and every failure mode is handled in one
 * place. We talk to the public DummyJSON REST API.
 */

const API_BASE = 'https://dummyjson.com'

/** Shape of the paginated products envelope returned by DummyJSON. */
interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

/** Shape of a single category entry returned by DummyJSON. */
interface CategoryResponse {
  slug: string
  name: string
  url: string
}

/**
 * A small helper around fetch that turns non-2xx responses and network
 * failures into a single, predictable Error the UI can present nicely.
 */
async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, { signal })
  } catch (err) {
    // Network-level failure (offline, DNS, CORS, aborted, ...).
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к сети.')
  }

  if (!response.ok) {
    throw new Error(`Сервер вернул ошибку (${response.status}). Попробуйте ещё раз.`)
  }

  return (await response.json()) as T
}

/**
 * Fetch the full catalog. DummyJSON returns every product when `limit=0`,
 * which is exactly what we want: filtering, sorting and search all happen on
 * the client for an instant, snappy experience.
 */
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await request<ProductsResponse>(
    '/products?limit=0&select=id,title,description,category,price,discountPercentage,rating,stock,brand,thumbnail,images',
    signal,
  )
  return data.products
}

/** Fetch the list of catalog categories (slug + human-readable name). */
export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const data = await request<CategoryResponse[]>('/products/categories', signal)
  return data.map(({ slug, name }) => ({ slug, name }))
}
