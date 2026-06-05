import { useCartStore } from '../store/cartStore'

export function useCart() {
  const items = useCartStore(s => s.items)
  const addItem = useCartStore(s => s.addItem)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const clearCart = useCartStore(s => s.clearCart)

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  function getQuantity(productId) {
    return items.find(i => i.product.id === productId)?.quantity ?? 0
  }

  return { items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart, getQuantity }
}
