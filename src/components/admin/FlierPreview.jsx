import { useState, useEffect } from 'react'
import { formatPrice } from '../../lib/formatters'
import { supabase } from '../../lib/supabase'

export default function FlierPreview({ product, adText, format, flierRef, templateType = 'producto', comboItems = [], resolvedImages = {} }) {
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

  const filledComboItems = comboItems.filter(i => i.product)
  const itemCount = filledComboItems.length
  const imageHeight = itemCount <= 2 ? 180 : 130
  const fontSize = itemCount <= 2 ? 14 : 11
  const priceSize = itemCount <= 2 ? 14 : 11
  const mainImageSrc = resolvedImages['main'] ?? displayImage
  const bgSrc = resolvedImages['background']

  if (templateType === 'producto' && !product) {
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

  if (templateType === 'combo' && filledComboItems.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div
          className="flex items-center justify-center bg-stone-100 rounded-2xl"
          style={{ width: 540, height: isInstagram ? 540 : 405 }}
        >
          <p className="text-stone-400 text-sm">
            Seleccioná al menos un producto para el combo
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Selector de variante (solo template producto) */}
      {templateType === 'producto' && variants.length > 0 && (
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

      {/* ── Flyer Instagram — Producto ── */}
      {templateType === 'producto' && isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: 540,
            height: 540,
            backgroundImage: bgSrc ? `url(${bgSrc})` : 'url(/fondo_publicidad.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
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
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${mainImageSrc})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
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
              color: '#3D2A6B', fontWeight: 800, fontSize: 20,
              textAlign: 'center', margin: 0, lineHeight: 1.2,
            }}>
              {displayName}
            </p>

            <div style={{
              width: 60, height: 2,
              background: '#7C5CBF',
              borderRadius: 2,
            }} />

            {adText && (
              <p style={{
                color: '#5E3FA3', fontSize: 13,
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
            color: '#9B8AAF', fontSize: 11,
            margin: 0, zIndex: 1, letterSpacing: 0.5,
          }}>
            amapola.pulsowebstudio.com.ar
          </p>
        </div>
      )}

      {/* ── Flyer WhatsApp — Producto ── */}
      {templateType === 'producto' && !isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: 540,
            height: 405,
            backgroundImage: bgSrc ? `url(${bgSrc})` : 'url(/fondo_publicidad.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header sin logo — incluido en la imagen de fondo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid rgba(124,92,191,0.15)',
          }} />

          {/* Body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Imagen */}
            <div style={{ width: 200, height: '100%', overflow: 'hidden', flexShrink: 0 }}>
              {displayImage ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${mainImageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
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
                color: '#3D2A6B', fontWeight: 800, fontSize: 18,
                margin: 0, lineHeight: 1.2,
              }}>
                {displayName}
              </p>

              {adText && (
                <p style={{
                  color: '#5E3FA3', fontSize: 12,
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
            borderTop: '1px solid rgba(124,92,191,0.15)',
            textAlign: 'center',
          }}>
            <p style={{
              color: '#9B8AAF', fontSize: 10,
              margin: 0, letterSpacing: 0.5,
            }}>
              amapola.pulsowebstudio.com.ar
            </p>
          </div>
        </div>
      )}

      {/* ── Flyer Instagram — Combo ── */}
      {templateType === 'combo' && isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: 540,
            height: 540,
            backgroundImage: bgSrc ? `url(${bgSrc})` : 'url(/fondo_publicidad_combo.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
            gap: 12,
          }}
        >
          {/* Título */}
          <div style={{
            background: 'rgba(124,92,191,0.15)',
            borderRadius: 50,
            padding: '6px 24px',
            zIndex: 1,
          }}>
            <p style={{
              color: '#3D2A6B', fontWeight: 800, fontSize: 18,
              margin: 0, letterSpacing: 2, textTransform: 'uppercase',
            }}>
              {adText || 'Ofertas'}
            </p>
          </div>

          {/* Grid de productos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            zIndex: 1,
            width: '100%',
            flex: 1,
          }}>
            {filledComboItems.map((item, index) => {
              const itemImage = resolvedImages['combo_' + index] ?? item.variant?.image_url ?? item.product?.image_url
              const itemName = item.variant ? `${item.product.name} — ${item.variant.name}` : item.product.name
              const itemPrice = item.price || (item.variant?.price ?? item.product?.price)
              return (
                <div key={index} style={{
                  background: 'rgba(124,92,191,0.12)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  {/* Imagen */}
                  <div style={{ width: '100%', height: imageHeight, overflow: 'hidden', flexShrink: 0 }}>
                    {itemImage ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${itemImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 28 }}>🍞</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    width: '100%',
                    minHeight: 80,
                    justifyContent: 'center',
                  }}>
                    {item.label && (
                      <p style={{
                        color: '#7C5CBF',
                        fontSize: 9,
                        margin: 0,
                        textAlign: 'center',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}>
                        {item.label}
                      </p>
                    )}
                    <p style={{
                      color: '#3D2A6B',
                      fontWeight: 700,
                      fontSize: fontSize,
                      margin: 0,
                      textAlign: 'center',
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}>
                      {itemName}
                    </p>
                    {itemPrice && (
                      <div style={{
                        background: '#7C5CBF',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: priceSize,
                        padding: '4px 12px',
                        borderRadius: 50,
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                      }}>
                        ${Number(itemPrice).toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <p style={{
            color: '#9B8AAF', fontSize: 10,
            margin: 0, zIndex: 1, letterSpacing: 0.5,
          }}>
            amapola.pulsowebstudio.com.ar
          </p>
        </div>
      )}

      {/* ── Flyer WhatsApp — Combo ── */}
      {templateType === 'combo' && !isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: 540,
            height: 405,
            backgroundImage: bgSrc ? `url(${bgSrc})` : 'url(/fondo_publicidad_combo.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header: solo título — logo incluido en el fondo */}
          <div style={{
            height: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderBottom: '1px solid rgba(124,92,191,0.15)',
            flexShrink: 0,
            zIndex: 1,
          }}>
            <p style={{
              color: '#3D2A6B', fontWeight: 800, fontSize: 14,
              margin: 0, letterSpacing: 2, textTransform: 'uppercase',
            }}>
              {adText || 'Ofertas'}
            </p>
          </div>

          {/* Body: grid de productos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${filledComboItems.length}, 1fr)`,
            flex: 1,
            gap: 8,
            padding: '10px',
            overflow: 'hidden',
            zIndex: 1,
          }}>
            {filledComboItems.map((item, index) => {
              const itemImage = resolvedImages['combo_' + index] ?? item.variant?.image_url ?? item.product?.image_url
              const itemName = item.variant ? `${item.product.name} — ${item.variant.name}` : item.product.name
              const itemPrice = item.price || (item.variant?.price ?? item.product?.price)
              return (
                <div key={index} style={{
                  background: 'rgba(124,92,191,0.12)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  {/* Imagen */}
                  <div style={{ width: '100%', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                    {itemImage ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${itemImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 24 }}>🍞</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{
                    padding: '6px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    width: '100%',
                    minHeight: 70,
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {item.label && (
                      <p style={{
                        color: '#7C5CBF',
                        fontSize: 8,
                        margin: 0,
                        textAlign: 'center',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}>
                        {item.label}
                      </p>
                    )}
                    <p style={{
                      color: '#3D2A6B',
                      fontWeight: 700,
                      fontSize: 11,
                      margin: 0,
                      textAlign: 'center',
                      lineHeight: 1.2,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {itemName}
                    </p>
                    {itemPrice && (
                      <div style={{
                        background: '#7C5CBF',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: 11,
                        padding: '3px 10px',
                        borderRadius: 50,
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                      }}>
                        ${Number(itemPrice).toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{
            height: 30,
            borderTop: '1px solid rgba(124,92,191,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, zIndex: 1,
          }}>
            <p style={{
              color: '#9B8AAF', fontSize: 10,
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
