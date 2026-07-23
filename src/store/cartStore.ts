import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

/**
 * Global cart state, powered by Zustand.
 *
 * Any component — a product card, the header badge, the drawer — can read from
 * or write to this single source of truth without prop drilling. State is
 * persisted to localStorage so a refresh never loses the user's basket.
 */
interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Drawer visibility
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Mutations
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  increment: (productId: number) => void
  decrement: (productId: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { product, quantity: 1 }] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      increment: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        })),

      // Lowering quantity to zero removes the line entirely.
      decrement: (productId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.product.id === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'sollers-cart',
      // Only the basket contents are worth persisting — not the drawer state.
      partialize: (state) => ({ items: state.items }) as CartState,
    },
  ),
)

/* ---- Derived selectors (keep math in one place) ---- */

/** Discounted unit price for a product, rounded to cents. */
export function discountedPrice(product: Product): number {
  const price = product.price * (1 - product.discountPercentage / 100)
  return Math.round(price * 100) / 100
}

/** Total number of individual units in the cart (for the header badge). */
export function selectTotalCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

/** Final order total, using discounted prices. */
export function selectTotalPrice(items: CartItem[]): number {
  const total = items.reduce(
    (sum, i) => sum + discountedPrice(i.product) * i.quantity,
    0,
  )
  return Math.round(total * 100) / 100
}
