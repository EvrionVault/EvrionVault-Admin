import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AdminSidebar from './components/AdminSidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EventsAdmin from './pages/EventsAdmin.jsx'
import UsersAdmin from './pages/UsersAdmin.jsx'
import MessagesAdmin from './pages/MessagesAdmin.jsx'
import SigninAdmin from './pages/SigninAdmin.jsx'
import SignupAdmin from './pages/SignupAdmin.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function AppLayout() {
  const location = useLocation()
  const authPaths = ['/signin', '/signup', '/forgot-password', '/reset-password']
  const isAuthPage = authPaths.some(path => location.pathname.startsWith(path))

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className={`mx-auto grid max-w-360 gap-8 px-4 py-8 ${isAuthPage ? 'justify-center' : 'lg:grid-cols-[280px_minmax(0,1fr)]'} lg:px-8`}>
        {!isAuthPage && <AdminSidebar />}
        <div className={isAuthPage ? 'w-full' : 'space-y-8'}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventsAdmin /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersAdmin /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesAdmin /></ProtectedRoute>} />
            <Route path="/signin" element={<SigninAdmin />} />
            <Route path="/signup" element={<SignupAdmin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
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
