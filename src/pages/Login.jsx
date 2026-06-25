import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const result = login(form)
    setLoading(false)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-[85vh] bg-brand-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center group">
            <span className="font-display text-brand-cream text-xl font-bold tracking-[0.28em] uppercase group-hover:text-brand-gold transition-colors">
              Cloth
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-px w-4 bg-brand-gold" />
              <span className="text-brand-gold text-[8px] tracking-[0.35em] uppercase font-display">by moth</span>
              <div className="h-px w-4 bg-brand-gold" />
            </div>
          </Link>
          <h1 className="text-brand-cream text-xl font-bold mt-8 tracking-widest uppercase">Welcome Back</h1>
          <p className="text-brand-gold text-[10px] tracking-[0.3em] uppercase mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 text-xs tracking-wider">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-[9px] font-medium text-brand-gold tracking-[0.25em] uppercase mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[9px] font-medium text-brand-gold tracking-[0.25em] uppercase mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-4 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[10px] text-brand-gold tracking-widest uppercase mt-8">
          No account?{' '}
          <Link to="/register" className="text-brand-cream hover:text-brand-gold transition-colors underline">
            Create one
          </Link>
        </p>

        <div className="mt-8 p-4 border border-brand-border bg-brand-surface text-[9px] text-brand-gold/60 tracking-wider">
          <p className="text-brand-gold/80 mb-1 uppercase tracking-[0.2em]">Demo App</p>
          <p>Register first, then sign in. No real data is stored — everything saves to your browser.</p>
        </div>
      </div>
    </div>
  )
}
