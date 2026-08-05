import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await api.post('/users/forgot-password', { email })
      setMessage('Password reset link has been sent to your email.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.')
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
            <p className="text-sm font-semibold text-slate-900">Security</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
        <p className="mt-2 text-slate-600">Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}
          {message && <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">{message}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              placeholder="admin@evrionvault.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: loading ? '#7c9ef7' : '#3c6ef2' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Remembered your password?{' '}
          <Link to="/signin" className="text-brand-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  )
}

export default ForgotPassword
