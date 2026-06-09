import { forwardRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { MessageCircle, User, Phone, FileText } from "lucide-react";
import toast from "react-hot-toast";
import OrderSummary from "./OrderSummary";
import {
  PaymentMethodSelector,
  DeliveryMethodSelector,
  ScheduleSelector,
} from "./PaymentSelector";
import { useCart } from "../../hooks/useCart";
import { useCatalogStore } from "../../store/catalogStore";
import { generateWhatsAppMessage, openWhatsApp } from "../../lib/whatsapp";
import { saveOrder } from "../../lib/orders";

const schema = z
  .object({
    name: z.string().min(2, "Ingresá tu nombre completo"),
    phone: z
      .string()
      .min(8, "Número inválido")
      .regex(/^[\d\s\-+()]+$/, "Solo números y caracteres válidos"),
    address: z.string().optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["efectivo", "transferencia", "mercadopago"]),
    deliveryMethod: z.enum(["retiro", "envio"]),
    schedule: z.enum(["manana", "mediodia", "tarde"]),
  })
  .refine(
    (data) =>
      data.deliveryMethod === "retiro" ||
      (data.address && data.address.length >= 5),
    { message: "Ingresá tu dirección", path: ["address"] },
  );

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      ⚠ {message}
    </p>
  );
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-7 h-7 rounded-full bg-[#E8660A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div>
        <h2 className="font-bold text-stone-800 text-sm leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-stone-400 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}

const FloatingInput = forwardRef(function FloatingInput(
  { label, icon: Icon, error, ...props },
  ref,
) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-4 h-4 text-stone-400" strokeWidth={1.8} />
        </div>
      )}
      <input
        ref={ref}
        placeholder={label}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3.5 text-sm bg-white border-2 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#E8660A] transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50/30"
            : "border-stone-200 hover:border-stone-300"
        }`}
        {...props}
      />
    </div>
  );
});

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const storeConfig = useCatalogStore((s) => s.storeConfig);
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  const deliveryFee = Number(storeConfig.delivery_fee ?? 0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: "efectivo",
      deliveryMethod: "retiro",
      schedule: "manana",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const currentDeliveryFee = deliveryMethod === "envio" ? deliveryFee : 0;

  async function onSubmit(data) {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    const whatsappNumber = storeConfig.whatsapp_number;
    if (!whatsappNumber) {
      toast.error(
        "No se pudo obtener el número de WhatsApp. Intentá de nuevo.",
      );
      return;
    }

    setSending(true);

    try {
      // Generar mensaje y abrir WhatsApp ANTES de cualquier await
      // iOS Safari solo permite window.open dentro del gesto del usuario
      const message = generateWhatsAppMessage(items, data, storeConfig);
      openWhatsApp(message, whatsappNumber);

      // Guardar pedido en background sin bloquear la UX
      saveOrder(items, data, storeConfig).catch((err) => {
        console.error("Error guardando pedido:", err);
        toast.error("Error: " + (err?.message ?? JSON.stringify(err)), {
          duration: 8000,
        });
      });

      clearCart();
      navigate("/pedido-confirmado");
    } catch (err) {
      toast.error("Hubo un error al generar el pedido.");
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <OrderSummary deliveryFee={currentDeliveryFee} />

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <SectionHeader
          number="1"
          title="Tus datos"
          subtitle="Necesitamos saber quién hace el pedido"
        />
        <div className="space-y-3">
          <div>
            <FloatingInput
              label="Nombre completo"
              icon={User}
              error={errors.name}
              autoComplete="name"
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <FloatingInput
              label="Teléfono"
              icon={Phone}
              error={errors.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...register("phone")}
            />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="relative">
            <FileText
              className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none"
              strokeWidth={1.8}
            />
            <textarea
              {...register("notes")}
              placeholder="Observaciones (sin sal, sin TACC, etc.)"
              rows={3}
              className="w-full pl-10 pr-4 py-3.5 text-sm bg-white border-2 border-stone-200 hover:border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#E8660A] transition-all duration-200 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <SectionHeader
          number="2"
          title="Forma de pago"
          subtitle="¿Cómo vas a abonar?"
        />
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <PaymentMethodSelector
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <SectionHeader
          number="3"
          title="Método de entrega"
          subtitle="¿Retirás o te lo llevamos?"
        />
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
        {deliveryMethod === "envio" && (
          <div className="mt-3">
            <FloatingInput
              label="Dirección de entrega"
              error={errors.address}
              autoComplete="street-address"
              {...register("address")}
            />
            <FieldError message={errors.address?.message} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <SectionHeader
          number="4"
          title="Horario preferido"
          subtitle="¿Cuándo querés recibirlo?"
        />
        <Controller
          name="schedule"
          control={control}
          render={({ field }) => (
            <ScheduleSelector value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="pt-2 pb-8">
        <button
          type="submit"
          disabled={sending}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Preparando pedido...
            </span>
          ) : (
            <>
              <MessageCircle className="w-5 h-5" strokeWidth={2} />
              Enviar pedido por WhatsApp
            </>
          )}
        </button>
        <p className="text-center text-xs text-stone-400 mt-3">
          Se abrirá WhatsApp con tu pedido listo para enviar a Amapola
        </p>
      </div>
    </form>
  );
}
