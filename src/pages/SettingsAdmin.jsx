import { useState, useEffect } from 'react'
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

// Decode JWT payload to get user id and basic info
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

function SettingsAdmin() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    organization: '',
    notifications: true,
  })

  // Load current user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const decoded = decodeToken(token)
    if (!decoded?.id) return

    api.get(`/users/${decoded.id}`)
      .then((res) => {
        const u = res.data?.user || res.data
        setProfile(u)
        setForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          country: u.country || '',
          organization: u.organization || '',
          notifications: true,
        })
      })
      .catch(() => {
        // Profile fetch failed — use token data as fallback
        setForm((prev) => ({ ...prev, email: decoded.email || '' }))
      })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const decoded = decodeToken(token)
      const userId = profile?._id || profile?.id || decoded?.id

      if (userId) {
        const res = await api.put(`/users/${userId}`, {
          name: form.name || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          country: form.country || undefined,
          organization: form.organization || undefined,
        })
        const updated = res.data?.user || res.data
        setProfile(updated)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const roleLabel = profile?.role || 'Admin'
  const roleBadgeColor =
    roleLabel === 'SuperAdmin' ? '#7c3aed' :
    roleLabel === 'Admin' ? '#3c6ef2' : '#64748b'

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#3c6ef2' }}>Account</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">Manage your profile and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {/* Profile card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Avatar initial */}
            <div className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ backgroundColor: roleBadgeColor }}>
              {(form.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900">{form.name || 'Your Name'}</p>
              <span className="inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: roleBadgeColor }}>
                {roleLabel}
              </span>
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Profile</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Full Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Email Address
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Phone Number
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Country
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Organization
            <input
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder="Your organization or company"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
            />
          </label>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Preferences</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.notifications}
              onChange={(e) => setForm({ ...form, notifications: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">Receive email notifications for new admin requests and platform activity</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ backgroundColor: '#3c6ef2' }}
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="text-sm font-semibold text-emerald-600">✓ Settings saved!</span>}
        </div>
      </form>
    </section>
  )
}

export default SettingsAdmin
