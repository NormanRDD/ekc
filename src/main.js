import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js'

import App from './App.vue'
import { router } from './router'

// Регистрируем необходимые компоненты Chart.js
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
)

const app = createApp(App)
const pinia = createPinia()

// Сначала подключаем Pinia
app.use(pinia)

// Инициализируем приложение
async function initApp() {
  try {
    // Динамически импортируем auth store после инициализации Pinia
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()
    
    // Инициализируем auth store
    await authStore.initializeAuth()
    
    // Настраиваем автоматическое обновление токена
    authStore.setupTokenRefresh()
    
    // Подключаем роутер и монтируем приложение
    app.use(router)
    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // В случае ошибки все равно монтируем приложение
    app.use(router)
    app.mount('#app')
  }
}

// Запускаем приложение
initApp()