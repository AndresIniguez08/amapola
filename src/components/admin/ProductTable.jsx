import { useState } from 'react'
import { Edit2, Trash2, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import Badge from '../ui/Badge'
import { formatPrice } from '../../lib/formatters'

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${checked ? 'bg-primary' : 'bg-stone-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-checked={checked}
      role="switch"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function ProductTable({ products, onEdit, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  async function handleToggle(product, field) {
    setLoadingId(`${product.id}-${field}`)
    try {
      const { error } = await supabase
        .from('products')
        .update({ [field]: !product[field], updated_at: new Date().toISOString() })
        .eq('id', product.id)
      if (error) throw error
      onRefresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(id) {
    setLoadingId(`${id}-delete`)
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Producto eliminado')
      setConfirmDelete(null)
      onRefresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted text-sm">
        No hay productos. Creá uno nuevo.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-50 border-b border-border">
            <th className="text-left px-4 py-3 font-semibold text-text-secondary">Producto</th>
            <th className="text-left px-4 py-3 font-semibold text-text-secondary hidden sm:table-cell">Categoría</th>
            <th className="text-left px-4 py-3 font-semibold text-text-secondary">Precio</th>
            <th className="text-center px-4 py-3 font-semibold text-text-secondary">Activo</th>
            <th className="text-center px-4 py-3 font-semibold text-text-secondary hidden md:table-cell">Destacado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map(product => (
            <tr key={product.id} className="bg-surface hover:bg-stone-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-stone-300" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-text-primary">{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                {product.category}
              </td>
              <td className="px-4 py-3 font-semibold text-text-primary">
                {formatPrice(product.price)}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <ToggleSwitch
                    checked={product.is_available}
                    onChange={() => handleToggle(product, 'is_available')}
                    disabled={loadingId === `${product.id}-is_available`}
                  />
                </div>
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell">
                <div className="flex justify-center">
                  <ToggleSwitch
                    checked={product.is_featured}
                    onChange={() => handleToggle(product, 'is_featured')}
                    disabled={loadingId === `${product.id}-is_featured`}
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 justify-end">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 rounded hover:bg-stone-100 text-text-muted hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    aria-label="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {confirmDelete === product.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 rounded text-xs text-text-muted hover:bg-stone-100 transition-colors"
                      >
                        No
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-2 py-1 rounded text-xs text-error hover:bg-red-50 transition-colors font-semibold"
                        disabled={loadingId === `${product.id}-delete`}
                      >
                        Sí, borrar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      className="p-2 rounded hover:bg-red-50 text-text-muted hover:text-error transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-error"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
