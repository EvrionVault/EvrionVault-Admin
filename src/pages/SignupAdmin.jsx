import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

function SignupAdmin() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.')
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'Admin'
      })
      setSuccess('Your request has been submitted. An admin will review and activate your account.')
      setTimeout(() => navigate('/signin'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <img src="/evrionvault-logo.png" alt="EvrionVault" className="h-10 w-10 rounded-xl" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">EvrionVault</p>
            <p className="text-sm font-semibold text-slate-900">Request Access</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Request Admin Access</h1>
        <p className="mt-2 text-slate-600">Submit your details for admin approval. An existing admin will review your request.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 font-medium">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-700">
            <p className="font-semibold">⏳ Approval Required</p>
            <p className="mt-1">Your request will be reviewed by an existing admin. You'll receive an email once approved.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Submitting request...' : 'Request Access'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/signin" className="text-brand-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  )
}

export default SignupAdmin
