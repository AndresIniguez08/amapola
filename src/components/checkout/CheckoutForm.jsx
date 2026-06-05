import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../ui/Button'
import OrderSummary from './OrderSummary'
import {
  PaymentMethodSelector,
  DeliveryMethodSelector,
  ScheduleSelector,
} from './PaymentSelector'
import { useCart } from '../../hooks/useCart'
import { useCatalogStore } from '../../store/catalogStore'
import { generateWhatsAppMessage, openWhatsApp } from '../../lib/whatsapp'

const schema = z
  .object({
    name: z.string().min(2, 'Ingresá tu nombre completo'),
    phone: z
      .string()
      .min(8, 'Número inválido')
      .regex(/^[\d\s\-+()]+$/, 'Solo números y caracteres válidos'),
    address: z.string().optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(['efectivo', 'transferencia', 'mercadopago']),
    deliveryMethod: z.enum(['retiro', 'envio']),
    schedule: z.enum(['manana', 'mediodia', 'tarde']),
  })
  .refine(
    data => data.deliveryMethod === 'retiro' || (data.address && data.address.length >= 5),
    { message: 'Ingresá tu dirección', path: ['address'] },
  )

function FieldError({ message }) {
  if (!message) return null
  return <p className="text-error text-xs mt-1">{message}</p>
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-text-primary mb-1.5">
      {children}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
  )
}

function Input({ error, ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 text-sm bg-surface border rounded-btn text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
        error ? 'border-error' : 'border-border'
      }`}
      {...props}
    />
  )
}

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart()
  const storeConfig = useCatalogStore(s => s.storeConfig)
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)

  const deliveryFee = Number(storeConfig.delivery_fee ?? 0)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: 'efectivo',
      deliveryMethod: 'retiro',
      schedule: 'manana',
    },
  })

  const deliveryMethod = watch('deliveryMethod')
  const currentDeliveryFee = deliveryMethod === 'envio' ? deliveryFee : 0

  async function onSubmit(data) {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    const whatsappNumber = storeConfig.whatsapp_number
    if (!whatsappNumber) {
      toast.error('No se pudo obtener el número de WhatsApp. Intentá de nuevo.')
      return
    }

    setSending(true)
    try {
      const message = generateWhatsAppMessage(items, data, storeConfig)
      openWhatsApp(message, whatsappNumber)
      clearCart()
      navigate('/pedido-confirmado')
    } catch {
      toast.error('Hubo un error al generar el pedido.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Order summary */}
        <OrderSummary deliveryFee={currentDeliveryFee} />

        {/* Personal data */}
        <section className="bg-surface rounded-card border border-border p-5 space-y-4">
          <h2 className="font-bold text-text-primary">Tus datos</h2>

          <div>
            <Label required>Nombre completo</Label>
            <Input
              {...register('name')}
              placeholder="Juan Pérez"
              autoComplete="name"
              error={errors.name}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label required>Teléfono</Label>
            <Input
              {...register('phone')}
              type="tel"
              inputMode="tel"
              placeholder="11 2345-6789"
              autoComplete="tel"
              error={errors.phone}
            />
            <FieldError message={errors.phone?.message} />
          </div>

          <div>
            <Label>Observaciones</Label>
            <textarea
              {...register('notes')}
              placeholder="Sin sal, sin TACC, o cualquier detalle adicional..."
              rows={3}
              className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-btn text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />
          </div>
        </section>

        {/* Payment method */}
        <section className="bg-surface rounded-card border border-border p-5 space-y-3">
          <h2 className="font-bold text-text-primary">Forma de pago</h2>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <PaymentMethodSelector value={field.value} onChange={field.onChange} />
            )}
          />
        </section>

        {/* Delivery method */}
        <section className="bg-surface rounded-card border border-border p-5 space-y-3">
          <h2 className="font-bold text-text-primary">Método de entrega</h2>
          <Controller
            name="deliveryMethod"
            control={control}
            render={({ field }) => (
              <DeliveryMethodSelector
                value={field.value}
                onChange={field.onChange}
                deliveryFee={deliveryFee}
              />
            )}
          />

          {deliveryMethod === 'envio' && (
            <div>
              <Label required>Dirección de entrega</Label>
              <Input
                {...register('address')}
                placeholder="Calle Falsa 123, Mercedes"
                autoComplete="street-address"
                error={errors.address}
              />
              <FieldError message={errors.address?.message} />
            </div>
          )}
        </section>

        {/* Schedule */}
        <section className="bg-surface rounded-card border border-border p-5 space-y-3">
          <h2 className="font-bold text-text-primary">Horario preferido</h2>
          <Controller
            name="schedule"
            control={control}
            render={({ field }) => (
              <ScheduleSelector value={field.value} onChange={field.onChange} />
            )}
          />
        </section>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={sending}
          className="w-full"
        >
          <MessageCircle className="w-5 h-5" />
          Enviar pedido por WhatsApp
        </Button>

        <p className="text-center text-xs text-text-muted pb-6">
          Al tocar el botón se abrirá WhatsApp con tu pedido listo para enviar.
        </p>
      </div>
    </form>
  )
}
