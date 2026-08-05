import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

const MAIN_APP_URL = import.meta.env.VITE_APP_URL || 'https://evrionvault.vercel.app'

function formatDate(d) {
  if (!d) return 'No date'
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function MyEventsAdmin() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadEvents = () => {
    setLoading(true)
    api.get('/events', { params: { page: 1, limit: 50 } })
      .then((res) => setEvents(res.data?.data || res.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadEvents() }, [])

  const handleDelete = async (eventId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(eventId)
    try {
      await api.delete(`/events/${eventId}`)
      showToast(`"${title}" deleted.`)
      loadEvents()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete event.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#3c6ef2' }}>Events</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">My Events</h1>
          <p className="mt-1 text-slate-500">Events you've created and manage.</p>
        </div>
        <button
          onClick={() => navigate('/create-event')}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition shrink-0"
          style={{ backgroundColor: '#3c6ef2' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Event
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-400 text-sm mb-4">No events yet.</p>
          <button
            onClick={() => navigate('/create-event')}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: '#3c6ef2' }}
          >
            Create your first event
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const eventDate = event.date
              ? (event.endDate && event.endDate !== event.date
                ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
                : formatDate(event.date))
              : 'No date'
            const guestUrl = event.slug ? `${MAIN_APP_URL}/events/${event.slug}` : null

            return (
              <div key={event._id || event.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {event.colorPalette && (
                      <span className="h-3.5 w-3.5 rounded-full border border-white shadow-sm shrink-0" style={{ backgroundColor: event.colorPalette }} />
                    )}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 capitalize">
                      {event.type || 'Event'}
                    </span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${event.accessLevel === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {event.accessLevel || 'private'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{event.title || 'Untitled'}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-1">
                  {event.description || 'No description.'}
                </p>

                {event.dressCode && (
                  <p className="mt-2 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded inline-block self-start">
                    👗 Dress Code: {event.dressCode}
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-400">{eventDate}</p>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                  {guestUrl && (
                    <a
                      href={guestUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 text-center transition"
                    >
                      Guest Page
                    </a>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id || event.id}`) }}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 text-center transition"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => {
                      if (guestUrl) {
                        navigator.clipboard.writeText(guestUrl).catch(() => {})
                        showToast('Link copied!')
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 text-center transition"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleDelete(event._id || event.id, event.title)}
                    disabled={deletingId === (event._id || event.id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deletingId === (event._id || event.id) ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default MyEventsAdmin
