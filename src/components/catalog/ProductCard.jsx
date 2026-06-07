import { useState } from 'react'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../ui/Badge'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/formatters'

export default function ProductCard({ product, onOpenModal }) {
  const { addItem, updateQuantity, removeItem, getQuantity } = useCart()
  const [adding, setAdding] = useState(false)

  const hasActiveVariants = (product.variants ?? []).some(v => v.is_active)

  // For no-variant products only; variant products always show quantity 0 on the card
  const quantity = getQuantity(product.id)

  async function handleAdd() {
    if (hasActiveVariants) {
      onOpenModal?.(product)
      return
    }
    setAdding(true)
    addItem(product, null)
    toast.success(`${product.name} agregado`)
    setTimeout(() => setAdding(false), 300)
  }

  function handleIncrease() {
    updateQuantity(product.id, quantity + 1)
  }

  function handleDecrease() {
    if (quantity <= 1) {
      removeItem(product.id)
    } else {
      updateQuantity(product.id, quantity - 1)
    }
  }

  function handleCardClick() {
    onOpenModal?.(product)
  }

  return (
    <article
      className={`relative bg-surface rounded-card shadow-card overflow-hidden flex flex-col transition-all duration-200 hover:shadow-card-hover ${
        !product.is_available ? 'opacity-70' : ''
      }`}
    >
      {/* Image — clickable to open modal */}
      <div
        className={`relative aspect-square bg-stone-100 overflow-hidden ${onOpenModal ? 'cursor-pointer' : ''}`}
        onClick={handleCardClick}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-stone-300" strokeWidth={1} />
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="featured">Destacado</Badge>
          </div>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-text-secondary bg-white px-3 py-1 rounded-full border border-border">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <h3
            className={`font-semibold text-text-primary text-sm leading-snug ${onOpenModal ? 'cursor-pointer hover:text-[#E8660A] transition-colors' : ''}`}
            onClick={handleCardClick}
          >
            {product.name}
          </h3>
          {product.description && (
            <p className="text-text-muted text-xs mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-text-primary text-base">
            {formatPrice(product.price)}
          </span>

          {product.is_available && (
            !hasActiveVariants && quantity > 0 ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDecrease}
                  className="w-8 h-8 rounded-full bg-primary-light text-primary hover:bg-orange-100 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Reducir cantidad"
                >
                  <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
                <span className="w-6 text-center font-bold text-sm text-text-primary">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-8 h-8 rounded-full bg-primary text-white hover:bg-primary-dark flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[36px] ${
                  adding ? 'scale-95' : 'scale-100'
                }`}
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                Agregar
              </button>
            )
          )}
        </div>
      </div>
    </article>
  )
}
