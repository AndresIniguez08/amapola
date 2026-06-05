import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/formatters'
import { ShoppingBag } from 'lucide-react'

export default function OrderSummary({ deliveryFee = 0 }) {
  const { items, subtotal } = useCart()
  const total = subtotal + deliveryFee

  return (
    <section className="bg-surface rounded-card border border-border p-5">
      <h2 className="font-bold text-text-primary mb-4">Tu pedido</h2>
      <div className="space-y-3 divide-y divide-border">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-3 pt-3 first:pt-0">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex-shrink-0 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-stone-300" strokeWidth={1} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
              <p className="text-xs text-text-muted">x{quantity}</p>
            </div>
            <span className="text-sm font-semibold text-text-primary flex-shrink-0">
              {formatPrice(product.price * quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Envío</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base text-text-primary pt-1">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </section>
  )
}
