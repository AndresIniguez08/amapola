import { MapPin, Phone } from "lucide-react";
import Logo from "../ui/Logo";
import { useCatalogStore } from "../../store/catalogStore";

export default function Footer() {
  const storeConfig = useCatalogStore((s) => s.storeConfig);

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div>
            <div className="flex items-center hover:opacity-80 transition-opacity">
              <Logo size={150} />
            </div>
            <p className="text-text-muted text-sm">Pan artesanal con amor.</p>
          </div>

          <div className="space-y-2 text-sm text-text-secondary">
            {storeConfig.store_address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{storeConfig.store_address}</span>
              </div>
            )}
            {storeConfig.whatsapp_number && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+{storeConfig.whatsapp_number}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Amapola Panificados · Mercedes, Buenos
          Aires
        </div>
      </div>
    </footer>
  );
}
