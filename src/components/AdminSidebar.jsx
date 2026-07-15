import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Users', to: '/users' },
  { label: 'Messages', to: '/messages' },
]

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/signin')
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 mb-4 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
          <span>{isOpen ? 'Close Menu' : 'Admin Menu'}</span>
        </button>
        <img src="/evrionvault-logo.png" alt="EvrionVault" className="h-7 w-7 rounded-lg" />
      </div>

      <aside className={`${isOpen ? 'block' : 'hidden'} lg:block w-full shrink-0 lg:w-72 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`}>
        <div className="flex items-center gap-3">
          <img src="/evrionvault-logo.png" alt="EvrionVault" className="h-10 w-10 rounded-xl" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">EvrionVault</p>
            <h2 className="text-lg font-bold text-slate-900">Admin Panel</h2>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
