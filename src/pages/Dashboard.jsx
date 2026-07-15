import { useEffect, useState } from 'react'
import { api } from '../api.js'

const stats = [
  { label: 'Events', key: 'events' },
  { label: 'Gallery Items', key: 'gallery' },
  { label: 'Messages', key: 'messages' },
  { label: 'Users', key: 'users' },
]

function Dashboard() {
  const [data, setData] = useState({ events: 0, gallery: 0, messages: 0, users: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/events', { params: { page: 1, limit: 1 } }),
      api.get('/gallery/event/0', { params: { page: 1, limit: 1 } }).catch(() => ({ data: { data: [], total: 0 }, pagination: { total: 0 } })),
      api.get('/messages/event/0', { params: { page: 1, limit: 1 } }).catch(() => ({ data: { data: [], total: 0 }, pagination: { total: 0 } })),
      api.get('/users', { params: { page: 1, limit: 1 } }).catch(() => ({ data: { data: [], total: 0 }, pagination: { total: 0 } })),
    ])
      .then(([eventsRes, galleryRes, messagesRes, usersRes]) => {
        setData({
          events: eventsRes.data?.pagination?.total || eventsRes.data?.total || (eventsRes.data?.data?.length ?? 0),
          gallery: galleryRes.data?.pagination?.total || galleryRes.data?.total || (galleryRes.data?.data?.length ?? 0),
          messages: messagesRes.data?.pagination?.total || messagesRes.data?.total || (messagesRes.data?.data?.length ?? 0),
          users: usersRes.data?.pagination?.total || usersRes.data?.total || (usersRes.data?.data?.length ?? 0),
        })
      })
      .catch(() => {
        setData({ events: 0, gallery: 0, messages: 0, users: 0 })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Overview</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Admin dashboard</h1>
            <p className="mt-3 text-slate-600">
              Monitor platform performance, manage events, and surface the most important data from the backend.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            Connected to <strong className="text-slate-900">evrionvault-backend.onrender.com</strong>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{loading ? '...' : data[item.key]}</p>
            <p className="mt-1 text-sm text-slate-500">Live API count</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dashboard
