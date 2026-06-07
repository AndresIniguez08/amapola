import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import SkeletonCard from '../ui/SkeletonCard'
import EmptyState from '../ui/EmptyState'
import { PackageSearch } from 'lucide-react'

export default function ProductGrid({ products, loading, searchQuery }) {
  const [modalProduct, setModalProduct] = useState(null)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={searchQuery ? 'Sin resultados' : 'Sin productos'}
        description={
          searchQuery
            ? `No encontramos productos para "${searchQuery}".`
            : 'No hay productos disponibles en esta categoría.'
        }
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenModal={setModalProduct}
          />
        ))}
      </div>

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
    </>
  )
}
