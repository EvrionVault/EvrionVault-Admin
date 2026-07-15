import { useEffect, useState } from 'react'
import { api } from '../api.js'

function MessagesAdmin() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/messages/event/0', { params: { page: 1, limit: 12 } })
      .then((response) => setMessages(response.data?.data || response.data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Messages</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Guest notes and feedback</h1>
        <p className="mt-3 text-slate-600">Review message submissions posted to event walls and monitor guest sentiment.</p>
      </div>
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))
        ) : messages.length ? (
          messages.map((message) => (
            <article key={message._id || message.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-slate-200 transition">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-slate-800">{message.name || 'Guest'}</span>
                <span className="text-slate-400 text-xs">{message.email || 'No email'}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">"{message.message || 'No message content.'}"</p>
              <p className="mt-2 text-[10px] text-slate-400">{message.createdAt ? new Date(message.createdAt).toLocaleDateString() : ''}</p>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">No guest messages found.</div>
        )}
      </div>
    </section>
  )
}

export default MessagesAdmin
