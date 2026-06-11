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

  if (templateType === "producto" && !product) {
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
    );
  }

  if (templateType === "combo" && filledComboItems.length === 0) {
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
            width: 540,
            height: 540,
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
            padding: "40px 60px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 8px 32px rgba(61,42,107,0.25)",
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
                <span style={{ fontSize: 48 }}>🍞</span>
              </div>
            )}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 20,
              padding: "20px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              width: "100%",
              boxSizing: "border-box",
              boxShadow: "0 4px 20px rgba(61,42,107,0.12)",
            }}
          >
            <p
              style={{
                color: "#3D2A6B",
                fontWeight: 800,
                fontSize: 22,
                textAlign: "center",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </p>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#7C5CBF",
                borderRadius: 2,
              }}
            />
            {adText && (
              <p
                style={{
                  color: "#5E3FA3",
                  fontSize: 13,
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
                fontSize: 22,
                padding: "10px 32px",
                borderRadius: 50,
              }}
            >
              {formatPrice(displayPrice)}
            </div>
          </div>

          <p
            style={{
              color: "#9B8AAF",
              fontSize: 11,
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
            width: 540,
            height: 405,
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
            padding: "30px 40px",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 18,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(61,42,107,0.25)",
              border: "3px solid rgba(255,255,255,0.9)",
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
                <span style={{ fontSize: 40 }}>🍞</span>
              </div>
            )}
          </div>

          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 4px 20px rgba(61,42,107,0.12)",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                color: "#3D2A6B",
                fontWeight: 800,
                fontSize: 18,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </p>
            <div
              style={{
                width: 36,
                height: 2,
                background: "#7C5CBF",
                borderRadius: 2,
              }}
            />
            {adText && (
              <p
                style={{
                  color: "#5E3FA3",
                  fontSize: 12,
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
                fontSize: 18,
                padding: "8px 20px",
                borderRadius: 50,
                alignSelf: "flex-start",
              }}
            >
              {formatPrice(displayPrice)}
            </div>
            <p
              style={{
                color: "#9B8AAF",
                fontSize: 10,
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
            width: 540,
            height: 540,
            backgroundImage: bgSrc
              ? `url(${bgSrc})`
              : "url(/fondo_publicidad_combo.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            gap: 14,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              borderRadius: 50,
              padding: "8px 28px",
              zIndex: 1,
              boxShadow: "0 2px 12px rgba(61,42,107,0.12)",
            }}
          >
            <p
              style={{
                color: "#3D2A6B",
                fontWeight: 800,
                fontSize: 18,
                margin: 0,
                letterSpacing: 2,
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
              gap: 10,
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
                      height: itemCount <= 2 ? 200 : 140,
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
                        <span style={{ fontSize: 28 }}>🍞</span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    {item.label && (
                      <p
                        style={{
                          color: "#5E3FA3",
                          fontSize: 10,
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
                        fontSize: itemCount <= 2 ? 15 : 12,
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
                          fontSize: itemCount <= 2 ? 15 : 12,
                          padding: "5px 14px",
                          borderRadius: 50,
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 8px rgba(61,42,107,0.25)",
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
              fontSize: 10,
              margin: 0,
              zIndex: 1,
              letterSpacing: 0.5,
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
            width: 540,
            height: 405,
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
            padding: "16px",
            gap: 12,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.82)",
                borderRadius: 50,
                padding: "6px 24px",
                boxShadow: "0 2px 12px rgba(61,42,107,0.12)",
              }}
            >
              <p
                style={{
                  color: "#3D2A6B",
                  fontWeight: 800,
                  fontSize: 14,
                  margin: 0,
                  letterSpacing: 2,
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
              gap: 8,
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
                    borderRadius: 12,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 12px rgba(61,42,107,0.1)",
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
                        <span style={{ fontSize: 24 }}>🍞</span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    {item.label && (
                      <p
                        style={{
                          color: "#5E3FA3",
                          fontSize: 8,
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
                        fontSize: 11,
                        margin: 0,
                        textAlign: "center",
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
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
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 50,
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 8px rgba(61,42,107,0.25)",
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
              fontSize: 10,
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
