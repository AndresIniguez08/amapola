import { useState, useEffect } from 'react'
import { formatPrice } from '../../lib/formatters'
import { supabase } from '../../lib/supabase'

export default function FlierPreview({ product, adText, format, flierRef }) {
  const isInstagram = format === 'instagram'
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    setSelectedVariant(null)
    setVariants([])
    if (!product?.id) return
    supabase
      .from('variants')
      .select('*')
      .eq('product_id', product.id)
      .eq('is_active', true)
      .order('position')
      .then(({ data }) => {
        setVariants(data ?? [])
      })
  }, [product?.id])

  const displayImage = selectedVariant?.image_url ?? product?.image_url
  const displayPrice = selectedVariant?.price ?? product?.price
  const displayName = selectedVariant
    ? `${product.name} — ${selectedVariant.name}`
    : product?.name

  if (!product) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div
          className="flex items-center justify-center bg-stone-100 rounded-2xl"
          style={{ width: 540, height: isInstagram ? 540 : 405 }}
        >
          <p className="text-stone-400 text-sm">
            Seleccioná un producto para ver la preview
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Selector de variante */}
      {variants.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-stone-500">Variante (opcional)</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedVariant(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                !selectedVariant
                  ? 'bg-[#7C5CBF] text-white border-[#7C5CBF]'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-[#7C5CBF]'
              }`}
            >
              Todas
            </button>
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedVariant?.id === v.id
                    ? 'bg-[#7C5CBF] text-white border-[#7C5CBF]'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-[#7C5CBF]'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flyer Instagram */}
      {isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: 540,
            height: 540,
            background: 'linear-gradient(135deg, #4A3070 0%, #7C5CBF 50%, #9B7FD4 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '28px 28px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Círculos decorativos */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 150, height: 150, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />

          {/* Logo grande centrado */}
          <div style={{ zIndex: 1, display: 'flex', justifyContent: 'center' }}>
            <img
              src="/amapola-logo.png"
              alt="Logo"
              style={{ width: 90, height: 90, objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Imagen del producto */}
          <div style={{
            width: 260, height: 260,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            zIndex: 1,
            flexShrink: 0,
          }}>
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 40 }}>🍞</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 8, zIndex: 1, width: '100%',
          }}>
            <p style={{
              color: 'white', fontWeight: 800, fontSize: 20,
              textAlign: 'center', margin: 0, lineHeight: 1.2,
            }}>
              {displayName}
            </p>

            <div style={{
              width: 60, height: 2,
              background: 'rgba(255,255,255,0.4)',
              borderRadius: 2,
            }} />

            {adText && (
              <p style={{
                color: 'rgba(255,255,255,0.85)', fontSize: 13,
                textAlign: 'center', margin: 0, fontStyle: 'italic',
                lineHeight: 1.4, maxWidth: 380,
              }}>
                {adText}
              </p>
            )}

            <div style={{
              background: 'white',
              color: '#7C5CBF',
              fontWeight: 800,
              fontSize: 20,
              padding: '8px 28px',
              borderRadius: 50,
              marginTop: 4,
            }}>
              {formatPrice(displayPrice)}
            </div>
          </div>

          {/* Footer */}
          <p style={{
            color: 'rgba(255,255,255,0.45)', fontSize: 11,
            margin: 0, zIndex: 1, letterSpacing: 0.5,
          }}>
            amapola.pulsowebstudio.com.ar
          </p>
        </div>
      )}

      {/* Flyer WhatsApp */}
      {!isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: 540,
            height: 405,
            background: 'linear-gradient(135deg, #4A3070 0%, #7C5CBF 60%, #9B7FD4 100%)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header solo con logo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <img
              src="/amapola-logo.png"
              alt="Logo"
              style={{ width: 44, height: 44, objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Imagen */}
            <div style={{ width: 200, height: '100%', overflow: 'hidden', flexShrink: 0 }}>
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 40 }}>🍞</span>
                </div>
              )}
            </div>

            {/* Texto */}
            <div style={{
              flex: 1, padding: '20px',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', gap: 10,
            }}>
              <p style={{
                color: 'white', fontWeight: 800, fontSize: 18,
                margin: 0, lineHeight: 1.2,
              }}>
                {displayName}
              </p>

              {adText && (
                <p style={{
                  color: 'rgba(255,255,255,0.8)', fontSize: 12,
                  margin: 0, fontStyle: 'italic', lineHeight: 1.4,
                }}>
                  {adText}
                </p>
              )}

              <div style={{
                background: 'white',
                color: '#7C5CBF',
                fontWeight: 800,
                fontSize: 18,
                padding: '6px 20px',
                borderRadius: 50,
                display: 'inline-block',
                alignSelf: 'flex-start',
                marginTop: 4,
              }}>
                {formatPrice(displayPrice)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.4)', fontSize: 10,
              margin: 0, letterSpacing: 0.5,
            }}>
              amapola.pulsowebstudio.com.ar
            </p>
          </div>
        </div>
      )}
    </div>
  )
}