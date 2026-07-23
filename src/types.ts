/**
 * Domain models for Sollers Shop.
 *
 * The shapes mirror the payload returned by the DummyJSON REST API
 * (https://dummyjson.com/products) so the async layer can be strictly typed
 * end-to-end and the UI never has to guess at the structure of the data.
 */

/** A single product as returned by the catalog endpoint. */
export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  thumbnail: string
  images: string[]
}

/** A product that currently lives in the cart, together with its quantity. */
export interface CartItem {
  product: Product
  quantity: number
}

/** A catalog category. `slug` is used for API calls, `name` for display. */
export interface Category {
  slug: string
  name: string
}

/** The ways the product grid can be ordered. */
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc'

/** The set of user-controlled filters applied to the catalog. */
export interface Filters {
  search: string
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  sort: SortOption
}
