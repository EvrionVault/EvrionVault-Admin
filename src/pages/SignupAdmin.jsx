import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Bolivia','Brazil','Cambodia','Cameroon','Canada','Chile','China','Colombia',
  'Congo','Croatia','Cuba','Czech Republic','Denmark','Ecuador','Egypt','Ethiopia',
  'Finland','France','Germany','Ghana','Greece','Guatemala','Honduras','Hungary',
  'India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan',
  'Jordan','Kazakhstan','Kenya','Kuwait','Lebanon','Libya','Malaysia','Mexico',
  'Morocco','Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua',
  'Nigeria','Norway','Pakistan','Panama','Paraguay','Peru','Philippines','Poland',
  'Portugal','Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia',
  'Sierra Leone','Singapore','Somalia','South Africa','South Korea','Spain',
  'Sri Lanka','Sudan','Sweden','Switzerland','Syria','Tanzania','Thailand','Tunisia',
  'Turkey','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
  'Uruguay','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

function SignupAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
  })
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
        role: 'Admin',
        phone: formData.phone || undefined,
        country: formData.country || undefined,
      })
      setSuccess('Your request has been submitted. A super admin will review and activate your account.')
      setTimeout(() => navigate('/signin'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/evrionvault-logo.png"
            alt="EvrionVault"
            className="h-12 w-12 rounded-xl object-contain bg-white border border-slate-100 p-1"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div>
            <p className="text-base font-extrabold tracking-wide" style={{ color: '#3c6ef2' }}>EvrionVault</p>
            <p className="text-sm font-semibold text-slate-900">Request Access</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Request Admin Access</h1>
        <p className="mt-2 text-slate-600">
          Submit your details for super admin approval. Your account will be activated once reviewed.
        </p>

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

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              placeholder="admin@evrionvault.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Country <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-700">
            <p className="font-semibold">⏳ Super Admin Approval Required</p>
            <p className="mt-1">Your request will be reviewed by the super admin. You'll receive an email once your account is activated.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: loading ? '#7c9ef7' : '#3c6ef2' }}
          >
            {loading ? 'Submitting request...' : 'Request Access'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold hover:underline" style={{ color: '#3c6ef2' }}>
            Sign In
          </Link>
        </p>
      </div>
    </section>
  )
}

export default SignupAdmin
