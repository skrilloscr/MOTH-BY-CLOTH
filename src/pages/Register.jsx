import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    const result = register({ name: form.name, email: form.email, password: form.password })
    setLoading(false)
    if (result.success) navigate('/')
    else setError(result.error)
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
          <h1 className="text-brand-cream text-xl font-bold mt-8 tracking-widest uppercase">Create Account</h1>
          <p className="text-brand-gold text-[10px] tracking-[0.3em] uppercase mt-2">Join Cloth by Moth</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 text-xs tracking-wider">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[9px] font-medium text-brand-gold tracking-[0.25em] uppercase mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Alex Smith"
              autoComplete="name"
            />
          </div>

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
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-[9px] font-medium text-brand-gold tracking-[0.25em] uppercase mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-4 mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[10px] text-brand-gold tracking-widest uppercase mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-cream hover:text-brand-gold transition-colors underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
