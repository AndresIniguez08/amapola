import { formatPrice } from '../../lib/formatters'

export default function FlierPreview({ product, adText, format, flierRef }) {
  const isInstagram = format === 'instagram'

  if (!product) {
    return (
      <div
        className="flex items-center justify-center bg-stone-100 rounded-2xl"
        style={{ width: 540, height: isInstagram ? 540 : 405 }}
      >
        <p className="text-stone-400 text-sm">
          Seleccioná un producto para ver la preview
        </p>
      </div>
    )
  }

  if (isInstagram) {
    return (
      <div
        ref={flierRef}
        style={{
          width: 540,
          height: 540,
          background: 'linear-gradient(135deg, #2D2040 0%, #5E3FA3 50%, #7C5CBF 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px 28px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Círculos decorativos */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 150, height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 1 }}>
          <img
            src="/amapola-logo.png"
            alt="Logo"
            style={{ width: 60, height: 60, objectFit: 'contain' }}
            crossOrigin="anonymous"
          />
          <span style={{ color: 'white', fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>
            AMAPOLA PANIFICADOS
          </span>
        </div>

        {/* Imagen del producto */}
        <div style={{
          width: 240, height: 240,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          zIndex: 1,
          flexShrink: 0,
        }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 40 }}>🍞</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8, zIndex: 1, width: '100%',
        }}>
          <p style={{
            color: 'white', fontWeight: 800, fontSize: 22,
            textAlign: 'center', margin: 0, lineHeight: 1.2,
          }}>
            {product.name}
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
            {formatPrice(product.price)}
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
    )
  }

  // WhatsApp — layout horizontal
  return (
    <div
      ref={flierRef}
      style={{
        width: 540,
        height: 405,
        background: 'linear-gradient(135deg, #2D2040 0%, #5E3FA3 60%, #7C5CBF 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <img
          src="/amapola-logo.png"
          alt="Logo"
          style={{ width: 28, height: 28, objectFit: 'contain' }}
          crossOrigin="anonymous"
        />
        <span style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
          AMAPOLA PANIFICADOS
        </span>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Imagen */}
        <div style={{ width: 180, height: '100%', overflow: 'hidden', flexShrink: 0 }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
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
            {product.name}
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
            {formatPrice(product.price)}
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
  )
}
