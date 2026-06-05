import { useEffect } from 'react'
import { ArrowRight, Leaf, Heart, Package } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/catalog/ProductGrid'
import CategoryFilter from '../components/catalog/CategoryFilter'
import SearchBar from '../components/catalog/SearchBar'
import Button from '../components/ui/Button'

const FEATURES = [
  { icon: Leaf, title: 'Artesanal', desc: 'Hecho a mano cada mañana' },
  { icon: Heart, title: 'Con amor', desc: 'Ingredientes naturales' },
  { icon: Package, title: 'A domicilio', desc: 'Mercedes y alrededores' },
]

const HERO_IMAGE = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=80&auto=format&fit=crop'

export default function HomePage() {
  const {
    filteredProducts,
    loading,
    activeCategory,
    searchQuery,
    setCategory,
    setSearchQuery,
    fetchProducts,
  } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, []) // eslint-disable-line

  return (
    <>
      {/* Hero con imagen real */}
      <section className="relative overflow-hidden" style={{ minHeight: '480px' }}>
        {/* Imagen de fondo */}
        <img
          src={HERO_IMAGE}
          alt="Pan artesanal Amapola"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay degradado: oscuro abajo, menos arriba */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold border border-white/20">
            🌸 Panificados artesanales · Mercedes, BA
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-2xl drop-shadow-sm">
            El pan que merece<br className="hidden sm:block" /> tu mesa
          </h1>

          <p className="text-white/80 text-base md:text-lg max-w-md leading-relaxed">
            Panes integrales, fajitas, talitas, mini tartas y mas...<br />
            Pedí online y recibí en tu puerta.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8660A] hover:bg-[#C25508] text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Ver productos
              <ArrowRight className="w-4 h-4" />
            </button>
            
          </div>
        </div>

        {/* Wave decorativa abajo */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* Feature chips */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#E8660A]" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-semibold text-stone-800 text-xs sm:text-sm">{title}</p>
                <p className="text-stone-400 text-xs hidden sm:block mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Separador con título de sección */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 pt-2 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-stone-100" />
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Nuestros productos</span>
          <div className="h-px flex-1 bg-stone-100" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <CategoryFilter active={activeCategory} onChange={setCategory} />
      </section>

      {/* Grid de productos */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          searchQuery={searchQuery}
        />
      </section>
    </>
  )
}