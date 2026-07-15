import { useEffect, useState } from 'react'
import { api } from '../api.js'

function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/users', { params: { page: 1, limit: 12 } })
      .then((response) => setUsers(response.data?.data || response.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Users</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">User management</h1>
        <p className="mt-3 text-slate-600">Review user registration, role assignments, and profile activity.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : users.length ? (
          users.map((user) => (
            <div key={user._id || user.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 p-4 text-sm text-slate-700 last:border-b-0 hover:bg-slate-50">
              <span className="font-medium">{user.name || 'Unknown'}</span>
              <span className="text-slate-500">{user.email || 'No email'}</span>
              <span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  user.role === 'Admin' ? 'bg-brand-50 text-brand-700' :
                  user.role === 'EventHost' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {user.role || 'Guest'}
                </span>
              </span>
              <span className="text-slate-500">{user.isActive !== false ? 'Active' : 'Inactive'}</span>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">No users available.</div>
        )}
      </div>
    </section>
  )
}

export default UsersAdmin
