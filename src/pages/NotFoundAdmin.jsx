import { Link } from 'react-router-dom'

function NotFoundAdmin() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-extrabold text-slate-400 mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition"
      >
        ← Back to Dashboard
      </Link>
    </section>
  )
}

export default NotFoundAdmin
