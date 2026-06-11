import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import FlierPreview from '../../components/admin/FlierPreview'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function AdminAdsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adText, setAdText] = useState('')
  const [format, setFormat] = useState('instagram')
  const [downloading, setDownloading] = useState(false)
  const flierRef = useRef(null)

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .order('name')
      setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  async function handleDownload() {
    if (!flierRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(flierRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `flier-${selectedProduct?.name ?? 'producto'}-${format}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Publicidad</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de configuración */}
          <div className="flex flex-col gap-5 w-full lg:w-72 shrink-0">
            {/* Selector de producto */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Producto</label>
              {loading ? (
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Spinner size="sm" /> Cargando...
                </div>
              ) : (
                <select
                  className="w-full border border-border rounded-btn px-3 py-2 text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={selectedProduct?.id ?? ''}
                  onChange={e => {
                    const found = products.find(p => p.id === e.target.value)
                    setSelectedProduct(found ?? null)
                  }}
                >
                  <option value="">— Seleccioná un producto —</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Formato */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Formato</label>
              <div className="flex gap-2">
                {[
                  { value: 'instagram', label: 'Instagram (1:1)' },
                  { value: 'whatsapp', label: 'WhatsApp (4:3)' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFormat(opt.value)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-btn border transition-colors ${
                      format === opt.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface text-text-secondary border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Texto del anuncio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Texto del anuncio <span className="text-text-muted font-normal">(opcional)</span>
              </label>
              <textarea
                className="w-full border border-border rounded-btn px-3 py-2 text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={4}
                placeholder="Ej: ¡Recién horneados todos los días!"
                value={adText}
                onChange={e => setAdText(e.target.value)}
              />
            </div>

            {/* Botón descargar */}
            <Button
              onClick={handleDownload}
              disabled={!selectedProduct || downloading}
              className="flex items-center justify-center gap-2"
            >
              {downloading ? (
                <Spinner size="sm" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloading ? 'Generando…' : 'Descargar imagen'}
            </Button>
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <p className="text-xs text-text-muted self-start">Preview</p>
            <div className="overflow-auto max-w-full">
              <FlierPreview
                product={selectedProduct}
                adText={adText}
                format={format}
                flierRef={flierRef}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
