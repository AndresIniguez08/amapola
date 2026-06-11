import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { supabase } from "../../lib/supabase";
import AdminLayout from "./AdminLayout";
import FlierPreview from "../../components/admin/FlierPreview";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";
import { urlToBase64 } from "../../lib/imageUtils";

function ComboSelector({ products, comboItems, onChange }) {
  async function updateItem(index, field, value) {
    const updated = comboItems.map((item) => ({ ...item }));

    if (field === "product") {
      const found = products.find((p) => p.id === value);
      let variants = [];
      if (found) {
        const { data } = await supabase
          .from("variants")
          .select("*")
          .eq("product_id", found.id)
          .eq("is_active", true)
          .order("position");
        variants = data ?? [];
      }
      updated[index] = {
        ...updated[index],
        product: found ?? null,
        label: found?.name ?? "",
        price: found?.price ? String(found.price) : "",
        variant: null,
        variants,
      };
    } else if (field === "variant") {
      const found = updated[index].variants?.find((v) => v.id === value) ?? null;
      updated[index] = {
        ...updated[index],
        variant: found,
        price: found?.price
          ? String(found.price)
          : String(updated[index].product?.price ?? ""),
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    onChange([...updated]);
  }

  function addItem() {
    if (comboItems.length >= 4) return;
    onChange([
      ...comboItems,
      { product: null, label: "", price: "", variant: null, variants: [] },
    ]);
  }

  function removeItem(index) {
    if (comboItems.length <= 2) return;
    onChange(comboItems.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-text-primary">
        Productos del combo (máx. 4)
      </label>
      {comboItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Producto {index + 1}
            </span>
            {comboItems.length > 2 && (
              <button
                onClick={() => removeItem(index)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Quitar
              </button>
            )}
          </div>

          {/* Selector de producto */}
          <select
            className="w-full border border-border rounded-btn px-3 py-2 text-xs bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={item.product?.id ?? ""}
            onChange={(e) => updateItem(index, "product", e.target.value)}
          >
            <option value="">— Seleccioná —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Selector de variante */}
          {item.product && (item.variants ?? []).length > 0 && (
            <select
              className="w-full border border-[#7C5CBF] rounded-btn px-3 py-1.5 text-xs bg-[#F3EEFF] text-[#7C5CBF] font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={item.variant?.id ?? ""}
              onChange={(e) => updateItem(index, "variant", e.target.value)}
            >
              <option value="">— Sin variante —</option>
              {item.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                  {v.price ? ` — $${Number(v.price).toLocaleString("es-AR")}` : ""}
                </option>
              ))}
            </select>
          )}

          {/* Etiqueta y precio */}
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border border-border rounded-btn px-3 py-1.5 text-xs bg-surface text-text-primary focus:outline-none"
              placeholder="Etiqueta (ej: x6 unid)"
              value={item.label}
              onChange={(e) => updateItem(index, "label", e.target.value)}
            />
            <input
              className="border border-border rounded-btn px-3 py-1.5 text-xs bg-surface text-text-primary focus:outline-none"
              placeholder="Precio (ej: 8000)"
              type="number"
              value={item.price}
              onChange={(e) => updateItem(index, "price", e.target.value)}
            />
          </div>
        </div>
      ))}
      {comboItems.length < 4 && (
        <button
          onClick={addItem}
          className="text-xs text-[#7C5CBF] font-semibold hover:underline text-left"
        >
          + Agregar producto
        </button>
      )}
    </div>
  );
}

export default function AdminAdsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adText, setAdText] = useState("");
  const [format, setFormat] = useState("instagram");
  const [templateType, setTemplateType] = useState("producto");
  const [comboItems, setComboItems] = useState([
    { product: null, label: "", price: "", variant: null, variants: [] },
    { product: null, label: "", price: "", variant: null, variants: [] },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [resolvedImages, setResolvedImages] = useState({});
  const flierRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .order("name");
      setProducts(data ?? []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const isDownloadDisabled =
    downloading ||
    (templateType === "producto"
      ? !selectedProduct
      : comboItems.filter((i) => i.product).length === 0);

  async function resolveImages() {
    const urls = {};

    const bgFile =
      templateType === "combo"
        ? "/fondo_publicidad_combo.png"
        : "/fondo_publicidad.png";
    urls["background"] = await urlToBase64(bgFile);

    if (templateType === "producto" && selectedProduct?.image_url) {
      urls["main"] = await urlToBase64(selectedProduct.image_url);
    }
    if (templateType === "combo") {
      const filled = comboItems.filter((i) => i.product);
      for (let i = 0; i < filled.length; i++) {
        const imageUrl =
          filled[i].variant?.image_url ?? filled[i].product?.image_url;
        if (imageUrl) {
          urls["combo_" + i] = await urlToBase64(imageUrl);
        }
      }
    }

    return urls;
  }

  async function handleDownload() {
    if (!flierRef.current) return;
    if (templateType === "producto" && !selectedProduct) return;
    if (templateType === "combo" && comboItems.filter((i) => i.product).length === 0)
      return;
    setDownloading(true);
    try {
      const resolved = await resolveImages();
      setResolvedImages(resolved);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const element = flierRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: false,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
      const link = document.createElement("a");
      link.download =
        templateType === "combo"
          ? `amapola-combo-${format}.png`
          : `amapola-${selectedProduct.name.toLowerCase().replace(/\s+/g, "-")}-${format}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setResolvedImages({});
    } catch (err) {
      console.error(err);
      toast.error("Error al generar la imagen");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Publicidad</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de configuración */}
          <div className="flex flex-col gap-5 w-full lg:w-72 shrink-0">
            {/* Selector de template */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Template</label>
              <div className="flex gap-2">
                {[
                  { value: "producto", label: "Producto" },
                  { value: "combo", label: "Combo/Oferta" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTemplateType(opt.value)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-btn border transition-colors ${
                      templateType === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-secondary border-border hover:border-primary/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de producto o combo */}
            {templateType === "producto" ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Producto</label>
                {loading ? (
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <Spinner size="sm" /> Cargando...
                  </div>
                ) : (
                  <select
                    className="w-full border border-border rounded-btn px-3 py-2 text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={selectedProduct?.id ?? ""}
                    onChange={(e) => {
                      const found = products.find((p) => p.id === e.target.value);
                      setSelectedProduct(found ?? null);
                    }}
                  >
                    <option value="">— Seleccioná un producto —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <ComboSelector
                products={products}
                comboItems={comboItems}
                onChange={setComboItems}
              />
            )}

            {/* Formato */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Formato</label>
              <div className="flex gap-2">
                {[
                  { value: "instagram", label: "Instagram (1:1)" },
                  { value: "whatsapp", label: "WhatsApp (4:3)" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormat(opt.value)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-btn border transition-colors ${
                      format === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-secondary border-border hover:border-primary/50"
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
                {templateType === "combo" ? (
                  "Título del combo"
                ) : (
                  <span>
                    Texto del anuncio{" "}
                    <span className="text-text-muted font-normal">(opcional)</span>
                  </span>
                )}
              </label>
              <textarea
                className="w-full border border-border rounded-btn px-3 py-2 text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={4}
                placeholder={
                  templateType === "combo"
                    ? "Ej: Ofertas de la semana"
                    : "Ej: ¡Recién horneados todos los días!"
                }
                value={adText}
                onChange={(e) => setAdText(e.target.value)}
              />
            </div>

            {/* Botón descargar */}
            <Button
              onClick={handleDownload}
              disabled={isDownloadDisabled}
              className="flex items-center justify-center gap-2"
            >
              {downloading ? (
                <Spinner size="sm" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloading ? "Generando…" : "Descargar imagen"}
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
                templateType={templateType}
                comboItems={comboItems}
                resolvedImages={resolvedImages}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
