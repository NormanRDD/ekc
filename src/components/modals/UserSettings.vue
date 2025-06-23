<template>
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Настройки пользователя</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="overflow-y-auto max-h-[calc(90vh-120px)]">
      <!-- Profile Section -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-4">Профиль</h3>
        
        <div class="flex items-center space-x-4 mb-4">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 font-medium text-lg">
              {{ getUserInitials() }}
            </span>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</h4>
            <p class="text-sm text-gray-500">{{ getRoleDisplayName() }}</p>
            <p v-if="authStore.user?.organization" class="text-sm text-gray-500">
              {{ authStore.user.organization }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Полное имя
            </label>
            <input
              v-model="profileForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="profileForm.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              v-model="profileForm.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-4">Настройки уведомлений</h3>
        
        <div class="space-y-4">
          <!-- Email notifications -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Email уведомления</p>
              <p class="text-sm text-gray-500">Получать уведомления на email</p>
            </div>
            <button
              @click="toggleNotification('email')"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="notificationSettings.email ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="notificationSettings.email ? 'translate-x-5' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Assignment notifications -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Назначение обращений</p>
              <p class="text-sm text-gray-500">Уведомления о новых назначенных обращениях</p>
            </div>
            <button
              @click="toggleNotification('assignment')"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="notificationSettings.assignment ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="notificationSettings.assignment ? 'translate-x-5' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Deadline warnings -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Предупреждения о сроках</p>
              <p class="text-sm text-gray-500">Уведомления за 24 часа до истечения срока</p>
            </div>
            <button
              @click="toggleNotification('deadlineWarning')"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="notificationSettings.deadlineWarning ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="notificationSettings.deadlineWarning ? 'translate-x-5' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Overdue notifications -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Просроченные обращения</p>
              <p class="text-sm text-gray-500">Уведомления о просроченных жалобах</p>
            </div>
            <button
              @click="toggleNotification('overdue')"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="notificationSettings.overdue ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="notificationSettings.overdue ? 'translate-x-5' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Status change notifications -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Изменение статуса</p>
              <p class="text-sm text-gray-500">Уведомления об изменении статуса обращений</p>
            </div>
            <button
              @click="toggleNotification('statusChange')"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="notificationSettings.statusChange ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="notificationSettings.statusChange ? 'translate-x-5' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Comment notifications -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Новые комментарии</p>
              <p class="text-sm text-gray-500">Уведомления о новых комментариях к обращениям</p>
            </div>
            <button
              @click="toggleNotification('comments')"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="notificationSettings.comments ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="notificationSettings.comments ? 'translate-x-5' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Interface Settings -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-4">Настройки интерфейса</h3>
        
        <div class="space-y-4">
          <!-- Records per page -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Записей на страницу
            </label>
            <select
              v-model="interfaceSettings.recordsPerPage"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <!-- Date format -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Формат даты
            </label>
            <select
              v-model="interfaceSettings.dateFormat"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DD.MM.YYYY">ДД.ММ.ГГГГ</option>
              <option value="DD/MM/YYYY">ДД/ММ/ГГГГ</option>
              <option value="YYYY-MM-DD">ГГГГ-ММ-ДД</option>
            </select>
          </div>

          <!-- Auto-refresh -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Автообновление</p>
              <p class="text-sm text-gray-500">Автоматически обновлять список обращений</p>
            </div>
            <button
              @click="toggleAutoRefresh"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              :class="interfaceSettings.autoRefresh ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="interfaceSettings.autoRefresh ? 'translate-x-5' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Auto-refresh interval -->
          <div v-if="interfaceSettings.autoRefresh">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Интервал обновления (секунды)
            </label>
            <select
              v-model="interfaceSettings.refreshInterval"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="30">30 секунд</option>
              <option value="60">1 минута</option>
              <option value="120">2 минуты</option>
              <option value="300">5 минут</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="px-6 py-4">
        <h3 class="text-sm font-medium text-gray-900 mb-4">Безопасность</h3>
        
        <div class="space-y-3">
          <button
            @click="openChangePassword"
            class="w-full flex items-center justify-between px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-900">Сменить пароль</span>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 mb-2">Последний вход:</p>
            <p class="text-sm font-medium text-gray-900">{{ formatLastLogin() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Отмена
        </button>
        <button
          @click="saveSettings"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Сохранение...</span>
          <span v-else>Сохранить</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

 
const emit = defineEmits(['close'])

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const profileForm = reactive({
  name: '',
  email: '',
  phone: ''
})

const notificationSettings = reactive({
  email: true,
  assignment: true,
  deadlineWarning: true,
  overdue: true,
  statusChange: true,
  comments: false
})

const interfaceSettings = reactive({
  recordsPerPage: 50,
  dateFormat: 'DD.MM.YYYY',
  autoRefresh: true,
  refreshInterval: 60
})

const getUserInitials = () => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
}

const getRoleDisplayName = () => {
  const roleNames = {
    dispatcher: 'Диспетчер',
    senior_doctor: 'Старший врач ТМЦ',
    pmsp: 'Сотрудник ПМСП',
    uoz: 'Сотрудник УОЗ',
  }
  return roleNames[authStore.user?.role] || authStore.user?.role
}

const formatLastLogin = () => {
  // Mock данные - в реальности будет из authStore
  const lastLogin = new Date()
  return lastLogin.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleNotification = (type) => {
  notificationSettings[type] = !notificationSettings[type]
}

const toggleAutoRefresh = () => {
  interfaceSettings.autoRefresh = !interfaceSettings.autoRefresh
}

const openChangePassword = () => {
  router.push('/profile/change-password')
  emit('close')
}

const loadSettings = () => {
  // Загрузить настройки пользователя
  if (authStore.user) {
    profileForm.name = authStore.user.name || ''
    profileForm.email = authStore.user.email || ''
    profileForm.phone = authStore.user.phone || ''
  }

  // Загрузить настройки из localStorage
  const savedNotifications = localStorage.getItem('notification_settings')
  if (savedNotifications) {
    Object.assign(notificationSettings, JSON.parse(savedNotifications))
  }

  const savedInterface = localStorage.getItem('interface_settings')
  if (savedInterface) {
    Object.assign(interfaceSettings, JSON.parse(savedInterface))
  }
}

const saveSettings = async () => {
  loading.value = true
  
  try {
    // Сохранить профиль
    await authStore.updateProfile(profileForm)
    
    // Сохранить настройки уведомлений в localStorage
    localStorage.setItem('notification_settings', JSON.stringify(notificationSettings))
    
    // Сохранить настройки интерфейса в localStorage
    localStorage.setItem('interface_settings', JSON.stringify(interfaceSettings))
    
    if (window.showToast) {
      window.showToast('Настройки успешно сохранены', 'success')
    }
    
    emit('close')
  } catch (error) {
    console.error('Failed to save settings:', error)
    if (window.showToast) {
      window.showToast('Ошибка сохранения настроек', 'error')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>