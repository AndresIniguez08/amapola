import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import CheckoutForm from "../components/checkout/CheckoutForm";
import { useCatalogStore } from "../store/catalogStore";

const CHECKOUT_IMAGE =
  "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=1400&q=80&auto=format&fit=crop";
const EMPTY_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=80&auto=format&fit=crop";

export default function CheckoutPage() {
  const { items } = useCart();
  const navigate = useNavigate();
  const fetchStoreConfig = useCatalogStore((s) => s.fetchStoreConfig);

  useEffect(() => {
    fetchStoreConfig();
  }, []); // eslint-disable-line

  if (items.length === 0) {
    return (
      <div className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <img
          src={EMPTY_IMAGE}
          alt="Panadería Amapola"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 100%)",
          }}
        />
        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-white/70 text-sm max-w-xs">
              Elegí tus panificados favoritos y volvé acá para completar tu
              pedido.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7C5CBF] hover:bg-[#5E3FA3] text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Ver productos
          </button>
        </div>
        {/* Wave inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 50L1440 50L1440 20C1200 50 960 5 720 20C480 35 240 0 0 20L0 50Z"
              fill="#FAF8F5"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header con imagen */}
      <div className="relative h-36 md:h-44 overflow-hidden">
        <img
          src={CHECKOUT_IMAGE}
          alt="Panadería Amapola"
          className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
          loading="eager"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        {/* Wave inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 40L1440 40L1440 15C1200 40 960 0 720 15C480 30 240 0 0 15L0 40Z"
              fill="#FAF8F5"
            />
          </svg>
        </div>
        {/* Texto sobre imagen */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pb-4">
          <span className="text-white/70 text-xs font-medium tracking-widest uppercase mb-1">
            Amapola Panificados
          </span>
          <h1 className="text-white text-2xl md:text-3xl font-bold drop-shadow-sm">
            Completar pedido
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-6 group mt-4"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Volver al catálogo
        </button>
        <CheckoutForm />
      </div>
    </>
  );
}
