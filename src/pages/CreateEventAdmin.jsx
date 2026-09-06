import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import ImageUpload from '../components/ImageUpload.jsx'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import LuxuryPhonePreview from '../components/LuxuryPhonePreview.jsx'
import EntranceGroupModal from '../components/EntranceGroupModal.jsx'

const COLOR_PALETTES = [
  { hex: '#3c6ef2', name: 'Blue' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#f43f5e', name: 'Rose' },
  { hex: '#f97316', name: 'Orange' },
  { hex: '#eab308', name: 'Gold' },
  { hex: '#22c55e', name: 'Emerald' },
  { hex: '#0ea5e9', name: 'Sky' },
  { hex: '#0f172a', name: 'Midnight' },
  { hex: '#78716c', name: 'Stone' },
]

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'funeral', label: 'Funeral / Memorial' },
  { value: 'baptism', label: 'Baptism' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'other', label: 'Other' },
]

const MAIN_APP_URL = import.meta.env.VITE_APP_URL || 'https://evrionvault.vercel.app'

function CreateEventAdmin() {
  const navigate = useNavigate()

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [createdEvent, setCreatedEvent] = useState(null)
  const [copied, setCopied] = useState(false)
  const [activeGroupModal, setActiveGroupModal] = useState(null)

  const [form, setForm] = useState({
    title: '',
    type: 'wedding',
    template: 'modern',
    entranceStyle: 'envelope',
    colorPalette: '#3c6ef2',
    accentColor: '#3c6ef2',
    monogram: '',
    musicTrack: 'piano',
    waxSealColor: 'gold',
    location: '',
    dressCode: '',
    description: '',
    links: [{ title: '', url: '' }],
    documents: [],
    date: '',
    endDate: '',
    isMultiDay: false,
    invitationMessage: '',
    accessLevel: 'private',
    coverImage: '',
    stages: [],
  })

  const [stageForm, setStageForm] = useState({
    name: '',
    location: '',
    dressCode: '',
    startTime: '',
    endTime: '',
    programText: '',
    coverImage: '',
    links: [{ title: '', url: '' }],
  })

  const addMainLink = () => {
    setForm((prev) => ({ ...prev, links: [...prev.links, { title: '', url: '' }] }))
  }

  const updateMainLink = (idx, field, value) => {
    const newLinks = [...form.links]
    newLinks[idx][field] = value
    setForm((prev) => ({ ...prev, links: newLinks }))
  }

  const removeMainLink = (idx) => {
    setForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }))
  }

  const addStageLink = () => {
    setStageForm((prev) => ({ ...prev, links: [...prev.links, { title: '', url: '' }] }))
  }

  const updateStageLink = (idx, field, value) => {
    const newLinks = [...stageForm.links]
    newLinks[idx][field] = value
    setStageForm((prev) => ({ ...prev, links: newLinks }))
  }

  const removeStageLink = (idx) => {
    setStageForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }))
  }

  const addStage = () => {
    if (!stageForm.name || !stageForm.location) return
    setForm((prev) => ({
      ...prev,
      stages: [...prev.stages, { ...stageForm }],
    }))
    setStageForm({
      name: '',
      location: '',
      dressCode: '',
      startTime: '',
      endTime: '',
      programText: '',
      coverImage: '',
      links: [{ title: '', url: '' }],
    })
  }

  const removeStage = (idx) => {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== idx),
    }))
  }

  const [errorMsg, setErrorMsg] = useState('')

  const searchParams = new URLSearchParams(window.location.search)
  const editId = searchParams.get('edit')

  useEffect(() => {
    if (!editId) return
    setLoading(true)
    api.get(`/events/by-id/${editId}`)
      .then((res) => {
        const ev = res.data?.event || res.data
        if (ev) {
          setForm({
            title: ev.title || '',
            type: ev.type || 'wedding',
            template: ev.template || 'modern',
            entranceStyle: ev.entranceStyle || 'scratch-card',
            colorPalette: ev.colorPalette || '#6366f1',
            monogram: ev.monogram || '',
            musicTrack: ev.musicTrack || 'piano',
            waxSealColor: ev.waxSealColor || 'gold',
            location: ev.location || '',
            dressCode: ev.dressCode || '',
            description: ev.description || '',
            links: ev.links?.length > 0 ? ev.links : [{ title: '', url: '' }],
            documents: ev.documents || [],
            date: ev.date ? new Date(ev.date).toISOString().split('T')[0] : '',
            endDate: ev.endDate ? new Date(ev.endDate).toISOString().split('T')[0] : '',
            isMultiDay: Boolean(ev.isMultiDay),
            invitationMessage: ev.invitationMessage || '',
            accessLevel: ev.accessLevel || 'private',
            coverImage: ev.coverImage || '',
            stages: ev.stages || [],
          })
        }
      })
      .catch((err) => {
        console.error('Error fetching event for edit:', err)
      })
      .finally(() => setLoading(false))
  }, [editId])

  const handleSubmit = async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      const payload = {
        ...form,
        date: new Date(form.date).toISOString(),
        coverImage: form.coverImage || undefined,
        links: form.links ? form.links.filter(l => l.title?.trim() && l.url?.trim()) : [],
        isMultiDay: Boolean(form.isMultiDay),
        endDate: form.isMultiDay && form.endDate ? new Date(form.endDate).toISOString() : undefined,
        stages: form.stages.map((s) => ({
          ...s,
          coverImage: s.coverImage || undefined,
          startTime: s.startTime ? new Date(s.startTime).toISOString() : undefined,
          endTime: s.endTime ? new Date(s.endTime).toISOString() : undefined,
          links: s.links ? s.links.filter(l => l.title?.trim() && l.url?.trim()) : []
        })),
      }

      const response = editId
        ? await api.put(`/events/${editId}`, payload)
        : await api.post('/events', payload)

      const eventData = response.data?.event || response.data
      setCreatedEvent(eventData)
      setStep(4) // Show share screen
    } catch (err) {
      console.error('Error saving event:', err)
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to save event. Please check your inputs.'
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  const shareUrl = createdEvent?.slug
    ? `${MAIN_APP_URL}/events/${createdEvent.slug}`
    : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <section className="space-y-8 max-w-4xl mx-auto">
      <style>{`
        .admin-quill .ql-toolbar.ql-snow {
          border: 1px solid #cbd5e1 !important;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          background-color: #f8fafc;
          padding: 8px 12px;
        }
        .admin-quill .ql-container.ql-snow {
          border: 1px solid #cbd5e1 !important;
          border-top: none !important;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          background-color: #ffffff;
          font-family: inherit;
        }
        .admin-quill .ql-editor {
          min-height: 120px;
          font-size: 0.875rem;
        }
        .admin-quill .ql-editor.ql-blank::before {
          font-style: normal;
          color: #94a3b8;
        }
      `}</style>

      {/* Header Banner */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">
          {step === 4 ? 'Event Created' : 'New Event'}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          {step === 1
            ? 'Tell us about the event'
            : step === 2
            ? 'Add event stages (optional)'
            : step === 3
            ? 'Choose a Design Template'
            : 'Event is created! 🎉'}
        </h1>
        <p className="mt-3 text-slate-600 text-sm">
          {step === 1
            ? 'Fill in the basic event information to get started.'
            : step === 2
            ? 'Add schedule stages so guests know what to expect.'
            : step === 3
            ? 'Select a visual style and color scheme for the event page.'
            : 'Share the link below so guests can view, upload media, and leave messages.'}
        </p>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Event Title *
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="The Johnson Wedding"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Event Type *
                <select
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
              Event Date *
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
              />
            </label>

            {/* Multi-day toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isMultiDay}
                onChange={(e) => setForm({ ...form, isMultiDay: e.target.checked, endDate: e.target.checked ? form.date : '' })}
                className="h-5 w-5 rounded-lg border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-slate-700">This is a multi-day event</span>
            </label>

            {form.isMultiDay && (
              <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
                End Date *
                <input
                  type="date"
                  required
                  value={form.endDate}
                  min={form.date}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                />
              </label>
            )}

            <div className="space-y-1.5 text-sm font-medium text-slate-700 block">
              <span>Description</span>
              <div className="mt-1 admin-quill">
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(val) => setForm({ ...form, description: val })}
                  modules={quillModules}
                  placeholder="Tell guests what this celebration is about..."
                />
              </div>
            </div>

            {/* Main Links */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">External Links</label>
                <button
                  type="button"
                  onClick={addMainLink}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  + Add Link
                </button>
              </div>
              {form.links.length > 0 && (
                <div className="space-y-2">
                  {form.links.map((link, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={link.title}
                        onChange={(e) => updateMainLink(idx, 'title', e.target.value)}
                        placeholder="Link Title (e.g. Tribute)"
                        className="w-1/3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-brand-500"
                      />
                      <input
                        value={link.url}
                        onChange={(e) => updateMainLink(idx, 'url', e.target.value)}
                        placeholder="URL (https://...)"
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeMainLink(idx)}
                        className="rounded-xl px-3 py-2 text-red-500 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Invitation Message
                <textarea
                  rows="2"
                  value={form.invitationMessage}
                  onChange={(e) => setForm({ ...form, invitationMessage: e.target.value })}
                  placeholder="You're invited to celebrate with us!"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Dress Code
                <input
                  value={form.dressCode}
                  onChange={(e) => setForm({ ...form, dressCode: e.target.value })}
                  placeholder="e.g. Black tie, Smart casual..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Access Level
                <select
                  value={form.accessLevel}
                  onChange={(e) => setForm({ ...form, accessLevel: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                >
                  <option value="public">Public — Anyone can view</option>
                  <option value="private">Private — Only invited guests</option>
                </select>
              </label>

              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Location / Venue
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. 123 Celebration Ave, City"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500"
                />
              </label>
            </div>

            <ImageUpload
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
              folder="events"
              label="Event Cover Image / Video"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Next: Add Stages →
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Stages (optional) */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Event Stages / Schedule</h2>
            <p className="text-sm text-slate-500">Add timeline stages — ceremony, reception, after-party, etc.</p>

            {/* Stage form */}
            <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                Stage Name *
                <input
                  value={stageForm.name}
                  onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })}
                  placeholder="Ceremony"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                Location *
                <input
                  value={stageForm.location}
                  onChange={(e) => setStageForm({ ...stageForm, location: e.target.value })}
                  placeholder="123 Main St, City"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                Start Time
                <input
                  type="datetime-local"
                  value={stageForm.startTime}
                  onChange={(e) => setStageForm({ ...stageForm, startTime: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                End Time
                <input
                  type="datetime-local"
                  value={stageForm.endTime}
                  onChange={(e) => setStageForm({ ...stageForm, endTime: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </label>
              <label className="sm:col-span-2 space-y-1 text-xs font-semibold text-slate-500">
                Program Notes
                <textarea
                  rows="2"
                  value={stageForm.programText}
                  onChange={(e) => setStageForm({ ...stageForm, programText: e.target.value })}
                  placeholder="Details about this stage..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                Dress Code
                <input
                  value={stageForm.dressCode}
                  onChange={(e) => setStageForm({ ...stageForm, dressCode: e.target.value })}
                  placeholder="e.g. White attire"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </label>
              <div className="sm:col-span-2">
                <ImageUpload
                  value={stageForm.coverImage}
                  onChange={(url) => setStageForm({ ...stageForm, coverImage: url })}
                  folder="stages"
                  label="Stage Cover Image / Video"
                  className="text-xs"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500">Stage Links (e.g. Program, Songs)</label>
                  <button
                    type="button"
                    onClick={addStageLink}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    + Add Link
                  </button>
                </div>
                {stageForm.links.length > 0 && (
                  <div className="space-y-2">
                    {stageForm.links.map((link, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={link.title}
                          onChange={(e) => updateStageLink(idx, 'title', e.target.value)}
                          placeholder="Title (e.g. Song Lyrics)"
                          className="w-1/3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                        <input
                          value={link.url}
                          onChange={(e) => updateStageLink(idx, 'url', e.target.value)}
                          placeholder="URL"
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeStageLink(idx)}
                          className="rounded-xl px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={addStage}
                  disabled={!stageForm.name || !stageForm.location}
                  className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  + Add Stage
                </button>
              </div>
            </div>

            {/* Stage list */}
            {form.stages.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Added Stages ({form.stages.length})</h3>
                {form.stages.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">📍 {s.location}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStage(idx)}
                      className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              ← Back
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!form.title || !form.date}
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                Next: Choose Template →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Choose Template & Intros */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls Panel */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Template Selection */}
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">1. Select a Layout Theme</h2>
                <p className="text-sm text-slate-500">Pick a visual luxury style for the event page.</p>

                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                  {[
                    { id: 'custom-photo', label: '📸 Custom Image Studio', desc: 'Upload photo + pick any animation' },
                    { id: 'classic', label: '👑 Royal Ivory & Gold', desc: 'Serif elegance, gold foil' },
                    { id: 'flight-pass', label: '✈️ Destination Flight', desc: 'Jetsetter runway invitation' },
                    { id: 'elegant', label: '🌙 Midnight Velvet', desc: 'Deep dark gold foil' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, template: t.id })}
                      className={`relative rounded-2xl border-2 p-4 text-left transition ${
                        form.template === t.id ? 'border-brand-500 bg-brand-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-brand-300'
                      }`}
                    >
                      <h3 className="font-bold text-xs text-slate-900">{t.label}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
                      {form.template === t.id && (
                        <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-brand-500 flex items-center justify-center text-white text-[10px]">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entrance Style Selection */}
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">2. Entrance Animation & Accent Color</h2>
                    <p className="text-sm text-slate-500">Tap a group below to choose sub-styles, animation, and single accent color tint.</p>
                  </div>
                </div>

                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {[
                    { key: 'curtains', label: 'Curtains 🎭', icon: '🎭', desc: 'Center Open, Swag, Fan, Ripple' },
                    { key: 'hearts', label: 'Hearts ❤️', icon: '❤️', desc: 'Beat, Burst, Floating, Swirl' },
                    { key: 'envelope', label: 'Envelopes ✉️', icon: '✉️', desc: 'Open, Fly-In, Letter Reveal' },
                    { key: 'castles', label: 'Castles 🏰', icon: '🏰', desc: 'Gate Open, Drawbridge, Build' },
                    { key: 'scratch', label: 'Scratch Cards 🎟️', icon: '🎟️', desc: 'Mystery, Prize, Photo, Match' },
                    { key: 'bow', label: 'Bow Knots 🎀', icon: '🎀', desc: 'Untie, Pull Ribbon, Gift Bow' },
                    { key: 'balloons', label: 'Balloons 🎈', icon: '🎈', desc: 'Float, Pop, Release' },
                    { key: 'confetti', label: 'Confetti 🎊', icon: '🎊', desc: 'Burst, Fall, Cannon' },
                    { key: 'fireworks', label: 'Fireworks 🎆', icon: '🎆', desc: 'Single, Double, Finale' },
                    { key: 'stars', label: 'Stars ⭐', icon: '⭐', desc: 'Twinkle, Burst, Shooting' },
                    { key: 'sparkles', label: 'Sparkles ✨', icon: '✨', desc: 'Glow, Shimmer, Sweep' },
                    { key: 'flowers', label: 'Flowers 🌸', icon: '🌸', desc: 'Bloom, Petal Fall, Scatter' },
                    { key: 'gifts', label: 'Gifts 🎁', icon: '🎁', desc: 'Open, Unwrap, Pop' },
                    { key: 'cakes', label: 'Cakes 🎂', icon: '🎂', desc: 'Cut, Candle Blow, Reveal' },
                    { key: 'graduation', label: 'Graduation 🎓', icon: '🎓', desc: 'Cap Toss, Diploma Reveal' },
                    { key: 'celebration', label: 'Celebration 🥂', icon: '🥂', desc: 'Cheers, Glass Clink, Toast' },
                    { key: 'custom-photo', label: 'Custom Photo 📸', icon: '📸', desc: 'Personal Photo Unveil' },
                  ].map((group) => {
                    const isGroupActive =
                      (group.key === 'custom-photo' && form.entranceStyle === 'custom-photo') ||
                      (group.key === 'curtains' && form.entranceStyle?.startsWith('curtains')) ||
                      (group.key === 'hearts' && form.entranceStyle?.startsWith('heart')) ||
                      (group.key === 'envelope' && form.entranceStyle?.startsWith('envelope')) ||
                      (group.key === 'castles' && (form.entranceStyle?.startsWith('castle') || form.entranceStyle?.startsWith('chandelier') || form.entranceStyle?.startsWith('arch'))) ||
                      (group.key === 'scratch' && form.entranceStyle?.startsWith('scratch')) ||
                      (group.key === 'bow' && form.entranceStyle?.startsWith('bow')) ||
                      (group.key === 'balloons' && form.entranceStyle?.startsWith('balloon')) ||
                      (group.key === 'confetti' && form.entranceStyle?.startsWith('confetti')) ||
                      (group.key === 'fireworks' && form.entranceStyle?.startsWith('fireworks')) ||
                      (group.key === 'stars' && form.entranceStyle?.startsWith('stars')) ||
                      (group.key === 'sparkles' && form.entranceStyle?.startsWith('sparkles')) ||
                      (group.key === 'flowers' && form.entranceStyle?.startsWith('flowers')) ||
                      (group.key === 'gifts' && form.entranceStyle?.startsWith('gift')) ||
                      (group.key === 'cakes' && form.entranceStyle?.startsWith('cake')) ||
                      (group.key === 'graduation' && form.entranceStyle?.startsWith('grad')) ||
                      (group.key === 'celebration' && (form.entranceStyle?.startsWith('cheers') || form.entranceStyle?.startsWith('celebration')))

                    const accentColor = form.colorPalette || '#3c6ef2'

                    return (
                      <button
                        key={group.key}
                        type="button"
                        onClick={() => {
                          const defaultStyleMap = {
                            'custom-photo': 'custom-photo',
                            curtains: 'curtains',
                            hearts: 'heart-beat',
                            envelope: 'envelope-open',
                            castles: 'castle-gate',
                            scratch: 'scratch-mystery',
                            bow: 'bow-untie',
                            balloons: 'balloon-float',
                            confetti: 'confetti-burst',
                            fireworks: 'fireworks-single',
                            stars: 'stars-twinkle',
                            sparkles: 'sparkles-glow',
                            flowers: 'flowers-bloom',
                            gifts: 'gift-open',
                            cakes: 'cake-cut',
                            graduation: 'grad-captoss',
                            celebration: 'cheers-toast',
                          }
                          const defaultStyle = defaultStyleMap[group.key] || 'curtains'
                          setForm((prev) => ({ ...prev, entranceStyle: defaultStyle }))
                          setActiveGroupModal(group.key)
                        }}
                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-5 text-center transition group ${
                          isGroupActive
                            ? 'shadow-md border-transparent'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                        style={
                          isGroupActive
                            ? {
                                borderColor: accentColor,
                                backgroundColor: `${accentColor}12`,
                                boxShadow: `0 4px 14px ${accentColor}25`,
                              }
                            : {}
                        }
                      >
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{group.icon}</span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{group.label}</span>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-tight">{group.desc}</p>
                        {isGroupActive && (
                          <div
                            className="absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm"
                            style={{ backgroundColor: accentColor }}
                          >
                            ✓
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Section 2 Intro Animation Background Color Tint Selector */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎨</span> Intro Animation Color Tint
                    </h3>
                    <p className="text-[11px] text-slate-500">Pick the background tint & visual atmosphere for your selected entrance animation.</p>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 shrink-0">
                    <input
                      type="color"
                      value={form.colorPalette || '#3c6ef2'}
                      onChange={(e) => setForm({ ...form, colorPalette: e.target.value })}
                      className="h-7 w-9 cursor-pointer rounded-md border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={form.colorPalette || '#3c6ef2'}
                      onChange={(e) => setForm({ ...form, colorPalette: e.target.value })}
                      className="w-20 text-xs font-mono font-semibold text-slate-700 bg-transparent outline-none uppercase"
                      placeholder="#3C6EF2"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 Buttons, Seals, Wax Accent Tint & Music Selection */}
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">3. Buttons, Seals, Wax & Audio</h2>
                <p className="text-sm text-slate-500">Customize the accent color for action buttons, monogram emblems, wax seals, and background music.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs font-semibold text-slate-700 space-y-1 block">
                    Buttons, Seals & Wax Accent Tint
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 mt-1">
                      <input
                        type="color"
                        value={form.accentColor || '#3c6ef2'}
                        onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                        className="h-7 w-9 cursor-pointer rounded-md border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={form.accentColor || '#3c6ef2'}
                        onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                        className="w-24 text-xs font-mono font-semibold text-slate-700 bg-transparent outline-none uppercase"
                        placeholder="#3C6EF2"
                      />
                    </div>
                  </label>

                  <label className="text-xs font-semibold text-slate-700 space-y-1 block">
                    Background Music Track
                    <select
                      value={form.musicTrack}
                      onChange={(e) => setForm({ ...form, musicTrack: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none mt-1"
                    >
                      <option value="piano">🎹 Royal Piano Prelude</option>
                      <option value="acoustic">🎸 Romantic Acoustic Guitar</option>
                      <option value="strings">🎻 Garden String Quartet</option>
                      <option value="">🚫 None</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Live Phone Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Live Interactive Device Preview</h3>
              <LuxuryPhonePreview form={form} />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
            {errorMsg && (
              <p className="text-sm font-semibold text-red-500 max-w-sm">{errorMsg}</p>
            )}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? 'Creating Event...' : 'Create & Publish Event ✨'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Share & Preview Event */}
      {step === 4 && createdEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-8 w-8 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">{createdEvent.title} Created!</h2>
              <p className="mt-2 text-slate-600 text-sm">The event page is live. Share the link so guests can participate.</p>
            </div>

            {/* Share Card */}
            <div className="rounded-[1.75rem] border-2 border-brand-200 bg-brand-50/70 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-brand-700 uppercase tracking-wider">Share Link</h3>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-slate-900 font-medium outline-none"
                />
                <button
                  onClick={copyLink}
                  className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700 whitespace-nowrap transition"
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: createdEvent.title, url: shareUrl })
                    } else {
                      copyLink()
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span>📱</span> Share via...
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join us at ${createdEvent.title}! ${shareUrl}`)}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                >
                  <span>💬</span> WhatsApp
                </button>
              </div>
            </div>

            {/* QR Access Card */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Quick Access</h3>
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-800 border-4 border-white shadow-lg">
                <span className="text-5xl">⬛</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">Guests can scan to open the event page</p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(`/events/${createdEvent._id || createdEvent.id}`)}
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition"
              >
                Manage Event
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Mobile Preview Frame */}
          <div className="hidden lg:flex lg:col-span-2 justify-center sticky top-8">
            <div className="relative w-[320px] h-[650px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-900 shadow-2xl overflow-hidden ring-1 ring-slate-800">
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-3xl w-32 mx-auto z-50" />
              {/* iFrame Content */}
              <iframe
                src={`${shareUrl}?preview=true`}
                className="w-full h-full bg-slate-50"
                title="Event Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Entrance Animation Customizer Modal */}
      <EntranceGroupModal
        isOpen={Boolean(activeGroupModal)}
        groupKey={activeGroupModal || 'curtains'}
        form={form}
        onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
        onClose={() => setActiveGroupModal(null)}
      />
    </section>
  )
}

export default CreateEventAdmin

