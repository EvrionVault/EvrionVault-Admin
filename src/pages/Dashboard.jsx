import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const BLUE = '#3c6ef2'

const statConfig = [
  {
    key: 'events',
    label: 'Total Events',
    color: '#3c6ef2',
    bg: '#eef2ff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
      </svg>
    ),
  },
  {
    key: 'users',
    label: 'Registered Users',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    key: 'messages',
    label: 'Guest Messages',
    color: '#0891b2',
    bg: '#ecfeff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    key: 'gallery',
    label: 'Gallery Items',
    color: '#059669',
    bg: '#ecfdf5',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
]

const quickLinks = [
  { label: 'Create Event', to: '/create-event', desc: 'Publish a new event' },
  { label: 'Content Studio', to: '/create-content', desc: 'Create documents & booklets' },
  { label: 'Manage Users', to: '/users', desc: 'Review & approve accounts' },
  { label: 'All Events', to: '/events', desc: 'View all platform events' },
]

function StatCard({ config, value, loading }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{config.label}</p>
        <p className="mt-2 text-4xl font-bold text-slate-900">
          {loading ? (
            <span className="inline-block h-10 w-16 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            value.toLocaleString()
          )}
        </p>
      </div>
      <div className="rounded-xl p-3 shrink-0" style={{ backgroundColor: config.bg, color: config.color }}>
        {config.icon}
      </div>
    </div>
  )
}

function Dashboard() {
  const [data, setData] = useState({ events: 0, gallery: 0, messages: 0, users: 0 })
  const [recentEvents, setRecentEvents] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/events', { params: { page: 1, limit: 5 } }),
      api.get('/users', { params: { page: 1, limit: 5 } }).catch(() => ({ data: {} })),
    ])
      .then(([eventsRes, usersRes]) => {
        const eventsList = eventsRes.data?.data || []
        setData({
          events: eventsRes.data?.pagination?.total || eventsRes.data?.total || eventsList.length,
          gallery: 0, // fetched lazily below
          messages: 0,
          users: usersRes.data?.pagination?.total || usersRes.data?.total || 0,
        })
        setRecentEvents(eventsList)
        setRecentUsers(usersRes.data?.data || [])

        // Fetch gallery + message counts from first real event if any
        if (eventsList.length > 0) {
          const firstId = eventsList[0]._id || eventsList[0].id
          Promise.all([
            api.get(`/gallery/stats/${firstId}`).catch(() => null),
            api.get('/events', { params: { page: 1, limit: 1 } }),
          ]).then(([galleryRes]) => {
            if (galleryRes?.data?.stats) {
              setData((prev) => ({ ...prev, gallery: galleryRes.data.stats.totalMedia || 0 }))
            }
          })
        }

        // Get total message count via users endpoint approximation
        api.get('/users', { params: { page: 1, limit: 1 } }).then((r) => {
          setData((prev) => ({ ...prev, users: r.data?.pagination?.total || prev.users }))
        }).catch(() => {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <section className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{greeting} 👋</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening on EvrionVault today.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500 shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live · evrionvault-backend.onrender.com
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((cfg) => (
          <StatCard key={cfg.key} config={cfg} value={data[cfg.key]} loading={loading} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition group"
          >
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">{q.label}</p>
            <p className="mt-0.5 text-xs text-slate-400">{q.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent events + recent users side by side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent Events</h2>
            <Link to="/events" className="text-xs font-semibold hover:underline" style={{ color: BLUE }}>View all</Link>
          </div>
          {loading ? (
            <div className="p-4 space-y-3">
              {[0,1,2].map(i => <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />)}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No events yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentEvents.map((e) => (
                <div key={e._id || e.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{e.title || 'Untitled'}</p>
                    <p className="text-xs text-slate-400 capitalize">{e.type || 'event'} · {e.date ? new Date(e.date).toLocaleDateString() : 'No date'}</p>
                  </div>
                  <span className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.accessLevel === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {e.accessLevel || 'private'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent Users</h2>
            <Link to="/users" className="text-xs font-semibold hover:underline" style={{ color: BLUE }}>View all</Link>
          </div>
          {loading ? (
            <div className="p-4 space-y-3">
              {[0,1,2].map(i => <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />)}
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No users yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentUsers.map((u) => (
                <div key={u._id || u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600">
                    {(u.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{u.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    u.role === 'SuperAdmin' ? 'bg-purple-50 text-purple-700' :
                    u.role === 'Admin' ? 'bg-blue-50 text-blue-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>{u.role || 'User'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
