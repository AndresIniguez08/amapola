import { useState, useEffect, useRef } from 'react'
import { X, ShoppingBag, ShoppingCart, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '../../lib/formatters'
import { useCart } from '../../hooks/useCart'

export default function ProductModal({ product, onClose }) {
  const { addItem, updateQuantity, removeItem, getQuantity } = useCart()

  const activeVariants = (product.variants ?? [])
    .filter(v => v.is_active)
    .sort((a, b) => a.position - b.position)

  const hasVariants = activeVariants.length > 0

  const [selectedVariant, setSelectedVariant] = useState(
    activeVariants.length === 1 ? activeVariants[0] : null,
  )

  const displayPrice = selectedVariant?.price ?? product.price
  const canAdd = !hasVariants || selectedVariant !== null

  const quantity = getQuantity(product.id, selectedVariant?.id ?? null)

  // Image fade transition
  const [displayedImage, setDisplayedImage] = useState(
    selectedVariant?.image_url ?? product.image_url,
  )
  const [fadeIn, setFadeIn] = useState(true)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const newImg = selectedVariant?.image_url ?? product.image_url
    setFadeIn(false)
    const t = setTimeout(() => {
      setDisplayedImage(newImg)
      setFadeIn(true)
    }, 150)
    return () => clearTimeout(t)
  }, [selectedVariant?.id])

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleAdd() {
    if (!canAdd) return
    addItem(product, hasVariants ? selectedVariant : null)
    toast.success(`${product.name} agregado`)
  }

  function handleIncrease() {
    const key = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id
    updateQuantity(key, quantity + 1)
  }

  function handleDecrease() {
    const key = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id
    if (quantity <= 1) {
      removeItem(key)
    } else {
      updateQuantity(key, quantity - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors shadow-sm"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-stone-600" />
        </button>

        {/* Image */}
        <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
          {displayedImage ? (
            <img
              src={displayedImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-stone-300" strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Header info */}
          <div>
            {product.is_featured && (
              <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                Destacado
              </span>
            )}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h2 className="text-xl font-bold text-stone-800">{product.name}</h2>
            {product.description && (
              <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-stone-800">{formatPrice(displayPrice)}</p>

          {/* Variants */}
          {hasVariants && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-stone-500">Elegí tu variante</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeVariants.map(variant => {
                  const isSelected = selectedVariant?.id === variant.id
                  const showPrice =
                    variant.price !== null && variant.price !== product.price
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8660A] ${
                        isSelected
                          ? 'border-[#E8660A] bg-orange-50'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-stone-100">
                        {variant.image_url ? (
                          <img
                            src={variant.image_url}
                            alt={variant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-stone-300" strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-stone-700 text-center leading-tight">
                        {variant.name}
                      </span>
                      {showPrice && (
                        <span className="text-xs font-bold text-[#E8660A]">
                          {formatPrice(variant.price)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Cart controls */}
          <div className="space-y-2 pt-1">
            {hasVariants && !selectedVariant && (
              <p className="text-xs text-stone-400 text-center">
                Seleccioná una variante para continuar
              </p>
            )}

            {quantity > 0 ? (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleDecrease}
                  className="w-10 h-10 rounded-full bg-orange-50 text-[#E8660A] hover:bg-orange-100 flex items-center justify-center transition-colors"
                  aria-label="Reducir cantidad"
                >
                  <Minus className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <span className="w-8 text-center font-bold text-lg text-stone-800">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-10 h-10 rounded-full bg-[#E8660A] text-white hover:bg-[#C25508] flex items-center justify-center transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  canAdd
                    ? 'bg-[#E8660A] text-white hover:bg-[#C25508]'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                Agregar al carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
