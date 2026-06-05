import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'
import { useAuthStore } from './store/authStore'

const HomePage = lazy(() => import('./pages/HomePage'))
const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminConfigPage = lazy(() => import('./pages/admin/AdminConfigPage'))

function AdminGuard({ children }) {
  const session = useAuthStore(s => s.session)
  if (session === undefined) return <PageSpinner />
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}

function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogo" element={<CatalogPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="pedido-confirmado" element={<OrderConfirmationPage />} />
          </Route>
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route
            path="admin"
            element={
              <AdminGuard>
                <AdminDashboardPage />
              </AdminGuard>
            }
          />
          <Route
            path="admin/productos"
            element={
              <AdminGuard>
                <AdminProductsPage />
              </AdminGuard>
            }
          />
          <Route
            path="admin/configuracion"
            element={
              <AdminGuard>
                <AdminConfigPage />
              </AdminGuard>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
