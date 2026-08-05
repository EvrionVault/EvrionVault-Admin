import { useEffect, useState } from 'react'
import { api } from '../api.js'

const BLUE = '#3c6ef2'

function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [pendingAdmins, setPendingAdmins] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadUsers = () => {
    setLoading(true)
    api.get('/users', { params: { page: 1, limit: 50 } })
      .then((response) => {
        const all = response.data?.data || response.data || []
        const pending = all.filter((u) => u.role === 'Admin' && u.isActive === false)
        const active = all.filter((u) => !(u.role === 'Admin' && u.isActive === false))
        setPendingAdmins(pending)
        setUsers(active)
        setFiltered(active)
      })
      .catch(() => { setPendingAdmins([]); setUsers([]); setFiltered([]) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  useEffect(() => {
    let list = users
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      )
    }
    setFiltered(list)
  }, [search, roleFilter, users])

  const approveAdmin = async (userId) => {
    setActionLoading(userId + '_approve')
    try {
      await api.patch(`/users/${userId}/approve`)
      showToast('Admin account approved and activated.')
      loadUsers()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve admin.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const rejectAdmin = async (userId) => {
    setActionLoading(userId + '_reject')
    try {
      await api.delete(`/users/${userId}/reject`)
      showToast('Admin request rejected and removed.')
      loadUsers()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject request.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <section className="space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Users</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">User Management</h1>
        <p className="mt-0.5 text-sm text-slate-500">Review registrations, approve admin access, and manage roles.</p>
      </div>

      {/* Pending Admin Requests */}
      {(loading || pendingAdmins.length > 0) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-amber-100">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-sm font-bold text-amber-800">
              Pending Admin Requests
            </h2>
            {pendingAdmins.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-amber-500 text-white text-xs px-1.5">
                {pendingAdmins.length}
              </span>
            )}
          </div>
          {loading ? (
            <div className="p-4 space-y-3">
              {[0,1].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-amber-100" />)}
            </div>
          ) : pendingAdmins.length === 0 ? (
            <p className="p-5 text-sm text-amber-700 text-center">No pending requests.</p>
          ) : pendingAdmins.map((user) => (
            <div key={user._id || user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 px-5 py-4 last:border-b-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-sm font-bold text-amber-700">
                  {(user.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <div className="flex gap-2 mt-0.5">
                    {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
                    {user.country && <p className="text-xs text-slate-400">· {user.country}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => approveAdmin(user._id || user.id)}
                  disabled={actionLoading === (user._id || user.id) + '_approve'}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-white transition disabled:opacity-60"
                  style={{ backgroundColor: BLUE }}
                >
                  {actionLoading === (user._id || user.id) + '_approve' ? 'Approving...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => rejectAdmin(user._id || user.id)}
                  disabled={actionLoading === (user._id || user.id) + '_reject'}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition disabled:opacity-60"
                >
                  {actionLoading === (user._id || user.id) + '_reject' ? 'Rejecting...' : '✕ Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition"
        >
          <option value="all">All Roles</option>
          <option value="SuperAdmin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="EventHost">Event Host</option>
          <option value="Guest">Guest</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 mb-3 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <div key={user._id || user.id} className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 items-center px-5 py-3.5 hover:bg-slate-50 transition text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-bold text-slate-500">
                      {(user.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">{user.name || 'Unknown'}</p>
                    {user.country && <p className="text-xs text-slate-400 truncate">{user.country}</p>}
                  </div>
                </div>
                <span className="text-slate-500 text-xs truncate">{user.email || '—'}</span>
                <span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    user.role === 'SuperAdmin' ? 'bg-purple-50 text-purple-700' :
                    user.role === 'Admin' ? 'bg-blue-50 text-blue-700' :
                    user.role === 'EventHost' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{user.role || 'Guest'}</span>
                </span>
                <span className={`text-xs font-semibold ${user.isActive !== false ? 'text-emerald-600' : 'text-red-400'}`}>
                  {user.isActive !== false ? '● Active' : '● Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default UsersAdmin
