import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import toast from 'react-hot-toast'

const fmt = amount =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(amount)

const STATUS_OPTIONS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'confirmado', label: 'Confirmados' },
  { key: 'entregado', label: 'Entregados' },
  { key: 'cancelado', label: 'Cancelados' },
]

const STATUS_BADGE = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-[#F3EEFF] text-[#7C5CBF]',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

const PAYMENT_LABELS = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  mercadopago: 'Mercado Pago',
}

const DELIVERY_LABELS = {
  retiro: 'Retiro en local',
  envio: 'Envío a domicilio',
}

function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-3 bg-stone-100 rounded w-1/2" />
        </div>
        <div className="h-6 bg-stone-100 rounded-full w-20" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-2/3" />
      </div>
      <div className="h-3 bg-stone-100 rounded w-1/4 ml-auto" />
    </div>
  )
}

function OrderCard({ order, onStatusChange }) {
  const [updating, setUpdating] = useState(false)

  async function handleStatus(newStatus) {
    setUpdating(true)
    await onStatusChange(order.id, newStatus)
    setUpdating(false)
  }

  const date = new Date(order.created_at).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-stone-800">{order.customer_name}</p>
          <p className="text-xs text-stone-400 mt-0.5">{order.customer_phone} · {date}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 capitalize ${STATUS_BADGE[order.status] ?? 'bg-stone-100 text-stone-500'}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-1">
        {(order.items ?? []).map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-stone-600">{item.quantity}× {item.name}</span>
            <span className="text-stone-400">{fmt(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 pt-3 flex flex-wrap items-end justify-between gap-2">
        <div className="text-xs text-stone-400 space-y-1">
          <p>{PAYMENT_LABELS[order.payment_method] ?? order.payment_method} · {DELIVERY_LABELS[order.delivery_method] ?? order.delivery_method}</p>
          {order.customer_address && <p>📍 {order.customer_address}</p>}
          {order.notes && <p className="italic">"{order.notes}"</p>}
        </div>
        <p className="font-bold text-[#7C5CBF] text-lg">{fmt(order.total)}</p>
      </div>

      {order.status === 'pendiente' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleStatus('confirmado')}
            disabled={updating}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-[#7C5CBF] hover:bg-[#5E3FA3] text-white transition-colors disabled:opacity-50"
          >
            Confirmar
          </button>
          <button
            onClick={() => handleStatus('cancelado')}
            disabled={updating}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}
      {order.status === 'confirmado' && (
        <button
          onClick={() => handleStatus('entregado')}
          disabled={updating}
          className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
        >
          Marcar entregado
        </button>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        toast.error('Error al cargar pedidos')
      } else {
        setOrders(data ?? [])
      }
      setLoading(false)
    }
    load()
  }, [])

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) {
      toast.error('Error al actualizar el pedido')
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
      toast.success('Estado actualizado')
    }
  }

  const filtered = filter === 'todos' ? orders : orders.filter(o => o.status === filter)

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-text-primary">Pedidos</h1>

        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === s.key
                  ? 'bg-[#7C5CBF] text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">
              📋
            </div>
            <p className="text-stone-600 font-medium">No hay pedidos</p>
            <p className="text-stone-400 text-sm mt-1">
              {filter === 'todos'
                ? 'Todavía no se recibieron pedidos.'
                : `No hay pedidos con estado "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
