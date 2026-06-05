import { useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/catalog/ProductGrid'
import CategoryFilter from '../components/catalog/CategoryFilter'
import SearchBar from '../components/catalog/SearchBar'

export default function CatalogPage() {
  const {
    filteredProducts,
    loading,
    activeCategory,
    searchQuery,
    setCategory,
    setSearchQuery,
    fetchProducts,
    categories,
    fetchCategories,
  } = useProducts()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, []) // eslint-disable-line

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">
      <h1 className="text-2xl font-bold text-text-primary">Catálogo</h1>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryFilter active={activeCategory} onChange={setCategory} categories={categories} />
      <ProductGrid
        products={filteredProducts}
        loading={loading}
        searchQuery={searchQuery}
      />
    </div>
  )
}
