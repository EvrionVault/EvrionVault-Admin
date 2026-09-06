import React, { useState } from 'react'
import DynamicTemplateRenderer from './DynamicTemplateRenderer.jsx'

export default function LuxuryPhonePreview({ form = {} }) {
  const [viewMode, setViewMode] = useState('intro') // 'intro' | 'layout'

  const {
    title = 'David & Anna Wedding',
    type = 'wedding',
    template = 'classic',
    entranceStyle = 'envelope',
    colorPalette = '#6366f1',
    accentColor = '',
    location = 'Grand Palace Hall, New York',
    date = new Date().toISOString().split('T')[0],
    invitationMessage = "We can't wait to celebrate our special day with you!",
    dressCode = 'Black Tie Luxury Attire',
  } = form

  const [resetKey, setResetKey] = useState(0)
  const effectiveAccent = accentColor || colorPalette || '#6366f1'

  const resetIntro = () => {
    setViewMode('intro')
    setResetKey(prev => prev + 1)
  }

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Toggle Bar */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full text-xs font-bold shadow-inner">
        <button
          type="button"
          onClick={resetIntro}
          className={`px-4 py-1.5 rounded-full transition ${
            viewMode === 'intro' ? 'bg-slate-900 text-amber-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ✉️ Intro Preview
        </button>
        <button
          type="button"
          onClick={() => setViewMode('layout')}
          className={`px-4 py-1.5 rounded-full transition ${
            viewMode === 'layout' ? 'bg-slate-900 text-amber-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📱 Page Layout
        </button>
      </div>

      {/* ── Responsive Smartphone Frame ── */}
      <div
        className="relative w-full bg-slate-950 rounded-[44px] shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800 overflow-hidden select-none"
        style={{ maxWidth: 360, aspectRatio: '9 / 19.5' }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-end px-2.5">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Screen */}
        <div className="absolute inset-2 bg-[#fdfbf7] rounded-[36px] overflow-hidden">
          <div className="w-full h-full overflow-y-auto overflow-x-hidden pt-6">
            <DynamicTemplateRenderer
              key={`${form.entranceStyle}-${form.waxSealColor}-${resetKey}`}
              event={form}
              isPhonePreview={true}
              isPreview={viewMode === 'layout'}
            >
              <div
                className={`min-h-full transition-all duration-500 ${
                  template === 'elegant'
                    ? 'bg-slate-900 text-slate-100'
                    : template === 'botanical'
                    ? 'bg-[#f4f7f4] text-slate-900'
                    : 'bg-[#fdfbf7] text-slate-900 font-serif'
                }`}
              >
                {/* Hero Cover */}
                <div className="relative h-44 bg-slate-800 overflow-hidden">
                  <img
                    src={form.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest mb-1 text-white"
                      style={{ backgroundColor: effectiveAccent }}
                    >
                      {type}
                    </span>
                    <h1 className="text-base font-bold font-serif leading-tight">{title}</h1>
                    <p className="text-[10px] text-slate-300 mt-0.5">📅 {date}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  {invitationMessage && (
                    <div className="rounded-xl p-3 bg-white/80 border border-slate-200 shadow-sm text-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: effectiveAccent }}>
                        Host Welcome
                      </span>
                      <p className="text-[10px] italic text-slate-700">"{invitationMessage}"</p>
                    </div>
                  )}

                  <div className="rounded-xl p-3 bg-white/80 border border-slate-200 shadow-sm space-y-1.5 text-[10px]">
                    <p className="font-bold text-slate-900">📍 <span className="font-normal text-slate-600">{location}</span></p>
                    {dressCode && (
                      <p className="font-bold text-slate-900">👗 <span className="font-normal text-slate-600">{dressCode}</span></p>
                    )}
                  </div>

                  <div className="rounded-xl p-3 bg-white/80 border border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-[9px] font-bold text-slate-900 uppercase tracking-wider">Schedule</h3>
                    <div className="space-y-1.5 text-[10px]">
                      {[['Arrival & Welcome', '4:00 PM'], ['Grand Ceremony', '5:30 PM'], ['Dinner & Toast', '7:00 PM']].map(([ev, time]) => (
                        <div key={ev} className="flex justify-between border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                          <span className="font-semibold text-slate-800">{ev}</span>
                          <span className="text-slate-500">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-3 bg-white/80 border border-slate-200 shadow-sm text-center">
                    <span className="text-[8px] font-bold uppercase tracking-widest block mb-1 text-slate-500">Guestbook</span>
                    <p className="text-[10px] font-semibold text-slate-800">Leave wishes & upload photos</p>
                    <button
                      type="button"
                      className="mt-2 w-full rounded-lg py-1.5 text-[10px] font-bold text-white shadow-md transition"
                      style={{ backgroundColor: effectiveAccent }}
                    >
                      RSVP & Leave Message
                    </button>
                  </div>
                </div>
              </div>
            </DynamicTemplateRenderer>
          </div>
        </div>
      </div>

      {/* Tap hint */}
      {viewMode === 'intro' && (
        <p className="text-[10px] text-slate-400 font-sans text-center animate-pulse">
          Tap the intro screen to interact with the animation
        </p>
      )}
    </div>
  )
}
