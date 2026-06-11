import { useState, useEffect } from "react";
import { formatPrice } from "../../lib/formatters";
import { supabase } from "../../lib/supabase";

export default function FlierPreview({
  product,
  adText,
  format,
  flierRef,
  templateType = "producto",
  comboItems = [],
  resolvedImages = {},
}) {
  const isInstagram = format === "instagram";
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setSelectedVariant(null);
    setVariants([]);
    if (!product?.id) return;
    supabase
      .from("variants")
      .select("*")
      .eq("product_id", product.id)
      .eq("is_active", true)
      .order("position")
      .then(({ data }) => {
        setVariants(data ?? []);
      });
  }, [product?.id]);

  const displayImage = selectedVariant?.image_url ?? product?.image_url;
  const displayPrice = selectedVariant?.price ?? product?.price;
  const displayName = selectedVariant
    ? `${product.name} — ${selectedVariant.name}`
    : product?.name;

  const filledComboItems = comboItems.filter((i) => i.product);
  const itemCount = filledComboItems.length;
  const mainImageSrc = resolvedImages["main"] ?? displayImage;
  const bgSrc = resolvedImages["background"];

  // Dimensiones base altas para mejor calidad al descargar
  const INST_W = 800;
  const INST_H = 800;
  const WA_W = 800;
  const WA_H = 600;

  if (templateType === "producto" && !product) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div
          className="flex items-center justify-center bg-stone-100 rounded-2xl"
          style={{
            width: INST_W / 1.5,
            height: isInstagram ? INST_H / 1.5 : WA_H / 1.5,
          }}
        >
          <p className="text-stone-400 text-sm">
            Seleccioná un producto para ver la preview
          </p>
        </div>
      </div>
    );
  }

  if (templateType === "combo" && filledComboItems.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div
          className="flex items-center justify-center bg-stone-100 rounded-2xl"
          style={{
            width: INST_W / 1.5,
            height: isInstagram ? INST_H / 1.5 : WA_H / 1.5,
          }}
        >
          <p className="text-stone-400 text-sm">
            Seleccioná al menos un producto para el combo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Selector de variante */}
      {templateType === "producto" && variants.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-stone-500">
            Variante (opcional)
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedVariant(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                !selectedVariant
                  ? "bg-[#7C5CBF] text-white border-[#7C5CBF]"
                  : "bg-white text-stone-600 border-stone-200 hover:border-[#7C5CBF]"
              }`}
            >
              Todas
            </button>
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedVariant?.id === v.id
                    ? "bg-[#7C5CBF] text-white border-[#7C5CBF]"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#7C5CBF]"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Flyer Instagram — Producto ── */}
      {templateType === "producto" && isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: INST_W,
            height: INST_H,
            backgroundImage: bgSrc
              ? `url(${bgSrc})`
              : "url(/fondo_publicidad.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 80px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: 28,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 12px 48px rgba(61,42,107,0.25)",
              border: "5px solid rgba(255,255,255,0.9)",
            }}
          >
            {displayImage ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${mainImageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#F3EEFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 64 }}>🍞</span>
              </div>
            )}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 24,
              padding: "28px 44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              width: "100%",
              boxSizing: "border-box",
              boxShadow: "0 4px 24px rgba(61,42,107,0.12)",
            }}
          >
            <p
              style={{
                color: "#3D2A6B",
                fontWeight: 800,
                fontSize: 32,
                textAlign: "center",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </p>
            <div
              style={{
                width: 56,
                height: 3,
                background: "#7C5CBF",
                borderRadius: 2,
              }}
            />
            {adText && (
              <p
                style={{
                  color: "#5E3FA3",
                  fontSize: 18,
                  textAlign: "center",
                  margin: 0,
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                {adText}
              </p>
            )}
            <div
              style={{
                background: "#7C5CBF",
                color: "white",
                fontWeight: 800,
                fontSize: 32,
                padding: "14px 44px",
                borderRadius: 50,
              }}
            >
              {formatPrice(displayPrice)}
            </div>
          </div>

          <p
            style={{
              color: "#9B8AAF",
              fontSize: 16,
              margin: 0,
              zIndex: 1,
              letterSpacing: 0.5,
            }}
          >
            amapola.pulsowebstudio.com.ar
          </p>
        </div>
      )}

      {/* ── Flyer WhatsApp — Producto ── */}
      {templateType === "producto" && !isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: WA_W,
            height: WA_H,
            backgroundImage: bgSrc
              ? `url(${bgSrc})`
              : "url(/fondo_publicidad.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            padding: "48px 60px",
            gap: 32,
          }}
        >
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 24,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 12px 36px rgba(61,42,107,0.25)",
              border: "4px solid rgba(255,255,255,0.9)",
            }}
          >
            {displayImage ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${mainImageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#F3EEFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 56 }}>🍞</span>
              </div>
            )}
          </div>

          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.85)",
              borderRadius: 24,
              padding: "32px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 14,
              boxShadow: "0 4px 24px rgba(61,42,107,0.12)",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                color: "#3D2A6B",
                fontWeight: 800,
                fontSize: 28,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </p>
            <div
              style={{
                width: 48,
                height: 3,
                background: "#7C5CBF",
                borderRadius: 2,
              }}
            />
            {adText && (
              <p
                style={{
                  color: "#5E3FA3",
                  fontSize: 16,
                  margin: 0,
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                {adText}
              </p>
            )}
            <div
              style={{
                background: "#7C5CBF",
                color: "white",
                fontWeight: 800,
                fontSize: 28,
                padding: "12px 28px",
                borderRadius: 50,
                alignSelf: "flex-start",
              }}
            >
              {formatPrice(displayPrice)}
            </div>
            <p
              style={{
                color: "#9B8AAF",
                fontSize: 14,
                margin: "4px 0 0 0",
                letterSpacing: 0.5,
              }}
            >
              amapola.pulsowebstudio.com.ar
            </p>
          </div>
        </div>
      )}

      {/* ── Flyer Instagram — Combo ── */}
      {templateType === "combo" && isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: INST_W,
            height: INST_H,
            backgroundImage: bgSrc
              ? `url(${bgSrc})`
              : "url(/fondo_publicidad_combo.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              borderRadius: 50,
              padding: "10px 36px",
              zIndex: 1,
              boxShadow: "0 2px 16px rgba(61,42,107,0.12)",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                color: "#3D2A6B",
                fontWeight: 800,
                fontSize: 26,
                margin: 0,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {adText || "Ofertas"}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              zIndex: 1,
              width: "100%",
              flex: 1,
              minHeight: 0,
            }}
          >
            {filledComboItems.map((item, index) => {
              const itemImage =
                resolvedImages["combo_" + index] ??
                item.variant?.image_url ??
                item.product?.image_url;
              const itemName = item.variant
                ? `${item.product.name} — ${item.variant.name}`
                : item.product.name;
              const itemPrice =
                item.price || (item.variant?.price ?? item.product?.price);
              return (
                <div
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    borderRadius: 20,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 20px rgba(61,42,107,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: itemCount <= 2 ? 280 : 160,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {itemImage ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${itemImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#F3EEFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: 40 }}>🍞</span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: itemCount <= 2 ? "14px 16px" : "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: itemCount <= 2 ? 8 : 5,
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    {item.label && (
                      <p
                        style={{
                          color: "#5E3FA3",
                          fontSize: itemCount <= 2 ? 13 : 11,
                          margin: 0,
                          textAlign: "center",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {item.label}
                      </p>
                    )}
                    <p
                      style={{
                        color: "#2D1F4E",
                        fontWeight: 800,
                        fontSize: itemCount <= 2 ? 20 : 15,
                        margin: 0,
                        textAlign: "center",
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                      }}
                    >
                      {itemName}
                    </p>
                    {itemPrice && (
                      <div
                        style={{
                          background: "#7C5CBF",
                          color: "white",
                          fontWeight: 800,
                          fontSize: itemCount <= 2 ? 20 : 15,
                          padding: itemCount <= 2 ? "7px 20px" : "5px 14px",
                          borderRadius: 50,
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 10px rgba(61,42,107,0.25)",
                        }}
                      >
                        ${Number(itemPrice).toLocaleString("es-AR")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p
            style={{
              color: "#9B8AAF",
              fontSize: 14,
              margin: 0,
              zIndex: 1,
              letterSpacing: 0.5,
              flexShrink: 0,
            }}
          >
            amapola.pulsowebstudio.com.ar
          </p>
        </div>
      )}

      {/* ── Flyer WhatsApp — Combo ── */}
      {templateType === "combo" && !isInstagram && (
        <div
          ref={flierRef}
          style={{
            width: WA_W,
            height: WA_H,
            backgroundImage: bgSrc
              ? `url(${bgSrc})`
              : "url(/fondo_publicidad_combo.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            padding: "20px",
            gap: 16,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.82)",
                borderRadius: 50,
                padding: "8px 32px",
                boxShadow: "0 2px 16px rgba(61,42,107,0.12)",
              }}
            >
              <p
                style={{
                  color: "#3D2A6B",
                  fontWeight: 800,
                  fontSize: 20,
                  margin: 0,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                {adText || "Ofertas"}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(filledComboItems.length, 4)}, 1fr)`,
              gap: 10,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {filledComboItems.map((item, index) => {
              const itemImage =
                resolvedImages["combo_" + index] ??
                item.variant?.image_url ??
                item.product?.image_url;
              const itemName = item.variant
                ? `${item.product.name} — ${item.variant.name}`
                : item.product.name;
              const itemPrice =
                item.price || (item.variant?.price ?? item.product?.price);
              return (
                <div
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    borderRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 16px rgba(61,42,107,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      flex: 1,
                      minHeight: 0,
                      overflow: "hidden",
                    }}
                  >
                    {itemImage ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${itemImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#F3EEFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: 32 }}>🍞</span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: "10px 8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                      flexShrink: 0,
                      minHeight: 90,
                      justifyContent: "center",
                    }}
                  >
                    {item.label && (
                      <p
                        style={{
                          color: "#5E3FA3",
                          fontSize: 11,
                          margin: 0,
                          textAlign: "center",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {item.label}
                      </p>
                    )}
                    <p
                      style={{
                        color: "#2D1F4E",
                        fontWeight: 800,
                        fontSize: 14,
                        margin: 0,
                        textAlign: "center",
                        lineHeight: 1.3,
                        maxWidth: "100%",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {itemName}
                    </p>
                    {itemPrice && (
                      <div
                        style={{
                          background: "#7C5CBF",
                          color: "white",
                          fontWeight: 800,
                          fontSize: 14,
                          padding: "5px 14px",
                          borderRadius: 50,
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 10px rgba(61,42,107,0.25)",
                          marginTop: 2,
                        }}
                      >
                        ${Number(itemPrice).toLocaleString("es-AR")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p
            style={{
              color: "#9B8AAF",
              fontSize: 14,
              margin: 0,
              zIndex: 1,
              letterSpacing: 0.5,
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            amapola.pulsowebstudio.com.ar
          </p>
        </div>
      )}
    </div>
  );
}
