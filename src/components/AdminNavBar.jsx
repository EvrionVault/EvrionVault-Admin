import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TEAL = '#3c6ef2'

function AdminNavBar() {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/signin')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-50 w-full">
      {/* Left — Logo + Brand name */}
      <div className="flex items-center gap-3">
        {imgError ? (
          <span
            className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: TEAL }}
          >
            EV
          </span>
        ) : (
          <img
            src="/evrionvault-logo.png"
            alt="EvrionVault"
            className="h-10 w-10 rounded-lg object-contain shrink-0"
            onError={() => setImgError(true)}
          />
        )}
        <span className="text-xl font-extrabold tracking-tight" style={{ color: TEAL }}>
          EvrionVault
        </span>
      </div>

      {/* Right — Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-[18px] w-[18px]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
        </svg>
        Logout
      </button>
    </header>
  )
}

export default AdminNavBar
