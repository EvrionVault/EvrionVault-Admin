import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const DOC_TYPES = [
  { id: 'program',          label: 'Program Outline',     icon: '📋', desc: 'Schedule and order of events' },
  { id: 'tribute',          label: 'Tribute',             icon: '🙏', desc: 'A heartfelt message or dedication' },
  { id: 'lyrics',           label: 'Song Lyrics',         icon: '🎵', desc: 'Lyrics guests can follow along with' },
  { id: 'order_of_service', label: 'Order of Service',    icon: '📖', desc: 'Formal sequence of proceedings' },
  { id: 'menu',             label: 'Menu / Food List',    icon: '🍽️', desc: 'Food and drink offerings' },
  { id: 'host_message',     label: 'Message from Host',   icon: '💌', desc: 'A personal note to your guests' },
  { id: 'directions',       label: 'Travel & Directions', icon: '🗺️', desc: 'How to get there, parking info' },
  { id: 'other',            label: 'Custom Document',     icon: '📝', desc: 'Anything else for your guests' },
]

const PLACEHOLDER = {
  program:          '10:00 AM – Guests arrive\n10:30 AM – Ceremony begins\n11:30 AM – Reception opens...',
  tribute:          'Share your heartfelt words, memories, or dedication...',
  lyrics:           'Verse 1:\n...\n\nChorus:\n...',
  order_of_service: '1. Opening Prayer\n2. Processional\n3. Scripture Reading...',
  menu:             'Starters:\n- Garden Salad\n\nMains:\n- Grilled Chicken...',
  host_message:     'Dear guests, we are so grateful you have joined us...',
  directions:       'From the city center: Head north on Main Street...\nParking: Available at...',
  other:            'Write your content here...',
}

const singleModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  },
}

const emptyPage = () => ({ title: '', body: '' })

async function uploadMedia(file) {
  const folder = file.type.startsWith('video') ? 'content-videos' : 'content-images'
  const fd = new FormData()
  fd.append('file', file)
  const res = await api.post(`/upload?folder=${folder}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.url
}

function attachMediaHandler(quillRef, uploadRef) {
  const quill = quillRef.current?.getEditor?.()
  if (!quill) return
  const toolbar = quill.getModule('toolbar')
  if (!toolbar) return

  toolbar.addHandler('image', () => uploadRef.current?.click())

  toolbar.addHandler('video', () => {
    const url = window.prompt('Enter a video URL (YouTube, Vimeo, or direct MP4):')
    if (!url) return
    const range = quill.getSelection(true)
    quill.insertEmbed(range.index, 'video', url, 'user')
    quill.setSelection(range.index + 1)
  })
}

function RichEditor({ value, onChange, placeholder, editorId }) {
  const quillRef = useRef(null)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => attachMediaHandler(quillRef, fileInputRef), 300)
    return () => clearTimeout(t)
  }, [editorId])

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const url = await uploadMedia(file)
      const quill = quillRef.current?.getEditor?.()
      if (quill) {
        const range = quill.getSelection(true) || { index: quill.getLength() }
        if (file.type.startsWith('video')) {
          quill.insertEmbed(range.index, 'video', url, 'user')
        } else {
          quill.insertEmbed(range.index, 'image', url, 'user')
        }
        quill.setSelection(range.index + 1)
      }
    } catch {
      alert('Media upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [])

  return (
    <div className="relative">
      {uploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-600">
            <span className="h-4 w-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
            Uploading media…
          </div>
        </div>
      )}
      <div className="content-quill">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={singleModules}
          placeholder={placeholder}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/mp4,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

function CreateContentAdmin() {
  const navigate = useNavigate()
  const [step, setStep] = useState('pick') // 'pick' | 'edit' | 'done'

  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedStage, setSelectedStage] = useState('')

  const [selectedType, setSelectedType] = useState(null)
  const [docTitle, setDocTitle] = useState('')

  const [mode, setMode] = useState('single')
  const [docBody, setDocBody] = useState('')
  const [pages, setPages] = useState([emptyPage()])
  const [activePageIdx, setActivePageIdx] = useState(0)

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    api.get('/events', { params: { page: 1, limit: 50 } })
      .then(res => setEvents(res.data?.data || res.data || []))
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false))
  }, [])

  const handlePickType = (type) => {
    setSelectedType(type)
    setDocTitle(type.label)
    setDocBody('')
    setPages([emptyPage()])
    setActivePageIdx(0)
    setMode('single')
    setStep('edit')
  }

  const addPage = () => {
    setPages(prev => [...prev, emptyPage()])
    setActivePageIdx(pages.length)
  }

  const removePage = (idx) => {
    if (pages.length === 1) return
    setPages(prev => prev.filter((_, i) => i !== idx))
    setActivePageIdx(Math.max(0, idx - 1))
  }

  const updatePage = (idx, field, value) => {
    setPages(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  const handleSave = async () => {
    if (!docTitle.trim() || !selectedEvent) return
    setSaving(true)
    try {
      const newDoc = {
        type: selectedType.id,
        title: docTitle.trim(),
        isBooklet: mode === 'booklet',
        body: mode === 'single' ? docBody : '',
        pages: mode === 'booklet' ? pages : [],
        stageId: selectedStage || null,
      }
      const existingDocs = selectedEvent.documents || []
      await api.put(`/events/${selectedEvent._id || selectedEvent.id}`, {
        documents: [...existingDocs, newDoc],
      })
      setStep('done')
      showToast(`"${docTitle}" saved to ${selectedEvent.title}!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save document. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    setStep('pick')
    setSelectedType(null)
    setDocTitle('')
    setDocBody('')
    setPages([emptyPage()])
    setActivePageIdx(0)
    setMode('single')
    setSelectedEvent(null)
    setSelectedStage('')
  }

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-xl ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <style>{`
        .content-quill .ql-toolbar.ql-snow {
          border: 1px solid #cbd5e1 !important;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          background-color: #f8fafc;
          padding: 8px 12px;
          flex-wrap: wrap;
        }
        .content-quill .ql-container.ql-snow {
          border: 1px solid #cbd5e1 !important;
          border-top: none !important;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          background: #fff;
        }
        .content-quill .ql-editor {
          min-height: 220px;
          font-size: 0.9rem;
          line-height: 1.8;
        }
        .content-quill .ql-editor img { max-width: 100%; border-radius: 0.5rem; margin: 0.5rem 0; }
        .content-quill .ql-editor iframe { width: 100%; min-height: 240px; border-radius: 0.5rem; margin: 0.5rem 0; }
      `}</style>

      {/* Header */}
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          {step === 'edit' && (
            <button
              onClick={() => setStep('pick')}
              className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              ←
            </button>
          )}
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">Content Studio</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {step === 'pick' && 'What would you like to create?'}
              {step === 'edit' && `${selectedType?.icon} ${selectedType?.label}`}
              {step === 'done' && 'Content Saved! 🎉'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {step === 'pick' && 'Design a beautiful document or booklet and attach it to any event on the platform.'}
              {step === 'edit' && `Compose your ${selectedType?.label.toLowerCase()} — it will be shown to guests on the event page.`}
              {step === 'done' && 'Your content has been attached and is now visible to guests.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── PICK TYPE ── */}
      {step === 'pick' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {DOC_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handlePickType(type)}
              className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5 text-left shadow-sm transition hover:border-brand-400 hover:shadow-md hover:shadow-brand-100 group"
            >
              <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{type.icon}</span>
              <div>
                <p className="font-bold text-slate-900">{type.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{type.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── EDIT ── */}
      {step === 'edit' && (
        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Event + Stage selectors */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
                Attach to Event <span className="text-red-500">*</span>
                {eventsLoading ? (
                  <div className="mt-1 h-12 animate-pulse rounded-xl bg-slate-100" />
                ) : events.length === 0 ? (
                  <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                    No events.{' '}
                    <button onClick={() => navigate('/create-event')} className="text-brand-600 font-semibold hover:underline">Create one →</button>
                  </div>
                ) : (
                  <select
                    value={selectedEvent?._id || selectedEvent?.id || ''}
                    onChange={(e) => {
                      const ev = events.find(x => (x._id || x.id) === e.target.value) || null
                      setSelectedEvent(ev)
                      setSelectedStage('')
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                  >
                    <option value="">— Select an event —</option>
                    {events.map(ev => (
                      <option key={ev._id || ev.id} value={ev._id || ev.id}>{ev.title}</option>
                    ))}
                  </select>
                )}
              </label>

              {selectedEvent?.stages?.length > 0 && (
                <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
                  Attach to Stage
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                  >
                    <option value="">— Whole event —</option>
                    {selectedEvent.stages.map((s, i) => (
                      <option key={s._id || i} value={s._id || String(i)}>{s.name}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            {/* Title */}
            <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
              Document Title <span className="text-red-500">*</span>
              <input
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder={`e.g. ${selectedType?.label}`}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
              />
            </label>

            {/* Format toggle */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-700">Format</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('single')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${mode === 'single' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <span>📄</span>
                  <div className="text-left">
                    <p className="font-bold">Single Page</p>
                    <p className="text-xs font-normal opacity-70">One rich document</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('booklet')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${mode === 'booklet' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <span>📚</span>
                  <div className="text-left">
                    <p className="font-bold">Booklet</p>
                    <p className="text-xs font-normal opacity-70">Multiple pages / sections</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Single doc editor */}
            {mode === 'single' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">Content</p>
                  <p className="text-xs text-slate-400">Supports text, images & videos</p>
                </div>
                <RichEditor
                  key="single"
                  editorId="single"
                  value={docBody}
                  onChange={setDocBody}
                  placeholder={PLACEHOLDER[selectedType?.id] || 'Write your content here...'}
                />
              </div>
            )}

            {/* Booklet editor */}
            {mode === 'booklet' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {pages.map((p, i) => (
                    <div key={i} className="relative group">
                      <button
                        type="button"
                        onClick={() => setActivePageIdx(i)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activePageIdx === i ? 'bg-brand-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {p.title.trim() || `Page ${i + 1}`}
                      </button>
                      {pages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePage(i)}
                          className="absolute -top-1.5 -right-1.5 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold shadow"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPage}
                    className="rounded-xl border-2 border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-400 hover:border-brand-400 hover:text-brand-600 transition"
                  >
                    + Add Page
                  </button>
                </div>

                {pages[activePageIdx] !== undefined && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                    <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
                      Page Title
                      <input
                        value={pages[activePageIdx].title}
                        onChange={(e) => updatePage(activePageIdx, 'title', e.target.value)}
                        placeholder={`e.g. Page ${activePageIdx + 1} title`}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500"
                      />
                    </label>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700">Page Content</p>
                        <p className="text-xs text-slate-400">Supports text, images & videos</p>
                      </div>
                      <RichEditor
                        key={`page-${activePageIdx}`}
                        editorId={`page-${activePageIdx}`}
                        value={pages[activePageIdx].body}
                        onChange={(val) => updatePage(activePageIdx, 'body', val)}
                        placeholder={PLACEHOLDER[selectedType?.id] || 'Write this page here...'}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-400 text-center">
                  {pages.length} page{pages.length !== 1 ? 's' : ''} · Guests will be able to navigate between pages like a booklet
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('pick')}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              ← Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !docTitle.trim() || !selectedEvent}
              className="rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition"
            >
              {saving ? 'Saving…' : 'Save to Event'}
            </button>
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {step === 'done' && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 shadow-sm text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✅</div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Content Added!</h2>
            <p className="mt-2 text-slate-500">
              <strong>{docTitle}</strong> has been attached to <strong>{selectedEvent?.title}</strong> and is now visible to guests.
            </p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={reset}
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              ✨ Create Another
            </button>
            <button
              onClick={() => navigate('/my-events')}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              My Events
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default CreateContentAdmin
