import { Banknote, ArrowRightLeft, Smartphone } from 'lucide-react'

const PAYMENT_OPTIONS = [
  { value: 'efectivo', label: 'Efectivo', icon: Banknote },
  { value: 'transferencia', label: 'Transferencia', icon: ArrowRightLeft },
  { value: 'mercadopago', label: 'Mercado Pago', icon: Smartphone },
]

const DELIVERY_OPTIONS = [
  { value: 'retiro', label: 'Retiro en local', description: 'Sin costo' },
  { value: 'envio', label: 'Envío a domicilio', description: 'Costo adicional' },
]

const SCHEDULE_OPTIONS = [
  { value: 'manana', label: 'Mañana', description: '8:00 – 12:00' },
  { value: 'mediodia', label: 'Mediodía', description: '12:00 – 15:00' },
  { value: 'tarde', label: 'Tarde', description: '15:00 – 19:00' },
]

function OptionCard({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-card border-2 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        selected
          ? 'border-primary bg-primary-light'
          : 'border-border bg-surface hover:border-stone-300'
      }`}
    >
      {children}
    </button>
  )
}

export function PaymentMethodSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PAYMENT_OPTIONS.map(({ value: v, label, icon: Icon }) => (
        <OptionCard key={v} selected={value === v} onClick={() => onChange(v)}>
          <div className="flex flex-col items-center gap-1.5 w-full">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${value === v ? 'bg-primary/10' : 'bg-stone-100'}`}>
              <Icon className={`w-4 h-4 ${value === v ? 'text-primary' : 'text-text-muted'}`} strokeWidth={2} />
            </div>
            <span className={`text-xs font-semibold text-center leading-tight ${value === v ? 'text-primary' : 'text-text-secondary'}`}>
              {label}
            </span>
          </div>
        </OptionCard>
      ))}
    </div>
  )
}

export function DeliveryMethodSelector({ value, onChange, deliveryFee }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {DELIVERY_OPTIONS.map(({ value: v, label, description }) => (
        <OptionCard key={v} selected={value === v} onClick={() => onChange(v)}>
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${value === v ? 'border-primary' : 'border-border'}`}>
            {value === v && <div className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-semibold ${value === v ? 'text-primary' : 'text-text-primary'}`}>
              {label}
            </p>
            <p className="text-xs text-text-muted">
              {v === 'envio' && deliveryFee > 0
                ? `+$${Number(deliveryFee).toLocaleString('es-AR')}`
                : description}
            </p>
          </div>
        </OptionCard>
      ))}
    </div>
  )
}

export function ScheduleSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SCHEDULE_OPTIONS.map(({ value: v, label, description }) => (
        <OptionCard key={v} selected={value === v} onClick={() => onChange(v)}>
          <div className="flex flex-col items-center w-full gap-0.5">
            <span className={`text-sm font-semibold ${value === v ? 'text-primary' : 'text-text-primary'}`}>
              {label}
            </span>
            <span className="text-xs text-text-muted text-center leading-tight">{description}</span>
          </div>
        </OptionCard>
      ))}
    </div>
  )
}
