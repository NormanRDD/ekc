import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Зарегистрируй необходимые компоненты
import App from './App.vue'
import { router } from './router'
Chart.register(ArcElement, Tooltip, Legend)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
