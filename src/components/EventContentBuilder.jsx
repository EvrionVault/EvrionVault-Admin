import { useState } from 'react'

const DOC_TYPES = [
  { id: 'program',         label: 'Program Outline',   icon: '📋', desc: 'Schedule and order of events' },
  { id: 'tribute',         label: 'Tribute',           icon: '🙏', desc: 'A heartfelt message or dedication' },
  { id: 'lyrics',          label: 'Song Lyrics',       icon: '🎵', desc: 'Lyrics guests can follow along with' },
  { id: 'order_of_service',label: 'Order of Service',  icon: '📖', desc: 'Formal sequence of proceedings' },
  { id: 'menu',            label: 'Menu / Food List',  icon: '🍽️', desc: 'Food and drink offerings' },
  { id: 'host_message',    label: 'Message from Host', icon: '💌', desc: 'A personal note to your guests' },
  { id: 'directions',      label: 'Travel & Directions', icon: '🗺️', desc: 'How to get there, parking info' },
  { id: 'other',           label: 'Custom Document',   icon: '📝', desc: 'Anything else for your guests' },
]

export default function EventContentBuilder({ stages = [], onSave, onClose }) {
  const [selectedType, setSelectedType] = useState(null)
  const [docTitle, setDocTitle] = useState('')
  const [docBody, setDocBody] = useState('')
  const [attachedStage, setAttachedStage] = useState('')
  const [step, setStep] = useState('pick') // 'pick' | 'edit'

  const handlePickType = (type) => {
    setSelectedType(type)
    setDocTitle(type.label)
    setDocBody('')
    setAttachedStage('')
    setStep('edit')
  }

  const handleSave = () => {
    if (!docTitle.trim()) return
    // Convert newlines to HTML paragraphs/breaks for consistency with HTML description parsing
    const formattedBody = docBody
      .split('\n\n')
      .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('')

    onSave({
      type: selectedType.id,
      title: docTitle.trim(),
      body: formattedBody,
      stageId: attachedStage || null,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            {step === 'edit' && (
              <button
                type="button"
                onClick={() => setStep('pick')}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ←
              </button>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Content Builder</p>
              <h2 className="text-lg font-bold text-slate-900">
                {step === 'pick' ? 'What would you like to create?' : `${selectedType?.icon} ${selectedType?.label}`}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {step === 'pick' ? (
            <div className="p-6 grid gap-3 sm:grid-cols-2">
              {DOC_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handlePickType(type)}
                  className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 text-left transition hover:border-blue-400 hover:shadow-md hover:shadow-blue-100 group"
                >
                  <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{type.icon}</span>
                  <div>
                    <p className="font-bold text-slate-900">{type.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{type.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Title */}
              <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
                Document Title <span className="text-red-500">*</span>
                <input
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder={`e.g. ${selectedType?.label}`}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                />
              </label>

              {/* Attach to stage */}
              {stages.length > 0 && (
                <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
                  Attach to Stage
                  <select
                    value={attachedStage}
                    onChange={(e) => setAttachedStage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="">— Event level (all stages) —</option>
                    {stages.map((s, i) => (
                      <option key={i} value={s._id || String(i)}>{s.name}</option>
                    ))}
                  </select>
                </label>
              )}

              {/* Textarea body */}
              <label className="space-y-1.5 text-sm font-medium text-slate-700 block">
                Content
                <textarea
                  value={docBody}
                  onChange={(e) => setDocBody(e.target.value)}
                  placeholder={getPlaceholder(selectedType?.id)}
                  rows={8}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'edit' && (
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!docTitle.trim()}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Save Document
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function getPlaceholder(typeId) {
  const placeholders = {
    program: '10:00 AM – Guests arrive and are seated\n10:30 AM – Ceremony begins\n11:30 AM – Reception opens...',
    tribute: 'Share your heartfelt words, memories, or dedication...',
    lyrics: 'Verse 1:\n...\n\nChorus:\n...',
    order_of_service: '1. Opening Prayer\n2. Processional\n3. Scripture Reading...',
    menu: 'Starters:\n- Garden Salad\n- Soup of the Day\n\nMains:\n- Grilled Chicken...',
    host_message: 'Dear guests, we are so grateful you are here with us...',
    directions: 'From the city center: Head north on Main Street...\n\nParking: Available at...',
    other: 'Write your content here...',
  }
  return placeholders[typeId] || 'Write your content here...'
}
