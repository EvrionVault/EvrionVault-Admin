import { useEffect, useState } from 'react'
import { api } from '../api.js'

function EventsAdmin() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/events', { params: { page: 1, limit: 12 } })
      .then((response) => setEvents(response.data?.data || response.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Events</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Manage event content</h1>
        <p className="mt-3 text-slate-600">View, audit, and prepare events using your backend event dataset.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          <span>Title</span>
          <span>Type</span>
          <span>Date</span>
        </div>
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : events.length ? (
          events.map((event) => (
            <div key={event._id || event.id} className="grid grid-cols-3 gap-4 border-b border-slate-100 p-4 text-sm text-slate-700 last:border-b-0 hover:bg-slate-50">
              <span className="font-medium">{event.title || 'Untitled'}</span>
              <span className="text-slate-500">{event.type || 'General'}</span>
              <span className="text-slate-500">{event.date ? new Date(event.date).toLocaleDateString() : 'Unscheduled'}</span>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">No events found.</div>
        )}
      </div>
    </section>
  )
}

export default EventsAdmin
