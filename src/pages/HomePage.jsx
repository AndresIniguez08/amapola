import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
      {/* Hero */}
      <section className="bg-primary-light border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            🌸 Panificados artesanales en Mercedes, BA
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary leading-tight max-w-xl">
            El pan que merece tu mesa
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-md">
            Medialunas, panes integrales, budines y snacks. Pedí online y recibí en tu puerta.
          </p>
          <Button
            size="lg"
            onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver productos
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Feature chips */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 p-4 bg-surface rounded-card border border-border">
              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-xs sm:text-sm">{title}</p>
                <p className="text-text-muted text-xs hidden sm:block">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog section */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 pb-12 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
        <CategoryFilter active={activeCategory} onChange={setCategory} />
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          searchQuery={searchQuery}
        />
      </section>
    </>
  )
}
