import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { X } from 'lucide-react'
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
