import { useEffect, useRef, useState } from 'react'
import { X, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'

export default function CartDrawer({ open, onClose }) {
  const { items, clearCart, totalItems } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)
  const overlayRef = useRef(null)

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setConfirmClear(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearCart()
    setConfirmClear(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — right on desktop, bottom sheet on mobile */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed z-50 bg-surface flex flex-col transition-transform duration-300 ease-in-out
          bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl
          md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-[420px] md:max-h-full md:rounded-none md:rounded-l-2xl
          ${open
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }`}
      >
        {/* Handle (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-stone-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-text-primary">
              Carrito {totalItems > 0 && <span className="text-text-muted font-normal">({totalItems})</span>}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Tu carrito está vacío"
              description="Agregá productos del catálogo para empezar tu pedido."
              action={onClose}
              actionLabel="Ver productos"
            />
          ) : (
            <div className="divide-y divide-border">
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pb-6 pt-3 space-y-3">
            {confirmClear ? (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setConfirmClear(false)}>
                  Cancelar
                </Button>
                <Button variant="danger" size="sm" className="flex-1" onClick={() => { clearCart(); setConfirmClear(false) }}>
                  Vaciar
                </Button>
              </div>
            ) : (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-error transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar carrito
              </button>
            )}
            <CartSummary onClose={onClose} />
          </div>
        )}
      </div>
    </>
  )
}
