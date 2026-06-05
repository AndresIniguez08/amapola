import { Banknote, ArrowRightLeft, Smartphone, Store, Truck, Sun, Coffee, Sunset } from 'lucide-react'

const PAYMENT_OPTIONS = [
  { value: 'efectivo',      label: 'Efectivo',      icon: Banknote },
  { value: 'transferencia', label: 'Transferencia',  icon: ArrowRightLeft },
  { value: 'mercadopago',   label: 'Mercado Pago',   icon: Smartphone },
]

const DELIVERY_OPTIONS = [
  { value: 'retiro', label: 'Retiro en local', description: 'Sin costo adicional', icon: Store },
  { value: 'envio',  label: 'Envío a domicilio', description: null, icon: Truck },
]

const SCHEDULE_OPTIONS = [
  { value: 'manana',   label: 'Mañana',   description: '8:00 – 12:00',  icon: Sun },
  { value: 'mediodia', label: 'Mediodía', description: '12:00 – 15:00', icon: Coffee },
  { value: 'tarde',    label: 'Tarde',    description: '15:00 – 19:00', icon: Sunset },
]

export function PaymentMethodSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PAYMENT_OPTIONS.map(({ value: v, label, icon: Icon }) => {
        const selected = value === v
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 focus:outline-none ${
              selected
                ? 'border-[#E8660A] bg-orange-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              selected ? 'bg-[#E8660A]' : 'bg-stone-100'
            }`}>
              <Icon className={`w-4 h-4 ${selected ? 'text-white' : 'text-stone-400'}`} strokeWidth={2} />
            </div>
            <span className={`text-xs font-semibold text-center leading-tight ${
              selected ? 'text-[#E8660A]' : 'text-stone-500'
            }`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function DeliveryMethodSelector({ value, onChange, deliveryFee }) {
  return (
    <div className="space-y-2">
      {DELIVERY_OPTIONS.map(({ value: v, label, description, icon: Icon }) => {
        const selected = value === v
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 focus:outline-none ${
              selected
                ? 'border-[#E8660A] bg-orange-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              selected ? 'bg-[#E8660A]' : 'bg-stone-100'
            }`}>
              <Icon className={`w-4 h-4 ${selected ? 'text-white' : 'text-stone-400'}`} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${selected ? 'text-[#E8660A]' : 'text-stone-700'}`}>
                {label}
              </p>
              <p className="text-xs text-stone-400">
                {v === 'envio' && deliveryFee > 0
                  ? `+$${Number(deliveryFee).toLocaleString('es-AR')}`
                  : description}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              selected ? 'border-[#E8660A]' : 'border-stone-300'
            }`}>
              {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#E8660A]" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function ScheduleSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SCHEDULE_OPTIONS.map(({ value: v, label, description, icon: Icon }) => {
        const selected = value === v
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 focus:outline-none ${
              selected
                ? 'border-[#E8660A] bg-orange-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              selected ? 'bg-[#E8660A]' : 'bg-stone-100'
            }`}>
              <Icon className={`w-4 h-4 ${selected ? 'text-white' : 'text-stone-400'}`} strokeWidth={2} />
            </div>
            <div className="text-center">
              <p className={`text-xs font-semibold ${selected ? 'text-[#E8660A]' : 'text-stone-700'}`}>
                {label}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">{description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}