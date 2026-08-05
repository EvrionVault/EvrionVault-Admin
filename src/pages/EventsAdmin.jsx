import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

const BLUE = '#3c6ef2'

const TYPE_COLORS = {
  wedding: 'bg-pink-50 text-pink-700',
  funeral: 'bg-slate-100 text-slate-600',
  baptism: 'bg-sky-50 text-sky-700',
  birthday: 'bg-yellow-50 text-yellow-700',
  corporate: 'bg-indigo-50 text-indigo-700',
  other: 'bg-slate-100 text-slate-600',
}

function EventsAdmin() {
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadEvents = () => {
    setLoading(true)
    api.get('/events', { params: { page: 1, limit: 50 } })
      .then((res) => {
        const list = res.data?.data || res.data || []
        setEvents(list)
        setFiltered(list)
      })
      .catch(() => { setEvents([]); setFiltered([]) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadEvents() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      q ? events.filter((e) =>
        (e.title || '').toLowerCase().includes(q) ||
        (e.type || '').toLowerCase().includes(q)
      ) : events
    )
  }, [search, events])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await api.delete(`/events/${id}`)
      showToast(`"${title}" deleted.`)
      loadEvents()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section className="space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Events</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">All Events</h1>
          <p className="mt-0.5 text-sm text-slate-500">{events.length} total events on the platform</p>
        </div>
        <button
          onClick={() => navigate('/create-event')}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0 transition"
          style={{ backgroundColor: BLUE }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Event
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or type..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Head */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span>Title</span>
          <span>Type</span>
          <span>Date</span>
          <span>Access</span>
          <span />
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 mb-3 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
            </svg>
            <p className="text-sm">{search ? 'No events match your search.' : 'No events found.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((event) => (
              <div
                key={event._id || event.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 items-center px-5 py-3.5 hover:bg-slate-50 transition text-sm cursor-pointer"
                onClick={() => navigate(`/events/${event._id || event.id}`)}
              >
                <span className="font-medium text-slate-800 truncate">{event.title || 'Untitled'}</span>
                <span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${TYPE_COLORS[event.type] || 'bg-slate-100 text-slate-600'}`}>
                    {event.type || 'other'}
                  </span>
                </span>
                <span className="text-slate-500 text-xs">
                  {event.date ? new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </span>
                <span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${event.accessLevel === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {event.accessLevel || 'private'}
                  </span>
                </span>
                <div className="flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(event._id || event.id, event.title) }}
                    disabled={deleting === (event._id || event.id)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                  >
                    {deleting === (event._id || event.id) ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsAdmin
