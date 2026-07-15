import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.')
    }
    setLoading(true)
    setError('')
    try {
      await api.post(`/users/reset-password/${token}`, { password: formData.password })
      navigate('/signin')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
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
            <p className="text-sm font-semibold text-slate-900">Security</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
        <p className="mt-2 text-slate-600">Set a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">New Password</label>
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
            <label className="text-sm font-medium text-slate-700 ml-1">Confirm New Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword
