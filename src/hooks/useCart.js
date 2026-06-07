import { useCartStore } from '../store/cartStore'

const itemKey = (productId, variantId) =>
  variantId ? `${productId}-${variantId}` : productId

export function useCart() {
  const items = useCartStore(s => s.items)
  const addItem = useCartStore(s => s.addItem)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const clearCart = useCartStore(s => s.clearCart)

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.price
    return sum + price * item.quantity
  }, 0)

  function getQuantity(productId, variantId = null) {
    const key = itemKey(productId, variantId)
    return items.find(i => i.key === key)?.quantity ?? 0
  }

  return { items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart, getQuantity }
}
