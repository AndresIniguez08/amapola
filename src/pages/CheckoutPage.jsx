import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import CheckoutForm from '../components/checkout/CheckoutForm'
import { useCatalogStore } from '../store/catalogStore'

export default function CheckoutPage() {
  const { items } = useCart()
  const navigate = useNavigate()
  const fetchStoreConfig = useCatalogStore(s => s.fetchStoreConfig)

  useEffect(() => {
    fetchStoreConfig()
  }, []) // eslint-disable-line

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary mb-4">Tu carrito está vacío.</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary font-semibold underline underline-offset-2"
        >
          Volver al catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Volver
      </button>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Completar pedido</h1>
      <CheckoutForm />
    </div>
  )
}
