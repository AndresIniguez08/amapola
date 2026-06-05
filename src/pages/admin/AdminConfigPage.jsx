import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const schema = z.object({
  whatsapp_number: z.string().min(8, 'Número requerido').regex(/^\d+$/, 'Solo números, sin espacios ni +'),
  store_name: z.string().min(2, 'Requerido'),
  store_address: z.string().optional(),
  delivery_fee: z.coerce.number().min(0),
  min_order: z.coerce.number().min(0),
})

const FIELDS = [
  { key: 'whatsapp_number', label: 'Número de WhatsApp', hint: 'Sin +, sin espacios. Ej: 5492366001234', type: 'text', required: true },
  { key: 'store_name', label: 'Nombre del local', type: 'text', required: true },
  { key: 'store_address', label: 'Dirección', type: 'text' },
  { key: 'delivery_fee', label: 'Costo de envío (ARS)', type: 'number', required: true },
  { key: 'min_order', label: 'Pedido mínimo (ARS)', type: 'number', required: true },
]

export default function AdminConfigPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { delivery_fee: 0, min_order: 0 },
  })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('store_config').select('*')
      if (data) {
        const config = Object.fromEntries(data.map(r => [r.key, r.value]))
        reset({
          whatsapp_number: config.whatsapp_number ?? '',
          store_name: config.store_name ?? '',
          store_address: config.store_address ?? '',
          delivery_fee: Number(config.delivery_fee ?? 0),
          min_order: Number(config.min_order ?? 0),
        })
      }
      setLoading(false)
    }
    load()
  }, [reset])

  async function onSubmit(data) {
    setSaving(true)
    try {
      const upserts = Object.entries(data).map(([key, value]) => ({
        key,
        value: String(value),
      }))
      const { error } = await supabase
        .from('store_config')
        .upsert(upserts, { onConflict: 'key' })
      if (error) throw error
      toast.success('Configuración guardada')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-text-primary mb-6">Configuración</h1>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
          {FIELDS.map(({ key, label, hint, type, required }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                {label} {required && <span className="text-error">*</span>}
              </label>
              <input
                {...register(key)}
                type={type}
                inputMode={type === 'number' ? 'numeric' : undefined}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
              {errors[key] && <p className="text-error text-xs mt-1">{errors[key].message}</p>}
            </div>
          ))}

          <Button type="submit" variant="primary" size="md" loading={saving} className="w-full sm:w-auto">
            Guardar configuración
          </Button>
        </form>
      )}
    </AdminLayout>
  )
}
