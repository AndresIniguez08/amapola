import { useState, useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Spinner from '../ui/Spinner'
import toast from 'react-hot-toast'

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5 MB')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      onChange(data.publicUrl)
      toast.success('Imagen subida')
    } catch (err) {
      toast.error(`Error al subir imagen: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function handleRemove() {
    onChange('')
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-32 h-32 rounded-card overflow-hidden border border-border">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Quitar imagen"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`w-full h-32 rounded-card border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary-light' : 'border-border hover:border-primary hover:bg-primary-light/50'
          }`}
        >
          {uploading ? (
            <Spinner size="md" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                {dragOver ? (
                  <Upload className="w-4 h-4 text-primary" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-text-muted" />
                )}
              </div>
              <span className="text-xs text-text-muted text-center px-4">
                {dragOver ? 'Soltar aquí' : 'Hacé clic o arrastrá una imagen'}
              </span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => uploadFile(e.target.files[0])}
        disabled={uploading}
      />
    </div>
  )
}
