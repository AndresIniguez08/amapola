import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useAuthStore } from '../../store/authStore'
import { useCatalogStore } from '../../store/catalogStore'

export default function Layout() {
  const init = useAuthStore(s => s.init)
  const fetchStoreConfig = useCatalogStore(s => s.fetchStoreConfig)

  useEffect(() => {
    init()
    fetchStoreConfig()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
