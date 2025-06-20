import axios from 'axios'

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_DEV_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    console.log('CONFIG!!!!!!!!!!!!!!', config.url)
    if (config.url !== '/auth/refresh') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // Add request timestamp
    config.metadata = { startTime: new Date() }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    if (response.config.metadata) {
      const endTime = new Date()
      const duration = endTime.getTime() - response.config.metadata.startTime.getTime()

      if (import.meta.env.DEV) {
        console.log(
          `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
        )
      }
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log(originalRequest)
      // try {
      //   // Try to refresh token
      //   const refreshToken = localStorage.getItem('refresh_token')
      //   if (refreshToken) {
      //     const { authApi } = await import('./auth')
      //     const response = await authApi.refreshToken(refreshToken)

      //     if (response.success) {
      //       localStorage.setItem('auth_token', response.data.token)
      //       // originalRequest.headers.Authorization = `Bearer ${response.data.token}`

      //       return apiClient(originalRequest)
      //     }
      //   }
      // } catch (refreshError) {
      //   console.error('Token refresh failed:', refreshError)
      // }

      // Redirect to login if refresh fails
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('❌ Network Error:', error.message)

      if (window.showToast) {
        window.showToast('Ошибка сети. Проверьте подключение к интернету.', 'error')
      }

      return Promise.reject(new Error('Ошибка сети'))
    }

    // Handle other HTTP errors
    const status = error.response.status
    const message = error.response.data?.message || 'Произошла ошибка'

    console.error(`❌ API Error ${status}:`, message)

    // Don't show toast for auth errors (handled by auth store)
    if (status !== 401 && window.showToast) {
      window.showToast(message, 'error')
    }

    return Promise.reject(error)
  },
)

export { apiClient }
