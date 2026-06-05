import { useCatalogStore } from '../store/catalogStore'

export function useProducts() {
  const products = useCatalogStore(s => s.products)
  const storeConfig = useCatalogStore(s => s.storeConfig)
  const loading = useCatalogStore(s => s.loading)
  const error = useCatalogStore(s => s.error)
  const activeCategory = useCatalogStore(s => s.activeCategory)
  const searchQuery = useCatalogStore(s => s.searchQuery)
  const fetchProducts = useCatalogStore(s => s.fetchProducts)
  const fetchStoreConfig = useCatalogStore(s => s.fetchStoreConfig)
  const categories = useCatalogStore(s => s.categories)
  const fetchCategories = useCatalogStore(s => s.fetchCategories)
  const setCategory = useCatalogStore(s => s.setCategory)
  const setSearchQuery = useCatalogStore(s => s.setSearchQuery)
  const getFilteredProducts = useCatalogStore(s => s.getFilteredProducts)
const filteredProducts = getFilteredProducts()

  return {
    products,
    storeConfig,
    loading,
    error,
    activeCategory,
    searchQuery,
    fetchProducts,
    fetchStoreConfig,
    categories,
    fetchCategories,
    setCategory,
    setSearchQuery,
    filteredProducts,
  }
}