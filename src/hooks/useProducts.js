import { useEffect } from 'react'
import { useCatalogStore } from '../store/catalogStore'

export function useProducts() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    fetchStoreConfig,
    filteredProducts,
    activeCategory,
    searchQuery,
    setCategory,
    setSearchQuery,
    storeConfig,
  } = useCatalogStore()

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
      fetchStoreConfig()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    filteredProducts,
    loading,
    error,
    storeConfig,
    activeCategory,
    searchQuery,
    setCategory,
    setSearchQuery,
    refetch: fetchProducts,
  }
}
