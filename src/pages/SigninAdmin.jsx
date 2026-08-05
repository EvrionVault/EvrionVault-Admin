import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

function SigninAdmin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/users/login', {
        email: formData.email,
        password: formData.password,
      })
      const token = response.data?.accessToken || response.data?.token
      const userRole = response.data?.user?.role

      // Block EventHost accounts from logging into the admin panel
      if (userRole === 'EventHost') {
        setError('This account does not have admin access. Please use the main app.')
        setLoading(false)
        return
      }

      if (token) {
        localStorage.setItem('token', token)
        navigate('/')
      } else {
        setError('No access token returned from server.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/evrionvault-logo.png"
            alt="EvrionVault"
            className="h-12 w-12 rounded-xl object-contain bg-white border border-slate-100 p-1"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div>
            <p className="text-base font-extrabold tracking-wide" style={{ color: '#3c6ef2' }}>EvrionVault</p>
            <p className="text-sm font-semibold text-slate-900">Admin Portal</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
        <p className="mt-2 text-slate-600">Access the EvrionVault management dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              placeholder="admin@evrionvault.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="flex justify-end px-1">
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: loading ? '#7c9ef7' : '#3c6ef2' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-600 font-semibold hover:underline">
            Request Access
          </Link>
        </p>
      </div>
    </section>
  )
}

export default SigninAdmin
