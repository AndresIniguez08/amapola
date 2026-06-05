import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'

export default function OrderConfirmationPage() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div
        className={`flex flex-col items-center text-center gap-6 max-w-sm transition-all duration-500 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-success" strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            ¡Pedido enviado!
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Amapola se pondrá en contacto para confirmar tu pedido. ¡Gracias!
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/')}
        >
          Hacer otro pedido
        </Button>
      </div>
    </div>
  )
}
