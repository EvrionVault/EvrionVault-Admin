import React, { useState, useEffect, useRef } from 'react'

const AUDIO_TRACK_PRESETS = {
  piano: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73229.mp3',
  acoustic: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  strings: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c89b7b93db.mp3',
}

export default function FloatingAudioPlayer({
  trackUrl = '',
  autoPlay = false,
  isMobilePreview = false,
}) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  const resolvedTrack = AUDIO_TRACK_PRESETS[trackUrl] || trackUrl || AUDIO_TRACK_PRESETS.piano

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.src = resolvedTrack
    if (autoPlay) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }, [resolvedTrack, autoPlay])

  const togglePlay = (e) => {
    e?.stopPropagation()
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <div
      className={`${
        isMobilePreview
          ? 'absolute bottom-4 right-4 z-40'
          : 'fixed bottom-6 right-6 z-50'
      }`}
    >
      <audio ref={audioRef} loop preload="auto" />

      <button
        type="button"
        onClick={togglePlay}
        title={playing ? 'Pause ambient music' : 'Play ambient music'}
        className={`group relative flex items-center justify-center h-12 w-12 rounded-full shadow-2xl transition-all duration-300 ${
          playing
            ? 'bg-amber-500 text-slate-900 ring-4 ring-amber-400/40 scale-105'
            : 'bg-slate-900/80 text-amber-200 border border-amber-400/30 hover:scale-110 hover:bg-slate-900'
        } backdrop-blur-md`}
      >
        {playing ? (
          <div className="flex items-end gap-0.5 h-5 px-1">
            <span className="w-1 bg-slate-900 rounded-full animate-[bounce_0.6s_infinite_100ms] h-full" />
            <span className="w-1 bg-slate-900 rounded-full animate-[bounce_0.6s_infinite_300ms] h-3/4" />
            <span className="w-1 bg-slate-900 rounded-full animate-[bounce_0.6s_infinite_200ms] h-full" />
            <span className="w-1 bg-slate-900 rounded-full animate-[bounce_0.6s_infinite_400ms] h-1/2" />
          </div>
        ) : (
          <span className="text-lg">🎵</span>
        )}

        <span className="absolute right-14 whitespace-nowrap rounded-lg bg-slate-900/90 px-3 py-1 text-[11px] font-bold text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-amber-400/20">
          {playing ? 'Pause Music' : 'Play Music'}
        </span>
      </button>
    </div>
  )
}
