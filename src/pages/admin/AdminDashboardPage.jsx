import { useEffect, useState } from 'react'
import { Package, CheckCircle, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import Spinner from '../../components/ui/Spinner'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-surface rounded-card border border-border p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('id, is_available, is_featured')
      if (data) {
        setStats({
          total: data.length,
          active: data.filter(p => p.is_available).length,
          featured: data.filter(p => p.is_featured).length,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-text-primary mb-6">Dashboard</h1>
      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Package}
            label="Total productos"
            value={stats?.total ?? 0}
            color="bg-primary-light text-primary"
          />
          <StatCard
            icon={CheckCircle}
            label="Disponibles"
            value={stats?.active ?? 0}
            color="bg-green-50 text-success"
          />
          <StatCard
            icon={Star}
            label="Destacados"
            value={stats?.featured ?? 0}
            color="bg-yellow-50 text-yellow-600"
          />
        </div>
      )}
    </AdminLayout>
  )
}
