import type { Category, Product } from '../types'
import { productIllustration } from '../utils/productImage'
import catalog from './catalog.json'

/**
 * Local product catalog — the app's built-in "database".
 *
 * These are 194 **real** products (real titles, brands, prices and real
 * product-photo URLs) sourced from the public DummyJSON dataset and bundled
 * with the app. Loading the catalog, prices and filters needs no network at
 * all; the `thumbnail` is a real product photo served from DummyJSON's CDN
 * that loads in the browser, and each product also carries a locally-generated
 * SVG illustration (`images[0]`) shown instantly underneath / as the offline
 * fallback.
 */

/** Real DummyJSON categories with Russian display names. */
export const CATEGORIES: Category[] = [
  { slug: 'smartphones', name: 'Смартфоны' },
  { slug: 'laptops', name: 'Ноутбуки' },
  { slug: 'tablets', name: 'Планшеты' },
  { slug: 'mobile-accessories', name: 'Аксессуары' },
  { slug: 'mens-watches', name: 'Мужские часы' },
  { slug: 'womens-watches', name: 'Женские часы' },
  { slug: 'sunglasses', name: 'Очки' },
  { slug: 'fragrances', name: 'Ароматы' },
  { slug: 'beauty', name: 'Красота' },
  { slug: 'skin-care', name: 'Уход за кожей' },
  { slug: 'mens-shirts', name: 'Мужские рубашки' },
  { slug: 'tops', name: 'Топы' },
  { slug: 'womens-dresses', name: 'Платья' },
  { slug: 'mens-shoes', name: 'Мужская обувь' },
  { slug: 'womens-shoes', name: 'Женская обувь' },
  { slug: 'womens-bags', name: 'Женские сумки' },
  { slug: 'womens-jewellery', name: 'Украшения' },
  { slug: 'sports-accessories', name: 'Спорт' },
  { slug: 'furniture', name: 'Мебель' },
  { slug: 'home-decoration', name: 'Декор для дома' },
  { slug: 'kitchen-accessories', name: 'Кухня' },
  { slug: 'groceries', name: 'Продукты' },
  { slug: 'motorcycle', name: 'Мотоциклы' },
  { slug: 'vehicle', name: 'Авто' },
]

/** The full local catalog. `thumbnail` = real photo URL, `images[0]` = fallback. */
export const PRODUCTS: Product[] = (
  catalog as Omit<Product, 'images'>[]
).map((p) => ({
  ...p,
  images: [productIllustration(p as Product)],
}))
