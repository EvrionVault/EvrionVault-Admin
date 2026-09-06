import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import LuxuryPhonePreview from '../components/LuxuryPhonePreview.jsx'

const BLUE = '#3c6ef2'
const MAIN_APP_URL = import.meta.env.VITE_APP_URL || 'https://evrionvault.vercel.app'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatTime(d) {
  if (!d) return ''
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function EventDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [gallery, setGallery] = useState([])
  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview') // overview | gallery | messages
  const [toast, setToast] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/events/by-id/${id}`),
      api.get(`/gallery/event/${id}`, { params: { page: 1, limit: 50 } }),
      api.get(`/messages/event/${id}`, { params: { page: 1, limit: 50 } }),
      api.get(`/events/${id}/statistics`).catch(() => null),
    ])
      .then(([eventRes, galleryRes, msgRes, statsRes]) => {
        setEvent(eventRes.data?.event || eventRes.data)
        setGallery(galleryRes.data?.data || [])
        setMessages(msgRes.data?.data || [])
        setStats(statsRes?.data?.stats || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const deleteMedia = async (mediaId) => {
    try {
      await api.delete(`/gallery/${mediaId}`)
      setGallery((prev) => prev.filter((m) => m._id !== mediaId))
      showToast('Media deleted.')
    } catch {
      showToast('Failed to delete media.', 'error')
    }
  }

  const deleteMessage = async (msgId) => {
    try {
      await api.delete(`/messages/${msgId}`)
      setMessages((prev) => prev.filter((m) => m._id !== msgId))
      showToast('Message deleted.')
    } catch {
      showToast('Failed to delete message.', 'error')
    }
  }

  const deleteEvent = async () => {
    if (!window.confirm(`Delete "${event?.title}"? This removes all gallery and messages.`)) return
    try {
      await api.delete(`/events/${id}`)
      navigate('/events')
    } catch {
      showToast('Failed to delete event.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: BLUE, borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <p className="text-slate-500">Event not found.</p>
        <Link to="/events" className="mt-4 inline-block text-sm font-semibold" style={{ color: BLUE }}>← Back to Events</Link>
      </div>
    )
  }

  const guestUrl = event.slug ? `${MAIN_APP_URL}/events/${event.slug}` : null
  const coverImage = event.coverImage || null

  return (
    <section className="space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Back + header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="min-w-0">
          <Link to="/events" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← All Events</Link>
          <h1 className="mt-1 text-xl font-bold text-slate-900 truncate">{event.title}</h1>
          <div className="mt-1 flex flex-wrap gap-2 items-center">
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600 capitalize">{event.type}</span>
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${event.accessLevel === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{event.accessLevel}</span>
            <span className="text-xs text-slate-400">{formatDate(event.date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link
            to={`/create-event?edit=${event._id}`}
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition flex items-center gap-1.5"
          >
            <span>✏️</span> Edit Event Design
          </Link>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition flex items-center gap-1.5"
          >
            <span>✉️</span> Preview 3D Intro
          </button>
          {guestUrl && (
            <a href={guestUrl} target="_blank" rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
              View Guest Page ↗
            </a>
          )}
          <button type="button" onClick={deleteEvent}
            className="rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition">
            Delete Event
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full flex flex-col items-center">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 rounded-full h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-200"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Interactive 3D Invitation Preview</h3>
            <LuxuryPhonePreview form={event} />
          </div>
        </div>
      )}

      {/* Cover image */}
      {coverImage && (
        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-56">
          <img src={coverImage} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Views', value: stats.viewCount ?? '—', color: BLUE },
            { label: 'Media Uploads', value: stats.mediaCount ?? gallery.length, color: '#059669' },
            { label: 'Messages', value: stats.messageCount ?? messages.length, color: '#0891b2' },
            { label: 'Unique Guests', value: stats.uniqueGuestCount ?? '—', color: '#7c3aed' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-400">{s.label}</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['overview', 'gallery', 'messages'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t} {t === 'gallery' ? `(${gallery.length})` : t === 'messages' ? `(${messages.length})` : ''}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Description */}
          {event.description && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Invitation message */}
          {event.invitationMessage && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Invitation Message</h3>
              <p className="text-sm text-slate-600 italic">"{event.invitationMessage}"</p>
            </div>
          )}

          {/* Stages */}
          {event.stages && event.stages.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Event Stages ({event.stages.length})</h3>
              <div className="relative ml-4 border-l-2 border-slate-100 pl-6 space-y-5">
                {event.stages.map((stage, idx) => (
                  <div key={stage._id || idx} className="relative">
                    <span className="absolute -left-8 top-1.5 h-3 w-3 rounded-full ring-4 ring-white" style={{ backgroundColor: BLUE }} />
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-bold text-slate-900">{stage.name}</p>
                        {(stage.startTime || stage.endTime) && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                            {formatTime(stage.startTime)}{stage.endTime ? ` – ${formatTime(stage.endTime)}` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">📍 {stage.location}</p>
                      {stage.coverImage && (
                        <img src={stage.coverImage} alt={stage.name} className="mt-3 w-full h-32 object-cover rounded-lg" />
                      )}
                      {stage.programText && (
                        <p className="mt-2 text-xs text-slate-600">{stage.programText}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Event Settings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                { label: 'Guest Uploads', value: event.allowGuestUploads ? '✅ Allowed' : '❌ Disabled' },
                { label: 'Guest Messages', value: event.allowGuestMessages ? '✅ Allowed' : '❌ Disabled' },
                { label: 'Published', value: event.isPublished ? '✅ Yes' : '❌ No' },
                { label: 'Views', value: event.viewCount ?? 0 },
                { label: 'Created', value: formatDate(event.createdAt) },
                { label: 'Owner', value: event.owner?.name || event.owner?.email || 'Unknown' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Gallery Tab ── */}
      {tab === 'gallery' && (
        <div className="space-y-4">
          {gallery.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400 shadow-sm">
              <p>No media uploaded for this event yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((media) => (
                <div key={media._id} className="group relative rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shadow-sm">
                  {media.fileType === 'video' ? (
                    <video src={media.fileUrl} className="w-full aspect-square object-cover" />
                  ) : media.fileType === 'image' ? (
                    <img src={media.fileUrl} alt={media.caption} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-slate-100">
                      <span className="text-3xl">📄</span>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium text-slate-700 truncate">{media.uploaderName || 'Guest'}</p>
                    {media.caption && <p className="text-xs text-slate-400 truncate">{media.caption}</p>}
                  </div>
                  <button
                    onClick={() => deleteMedia(media._id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Messages Tab ── */}
      {tab === 'messages' && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400 shadow-sm">
              No messages for this event yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: BLUE }}>
                    {(msg.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{msg.name || 'Guest'}</p>
                      <p className="text-xs text-slate-400">{formatDate(msg.createdAt)}</p>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{msg.email || ''}</p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">"{msg.message}"</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-100 hover:text-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}
