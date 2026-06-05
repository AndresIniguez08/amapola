import { useEffect, useState } from 'react'
import { GripVertical, Pencil, Trash2, ChevronUp, ChevronDown, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  async function loadCategories() {
    setLoading(true)
    const { data, error } = await supabase.from('categories').select('*').order('position')
    if (error) {
      toast.error('Error al cargar categorías')
    } else {
      setCategories(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function handleNewNameChange(val) {
    setNewName(val)
    setNewSlug(slugify(val))
  }

  async function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) {
      toast.error('El nombre no puede estar vacío')
      return
    }
    const exists = categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())
    if (exists) {
      toast.error(`La categoría "${trimmed}" ya existe`)
      return
    }
    setAdding(true)
    const maxPos = categories.reduce((max, c) => Math.max(max, c.position ?? 0), 0)
    const { error } = await supabase.from('categories').insert({
      name: trimmed,
      slug: slugify(trimmed),
      position: maxPos + 1,
      is_active: true,
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Categoría "${trimmed}" agregada`)
      setNewName('')
      setNewSlug('')
      await loadCategories()
    }
    setAdding(false)
  }

  async function handleToggleActive(cat) {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(cat.is_active ? `"${cat.name}" desactivada` : `"${cat.name}" activada`)
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: !c.is_active } : c))
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  async function confirmEdit(cat) {
    const trimmed = editingName.trim()
    if (!trimmed) {
      toast.error('El nombre no puede estar vacío')
      return
    }
    if (trimmed === cat.name) {
      setEditingId(null)
      return
    }
    const exists = categories.some(c => c.id !== cat.id && c.name.toLowerCase() === trimmed.toLowerCase())
    if (exists) {
      toast.error(`La categoría "${trimmed}" ya existe`)
      return
    }
    const { error } = await supabase
      .from('categories')
      .update({ name: trimmed, slug: slugify(trimmed) })
      .eq('id', cat.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Categoría actualizada')
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: trimmed, slug: slugify(trimmed) } : c))
      setEditingId(null)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
  }

  async function handleDelete(cat) {
    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category', cat.name)
    if (countError) {
      toast.error(countError.message)
      setConfirmDeleteId(null)
      return
    }
    if (count > 0) {
      toast.error(`No podés eliminar "${cat.name}" porque tiene ${count} producto${count !== 1 ? 's' : ''} asignado${count !== 1 ? 's' : ''}`)
      setConfirmDeleteId(null)
      return
    }
    const { error } = await supabase.from('categories').delete().eq('id', cat.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Categoría "${cat.name}" eliminada`)
      setCategories(prev => prev.filter(c => c.id !== cat.id))
    }
    setConfirmDeleteId(null)
  }

  async function moveUp(index) {
    if (index === 0) return
    const a = categories[index]
    const b = categories[index - 1]
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('categories').update({ position: b.position }).eq('id', a.id),
      supabase.from('categories').update({ position: a.position }).eq('id', b.id),
    ])
    if (e1 || e2) {
      toast.error('Error al reordenar')
    } else {
      const updated = [...categories]
      updated[index] = { ...a, position: b.position }
      updated[index - 1] = { ...b, position: a.position }
      setCategories(updated)
    }
  }

  async function moveDown(index) {
    if (index === categories.length - 1) return
    const a = categories[index]
    const b = categories[index + 1]
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('categories').update({ position: b.position }).eq('id', a.id),
      supabase.from('categories').update({ position: a.position }).eq('id', b.id),
    ])
    if (e1 || e2) {
      toast.error('Error al reordenar')
    } else {
      const updated = [...categories]
      updated[index] = { ...a, position: b.position }
      updated[index + 1] = { ...b, position: a.position }
      setCategories(updated)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-text-primary">Categorías</h1>
      </div>

      {/* Formulario de nueva categoría */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Agregar categoría</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newName}
              onChange={e => handleNewNameChange(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            />
            {newSlug && (
              <p className="text-xs text-text-muted mt-1">Slug: <span className="font-mono">{newSlug}</span></p>
            )}
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleAdd}
            loading={adding}
            className="shrink-0"
          >
            Agregar categoría
          </Button>
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-text-muted text-sm">
            No hay categorías todavía.
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {categories.map((cat, index) => (
              <li key={cat.id} className="flex items-center gap-3 px-4 py-3">
                {/* Drag handle visual */}
                <GripVertical className="w-4 h-4 text-stone-300 shrink-0" />

                {/* Nombre / edición inline */}
                <div className="flex-1 min-w-0">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') confirmEdit(cat)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                      />
                      <button
                        onClick={() => confirmEdit(cat)}
                        className="p-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                        aria-label="Confirmar"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-full hover:bg-stone-100 text-text-muted transition-colors"
                        aria-label="Cancelar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary truncate">{cat.name}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-stone-100 text-text-muted shrink-0">
                        #{cat.position}
                      </span>
                    </div>
                  )}
                </div>

                {/* Controles */}
                {editingId !== cat.id && (
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Toggle activo */}
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${cat.is_active ? 'bg-primary' : 'bg-stone-300'}`}
                      aria-label={cat.is_active ? 'Desactivar' : 'Activar'}
                      title={cat.is_active ? 'Activa' : 'Inactiva'}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${cat.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </button>

                    {/* Reordenar */}
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-stone-100 text-text-muted disabled:opacity-30 transition-colors"
                      aria-label="Subir"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === categories.length - 1}
                      className="p-1.5 rounded hover:bg-stone-100 text-text-muted disabled:opacity-30 transition-colors"
                      aria-label="Bajar"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 rounded hover:bg-stone-100 text-text-muted transition-colors"
                      aria-label="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Eliminar */}
                    {confirmDeleteId === cat.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(cat)}
                          className="px-2 py-1 text-xs font-semibold bg-error text-white rounded-btn hover:bg-error/90 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 text-xs font-semibold bg-stone-100 text-text-secondary rounded-btn hover:bg-stone-200 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-text-muted hover:text-error transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  )
}
