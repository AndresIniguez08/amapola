import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/formatters'
import { ShoppingBag } from 'lucide-react'

export default function OrderSummary({ deliveryFee = 0 }) {
  const { items, subtotal } = useCart()
  const total = subtotal + deliveryFee

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#E8660A]" strokeWidth={2} />
          <h2 className="font-bold text-stone-800 text-sm">Tu pedido</h2>
        </div>
        <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {/* Items */}
      <div className="px-5 py-3 space-y-3">
        {items.map(({ key, product, variant, quantity }) => {
          const price = variant?.price ?? product.price
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex-shrink-0 overflow-hidden">
                {(variant?.image_url ?? product.image_url) ? (
                  <img
                    src={variant?.image_url ?? product.image_url}
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
                <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                {variant && (
                  <p className="text-xs text-[#E8660A] font-medium">{variant.name}</p>
                )}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-stone-400">x{quantity}</span>
                  <span className="text-stone-200">·</span>
                  <span className="text-xs text-stone-400">{formatPrice(price)} c/u</span>
                </div>
              </div>
              <span className="text-sm font-bold text-stone-800 flex-shrink-0">
                {formatPrice(price * quantity)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Totales */}
      <div className="px-5 py-4 bg-stone-50 border-t border-stone-100 space-y-2">
        <div className="flex justify-between text-sm text-stone-500">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm text-stone-500">
            <span>Envío</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base text-stone-900 pt-1 border-t border-stone-200">
          <span>Total</span>
          <span className="text-[#E8660A]">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
