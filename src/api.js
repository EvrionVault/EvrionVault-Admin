import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://evrionvault-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/sign')) {
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  }
)
