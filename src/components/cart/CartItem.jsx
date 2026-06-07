import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/formatters'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const { key, product, variant, quantity } = item
  const price = variant?.price ?? product.price

  return (
    <div className="flex gap-3 py-3">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg bg-stone-100 flex-shrink-0 overflow-hidden">
        {(variant?.image_url ?? product.image_url) ? (
          <img
            src={variant?.image_url ?? product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-stone-300" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary leading-snug truncate">
              {product.name}
            </p>
            {variant && (
              <p className="text-xs text-[#E8660A] font-medium">{variant.name}</p>
            )}
          </div>
          <button
            onClick={() => removeItem(key)}
            className="flex-shrink-0 p-1 rounded text-text-muted hover:text-error transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-error"
            aria-label={`Eliminar ${product.name}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-text-muted mt-0.5">
          {formatPrice(price)} c/u
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateQuantity(key, quantity - 1)}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-stone-50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="Reducir"
            >
              <Minus className="w-3 h-3" strokeWidth={2.5} />
            </button>
            <span className="w-5 text-center text-sm font-bold text-text-primary">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(key, quantity + 1)}
              className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="Aumentar"
            >
              <Plus className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>

          <span className="text-sm font-bold text-text-primary">
            {formatPrice(price * quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
