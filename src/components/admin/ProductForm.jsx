import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { X, Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'
import ImageUploader from './ImageUploader'

const PRESET_TAGS = ['Sin TACC', 'Vegano', 'Integral', 'Destacado']

const schema = z.object({
  name: z.string().min(2, 'Requerido'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Precio inválido'),
  cost: z.coerce.number().min(0).optional(),
  category: z.string().min(1, 'Elegí una categoría'),
  is_available: z.boolean(),
  is_featured: z.boolean(),
  image_url: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-stone-300'}`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </div>
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </label>
  )
}

export default function ProductForm({ product, onSuccess, onCancel, categories = [] }) {
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(product?.id)

  // --- Variants state ---
  const [variants, setVariants] = useState([])
  const [variantsLoading, setVariantsLoading] = useState(false)
  const [newVariant, setNewVariant] = useState({ name: '', price: '', image_url: '' })
  const [addingVariant, setAddingVariant] = useState(false)
  const [editingVariantId, setEditingVariantId] = useState(null)
  const [editVariant, setEditVariant] = useState({ name: '', price: '', image_url: '' })

  useEffect(() => {
    if (!isEdit) return
    loadVariants()
  }, [])

  async function loadVariants() {
    setVariantsLoading(true)
    try {
      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_id', product.id)
        .order('position')
      if (error) throw error
      setVariants(data ?? [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setVariantsLoading(false)
    }
  }

  async function handleAddVariant() {
    if (!newVariant.name.trim()) return
    setAddingVariant(true)
    try {
      const { data, error } = await supabase
        .from('variants')
        .insert({
          product_id: product.id,
          name: newVariant.name.trim(),
          price: newVariant.price ? Number(newVariant.price) : null,
          image_url: newVariant.image_url || null,
          position: variants.length,
          is_active: true,
        })
        .select()
        .single()
      if (error) throw error
      setVariants(v => [...v, data])
      setNewVariant({ name: '', price: '', image_url: '' })
      toast.success('Variante agregada')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setAddingVariant(false)
    }
  }

  async function handleToggleVariant(variant) {
    try {
      const { error } = await supabase
        .from('variants')
        .update({ is_active: !variant.is_active })
        .eq('id', variant.id)
      if (error) throw error
      setVariants(v =>
        v.map(vr => vr.id === variant.id ? { ...vr, is_active: !vr.is_active } : vr),
      )
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDeleteVariant(variant) {
    if (!window.confirm(`¿Eliminar la variante "${variant.name}"?`)) return
    try {
      const { error } = await supabase.from('variants').delete().eq('id', variant.id)
      if (error) throw error
      setVariants(v => v.filter(vr => vr.id !== variant.id))
      toast.success('Variante eliminada')
    } catch (err) {
      toast.error(err.message)
    }
  }

  function startEditVariant(variant) {
    setEditingVariantId(variant.id)
    setEditVariant({
      name: variant.name,
      price: variant.price !== null ? String(variant.price) : '',
      image_url: variant.image_url ?? '',
    })
  }

  async function handleSaveEditVariant() {
    if (!editVariant.name.trim()) return
    try {
      const updates = {
        name: editVariant.name.trim(),
        price: editVariant.price ? Number(editVariant.price) : null,
        image_url: editVariant.image_url || null,
      }
      const { error } = await supabase
        .from('variants')
        .update(updates)
        .eq('id', editingVariantId)
      if (error) throw error
      setVariants(v =>
        v.map(vr => vr.id === editingVariantId ? { ...vr, ...updates } : vr),
      )
      setEditingVariantId(null)
      toast.success('Variante actualizada')
    } catch (err) {
      toast.error(err.message)
    }
  }

  // --- Product form ---
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price ?? '',
      cost: product?.cost ?? 0,
      category: product?.category ?? '',
      is_available: product?.is_available ?? true,
      is_featured: product?.is_featured ?? false,
      image_url: product?.image_url ?? '',
      tags: product?.tags ?? [],
    },
  })

  const tags = watch('tags') ?? []

  function toggleTag(tag) {
    const current = watch('tags') ?? []
    if (current.includes(tag)) {
      setValue('tags', current.filter(t => t !== tag))
    } else {
      setValue('tags', [...current, tag])
    }
  }

  async function onSubmit(data) {
    setLoading(true)
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        updated_at: new Date().toISOString(),
      }

      if (isEdit) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id)
        if (error) throw error
        toast.success('Producto actualizado')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        toast.success('Producto creado')
      }
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Nombre <span className="text-error">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="Medialunas de manteca"
            className="w-full px-4 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-text-primary mb-1.5">Descripción</label>
          <textarea
            {...register('description')}
            rows={2}
            placeholder="Descripción corta del producto..."
            className="w-full px-4 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Precio (ARS) <span className="text-error">*</span>
          </label>
          <input
            {...register('price')}
            type="number"
            inputMode="numeric"
            step="0.01"
            placeholder="1200"
            className="w-full px-4 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.price && <p className="text-error text-xs mt-1">{errors.price.message}</p>}
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">Costo (ARS)</label>
          <input
            {...register('cost')}
            type="number"
            inputMode="numeric"
            step="0.01"
            placeholder="0"
            className="w-full px-4 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Categoría <span className="text-error">*</span>
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface"
          >
            {categories.length === 0
              ? <option value="" disabled>Cargando categorías...</option>
              : <option value="">Seleccioná</option>
            }
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {errors.category && <p className="text-error text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                tags.includes(tag)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-secondary border-border hover:border-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <Controller
          name="is_available"
          control={control}
          render={({ field }) => (
            <Toggle checked={field.value} onChange={field.onChange} label="Disponible" />
          )}
        />
        <Controller
          name="is_featured"
          control={control}
          render={({ field }) => (
            <Toggle checked={field.value} onChange={field.onChange} label="Destacado" />
          )}
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">Imagen</label>
        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <ImageUploader value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* ── Variantes ── */}
      <div className="border-t border-border pt-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Variantes</h3>

        {!isEdit ? (
          <p className="text-sm text-text-muted">
            Guardá el producto primero para agregar variantes.
          </p>
        ) : variantsLoading ? (
          <p className="text-sm text-text-muted">Cargando variantes...</p>
        ) : (
          <div className="space-y-3">
            {/* Existing variants */}
            {variants.map(variant => (
              <div key={variant.id}>
                {editingVariantId === variant.id ? (
                  /* Inline edit form */
                  <div className="bg-stone-50 rounded-xl border border-stone-200 p-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1">
                          Nombre <span className="text-error">*</span>
                        </label>
                        <input
                          value={editVariant.name}
                          onChange={e => setEditVariant(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1">Precio</label>
                        <input
                          value={editVariant.price}
                          onChange={e => setEditVariant(f => ({ ...f, price: e.target.value }))}
                          type="number"
                          step="0.01"
                          placeholder="Igual que el producto"
                          className="w-full px-3 py-2 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Imagen</label>
                      <ImageUploader
                        value={editVariant.image_url}
                        onChange={url => setEditVariant(f => ({ ...f, image_url: url }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditingVariantId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={handleSaveEditVariant}
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Variant row */
                  <div className="bg-stone-50 rounded-xl border border-stone-200 p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-200 flex-shrink-0 overflow-hidden">
                      {variant.image_url ? (
                        <img
                          src={variant.image_url}
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{variant.name}</p>
                      <p className="text-xs text-text-muted">
                        {variant.price !== null
                          ? `$${variant.price}`
                          : <span className="text-stone-400">Precio base</span>
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Toggle
                        checked={variant.is_active}
                        onChange={() => handleToggleVariant(variant)}
                        label=""
                      />
                      <button
                        type="button"
                        onClick={() => startEditVariant(variant)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                        aria-label="Editar variante"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(variant)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-red-50 transition-colors"
                        aria-label="Eliminar variante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add new variant form */}
            <div className="bg-stone-50 rounded-xl border border-dashed border-stone-300 p-3 space-y-3">
              <p className="text-xs font-semibold text-text-muted">Agregar variante</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Nombre <span className="text-error">*</span>
                  </label>
                  <input
                    value={newVariant.name}
                    onChange={e => setNewVariant(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: Docena"
                    className="w-full px-3 py-2 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Precio</label>
                  <input
                    value={newVariant.price}
                    onChange={e => setNewVariant(f => ({ ...f, price: e.target.value }))}
                    type="number"
                    step="0.01"
                    placeholder="Igual que el producto"
                    className="w-full px-3 py-2 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Imagen</label>
                <ImageUploader
                  value={newVariant.image_url}
                  onChange={url => setNewVariant(f => ({ ...f, image_url: url }))}
                />
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                loading={addingVariant}
                onClick={handleAddVariant}
                disabled={!newVariant.name.trim()}
                className="w-full"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Agregar variante
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" size="md" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md" loading={loading} className="flex-1">
          {isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  )
}
