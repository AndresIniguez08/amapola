import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { formatPrice } from '../../lib/formatters'
import { useCart } from '../../hooks/useCart'
import { ArrowRight } from 'lucide-react'

export default function CartSummary({ onClose }) {
  const { subtotal } = useCart()
  const navigate = useNavigate()

  function handleCheckout() {
    onClose()
    navigate('/checkout')
  }

  return (
    <div className="border-t border-border pt-4 space-y-4">
      <div className="flex items-center justify-between text-base">
        <span className="font-semibold text-text-secondary">Subtotal</span>
        <span className="font-bold text-text-primary text-lg">{formatPrice(subtotal)}</span>
      </div>
      <p className="text-xs text-text-muted">El costo de envío se calcula en el checkout.</p>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleCheckout}
      >
        Ir al checkout
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
