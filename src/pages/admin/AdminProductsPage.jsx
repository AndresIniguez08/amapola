import { useEffect, useState, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import ProductTable from '../../components/admin/ProductTable'
import ProductForm from '../../components/admin/ProductForm'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import SearchBar from '../../components/catalog/SearchBar'
import CategoryFilter from '../../components/catalog/CategoryFilter'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todo')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  function openCreate() {
    setEditProduct(null)
    setModalOpen(true)
  }

  function openEdit(product) {
    setEditProduct(product)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditProduct(null)
  }

  async function handleSuccess() {
    closeModal()
    await fetchProducts()
  }

  const filtered = products.filter(p => {
    const matchCat = category === 'todo' || p.category === category
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-text-primary">Productos</h1>
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="space-y-3 mb-5">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <ProductTable products={filtered} onEdit={openEdit} onRefresh={fetchProducts} />
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
          <div className="bg-surface rounded-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-text-primary">
                {editProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>
            <div className="p-5">
              <ProductForm
                product={editProduct}
                onSuccess={handleSuccess}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
