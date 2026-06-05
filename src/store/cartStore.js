import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{product, quantity}]

      addItem(product) {
        const items = get().items
        const existing = items.find(i => i.product.id === product.id)
        if (existing) {
          set({
            items: items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          })
        } else {
          set({ items: [...items, { product, quantity: 1 }] })
        }
      },

      removeItem(productId) {
        set({ items: get().items.filter(i => i.product.id !== productId) })
      },

      updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i,
          ),
        })
      },

      clearCart() {
        set({ items: [] })
      },

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0,
        )
      },
    }),
    {
      name: 'amapola-cart',
      partialize: state => ({ items: state.items }),
    },
  ),
)
