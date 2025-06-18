export { authApi } from './auth'
export { ticketsApi } from './tickets'
export { apiClient } from './client'

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  
  if (window.showToast) {
    window.showToast('Произошла неожиданная ошибка', 'error')
  }
})