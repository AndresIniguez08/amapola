import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Flower } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña inválida'),
})

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { session, init, signIn } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    init()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (session) navigate('/admin', { replace: true })
  }, [session, navigate])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data) {
    setError('')
    setLoading(true)
    try {
      await signIn(data.email, data.password)
    } catch (err) {
      setError('Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
            <Flower className="w-6 h-6 text-primary" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Panel Amapola</h1>
          <p className="text-sm text-text-muted">Acceso para administradores</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface rounded-card border border-border p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="admin@amapola.com"
              className="w-full px-4 py-3 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Contraseña</label>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-btn bg-red-50 border border-red-200 text-error text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  )
}
