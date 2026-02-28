import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('iksp-auth')
  if (raw) {
    try {
      const state = JSON.parse(raw)
      const token = state?.state?.token
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // ignore parse errors
    }
  }
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('iksp-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default api
