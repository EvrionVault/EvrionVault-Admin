import { useState, useRef } from 'react'
import { api } from '../api.js'

const BLUE = '#3c6ef2'

function ImageUpload({ value, onChange, folder = 'events', label = 'Cover Image', accept = 'image/*,video/mp4', className = '' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post(`/upload?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(res.data.url)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (e) => upload(e.target.files?.[0])
  const handleDrop = (e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files?.[0]) }
  const isVideo = value && (value.includes('/video/') || value.endsWith('.mp4') || value.endsWith('.webm'))

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <p className="text-sm font-medium text-slate-700">
          {label} <span className="text-slate-400 font-normal">(optional)</span>
        </p>
      )}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className={`relative w-full rounded-xl border-2 border-dashed transition cursor-pointer overflow-hidden
          ${drag ? 'bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        style={{ minHeight: value ? 'auto' : '110px', borderColor: drag ? BLUE : undefined }}
      >
        {value ? (
          <div className="relative group">
            {isVideo ? (
              <video src={value} className="w-full max-h-48 object-cover rounded-xl" muted />
            ) : (
              <img src={value} alt="cover" className="w-full max-h-48 object-cover rounded-xl" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
              <span className="text-white text-sm font-semibold">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
            {uploading ? (
              <>
                <div className="h-7 w-7 rounded-full border-2 border-t-transparent animate-spin mb-2" style={{ borderColor: BLUE, borderTopColor: 'transparent' }} />
                <p className="text-sm text-slate-500">Uploading…</p>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 text-slate-300 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-slate-500">Drag & drop or <span className="font-semibold" style={{ color: BLUE }}>browse</span></p>
                <p className="text-xs text-slate-400 mt-1">Image or video · max 50 MB</p>
              </>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {value && !uploading && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onChange('') }} className="text-xs text-red-400 hover:text-red-600 font-medium">
          Remove
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
    </div>
  )
}

export default ImageUpload
