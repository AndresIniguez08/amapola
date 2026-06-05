import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useCatalogStore = create((set, get) => ({
  products: [],
  storeConfig: {},
  loading: false,
  error: null,
  activeCategory: 'todo',
  searchQuery: '',

  async fetchProducts() {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('is_featured', { ascending: false })
        .order('name')

      if (error) throw error
      set({ products: data ?? [] })
    } catch (err) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  async fetchStoreConfig() {
    try {
      const { data, error } = await supabase.from('store_config').select('*')
      if (error) throw error
      const config = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
      set({ storeConfig: config })
    } catch {
      // non-critical; app still works without config
    }
  },

  setCategory(category) {
    set({ activeCategory: category })
  },

  setSearchQuery(query) {
    set({ searchQuery: query })
  },

  get filteredProducts() {
    const { products, activeCategory, searchQuery } = get()
    let result = products
    if (activeCategory !== 'todo') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q),
      )
    }
    return result
  },
}))
