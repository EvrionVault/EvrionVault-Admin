import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AdminSidebar from './components/AdminSidebar.jsx'
import AdminNavBar from './components/AdminNavBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EventsAdmin from './pages/EventsAdmin.jsx'
import UsersAdmin from './pages/UsersAdmin.jsx'
import MessagesAdmin from './pages/MessagesAdmin.jsx'
import CreateEventAdmin from './pages/CreateEventAdmin.jsx'
import CreateContentAdmin from './pages/CreateContentAdmin.jsx'
import MyEventsAdmin from './pages/MyEventsAdmin.jsx'
import SettingsAdmin from './pages/SettingsAdmin.jsx'
import EventDetailAdmin from './pages/EventDetailAdmin.jsx'
import NotFoundAdmin from './pages/NotFoundAdmin.jsx'
import SigninAdmin from './pages/SigninAdmin.jsx'
import SignupAdmin from './pages/SignupAdmin.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const SIDEBAR_EXPANDED = 220
const SIDEBAR_COLLAPSED = 64

function AppLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const authPaths = ['/signin', '/signup', '/forgot-password', '/reset-password']
  const isAuthPage = authPaths.some((p) => location.pathname.startsWith(p))

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Routes>
          <Route path="/signin" element={<SigninAdmin />} />
          <Route path="/signup" element={<SignupAdmin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <AdminNavBar />

      {/* Main content — offset by sidebar width and top navbar height */}
      <main
        className="min-h-screen pt-14 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventsAdmin /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersAdmin /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesAdmin /></ProtectedRoute>} />
            <Route path="/create-event" element={<ProtectedRoute><CreateEventAdmin /></ProtectedRoute>} />
            <Route path="/create-content" element={<ProtectedRoute><CreateContentAdmin /></ProtectedRoute>} />
            <Route path="/my-events" element={<ProtectedRoute><MyEventsAdmin /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsAdmin /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetailAdmin /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><NotFoundAdmin /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
