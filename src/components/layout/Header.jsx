import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import CartDrawer from "../cart/CartDrawer";
import Logo from "../ui/Logo";

export default function Header() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCartOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-surface transition-shadow duration-200 ${
          scrolled ? "shadow-card" : "border-b border-border"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <Logo size={28} />
            <span>Amapola</span>
          </Link>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-full hover:bg-primary-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Abrir carrito${totalItems > 0 ? `, ${totalItems} productos` : ""}`}
          >
            <ShoppingCart
              className="w-5 h-5 text-text-primary"
              strokeWidth={2}
            />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
