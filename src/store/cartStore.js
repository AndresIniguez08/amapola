import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const itemKey = (productId, variantId) =>
  variantId ? `${productId}-${variantId}` : productId

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ key, product, variant, quantity }]

      addItem(product, variant = null) {
        const key = itemKey(product.id, variant?.id)
        set(state => {
          const existing = state.items.find(i => i.key === key)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.key === key ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            }
          }
          return { items: [...state.items, { key, product, variant, quantity: 1 }] }
        })
      },

      removeItem(key) {
        set({ items: get().items.filter(i => i.key !== key) })
      },

      updateQuantity(key, quantity) {
        if (quantity <= 0) {
          get().removeItem(key)
          return
        }
        set({
          items: get().items.map(i => i.key === key ? { ...i, quantity } : i),
        })
      },

      clearCart() {
        set({ items: [] })
      },

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce((sum, item) => {
          const price = item.variant?.price ?? item.product.price
          return sum + price * item.quantity
        }, 0)
      },
    }),
    {
      name: 'amapola-cart',
      partialize: state => ({ items: state.items }),
    },
  ),
)
