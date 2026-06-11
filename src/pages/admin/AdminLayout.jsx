import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Package, Settings, LogOut, LayoutDashboard, ClipboardList, Tag, Megaphone } from 'lucide-react'
import Logo from '../../components/ui/Logo'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/categorias', label: 'Categorías', icon: Tag },
  { to: '/admin/publicidad', label: 'Publicidad', icon: Megaphone },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const signOut = useAuthStore(s => s.signOut)

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-border p-4 gap-1 shrink-0">
        <div className="flex items-center gap-2 text-primary font-bold text-base px-3 py-2 mb-4">
          <Logo size={150} />
            
        </div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2.5 px-3 py-3 rounded-btn text-sm font-medium transition-colors ${
              location.pathname === to
                ? 'bg-[#F3EEFF] text-[#7C5CBF]'
                : 'text-text-secondary hover:bg-stone-100 hover:text-text-primary'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={2} />
            {label}
          </Link>
        ))}
        <div className="flex-1" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-btn text-sm font-medium text-text-muted hover:bg-red-50 hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 bg-surface border-b border-border">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Logo size={18} />
            Amapola Admin
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded text-text-muted hover:text-error transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-40 pb-safe">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 text-xs font-medium transition-colors ${
                location.pathname === to ? 'text-[#7C5CBF]' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-[10px] leading-tight text-center">{label}</span>
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 pb-28 md:pb-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
