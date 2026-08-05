import { useEffect, useState } from 'react'
import { api } from '../api.js'

function MessagesAdmin() {
  const [messages, setMessages] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadMessages = () => {
    setLoading(true)
    // Fetch all events first, then load messages for each
    api.get('/events', { params: { page: 1, limit: 50 } })
      .then((eventsRes) => {
        const events = eventsRes.data?.data || []
        if (events.length === 0) { setMessages([]); setFiltered([]); setLoading(false); return }
        // Load messages for all events in parallel
        return Promise.all(
          events.map((e) =>
            api.get(`/messages/event/${e._id || e.id}`, { params: { page: 1, limit: 50 } })
              .then((r) => r.data?.data || [])
              .catch(() => [])
          )
        )
      })
      .then((results) => {
        if (!results) return
        const all = results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setMessages(all)
        setFiltered(all)
      })
      .catch(() => { setMessages([]); setFiltered([]) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadMessages() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      q ? messages.filter((m) =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.message || '').toLowerCase().includes(q)
      ) : messages
    )
  }, [search, messages])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    setDeleting(id)
    try {
      await api.delete(`/messages/${id}`)
      showToast('Message deleted.')
      loadMessages()
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
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Messages</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">Guest Messages</h1>
        <p className="mt-0.5 text-sm text-slate-500">{messages.length} message{messages.length !== 1 ? 's' : ''} across all events</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by guest name or message..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 transition"
        />
      </div>

      {/* Messages */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16 text-slate-400 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 mb-3 text-slate-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <p className="text-sm">{search ? 'No messages match your search.' : 'No messages yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <article
              key={msg._id || msg.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-slate-200 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-blue-600">
                      {(msg.name || 'G').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{msg.name || 'Guest'}</p>
                    <p className="text-xs text-slate-400 truncate">{msg.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-xs text-slate-400">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                  <button
                    onClick={() => handleDelete(msg._id || msg.id)}
                    disabled={deleting === (msg._id || msg.id)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                  >
                    {deleting === (msg._id || msg.id) ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-12">
                "{msg.message || 'No message content.'}"
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MessagesAdmin
