<template>
  <div class="bg-white rounded-xl shadow-sm border p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Требуют внимания</h3>
      <div v-if="alerts.length > 0" class="flex items-center space-x-2">
        <div class="flex items-center text-red-600">
          <div class="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          <span class="text-sm font-medium">{{ alerts.length }}</span>
        </div>
      </div>
    </div>

    <!-- Alerts list -->
    <div v-if="alerts.length > 0" class="space-y-3">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md"
        :class="getAlertClasses(alert)"
        @click="openAlert(alert)"
      >
        <div class="flex items-start space-x-3">
          <!-- Alert type icon -->
          <div class="flex-shrink-0 mt-0.5">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center"
              :class="getIconClasses(alert.type)"
            >
              <!-- Overdue icon -->
              <svg
                v-if="alert.type === 'overdue'"
                class="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>

              <!-- Approaching deadline icon -->
              <svg
                v-else-if="alert.type === 'approaching'"
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>

              <!-- High priority icon -->
              <svg
                v-else-if="alert.type === 'high_priority'"
                class="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>

              <!-- Repeat complaint icon -->
              <svg
                v-else-if="alert.type === 'repeat'"
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>

              <!-- New assignment icon -->
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>

          <!-- Alert content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ getAlertTitle(alert) }}
              </p>
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="getTypeClasses(alert.type)"
              >
                {{ getTypeLabel(alert.type) }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-2">
              {{ alert.contact?.fullName || 'Не указано' }}
            </p>

            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ formatTimeAgo(alert.date) }}</span>
              <span
                v-if="alert.timeLeft"
                class="font-medium"
                :class="getTimeLeftColor(alert.timeLeft)"
              >
                {{ alert.timeLeft }}
              </span>
            </div>

            <!-- Organization info -->
            <div v-if="alert.registration?.organization" class="mt-1">
              <span class="text-xs text-gray-500">
                {{ alert.registration.organization }}
              </span>
            </div>
          </div>

          <!-- Action arrow -->
          <div class="flex-shrink-0 ml-2">
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- View all button -->
      <div v-if="alerts.length >= 3" class="pt-2 border-t border-gray-200">
        <button
          @click="viewAllAlerts"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Показать все ({{ totalAlertsCount }})
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <div
        class="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3"
      >
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <h4 class="text-sm font-medium text-gray-900 mb-1">Все под контролем</h4>
      <p class="text-sm text-gray-500">Нет обращений, требующих срочного внимания</p>
    </div>

    <!-- Auto refresh indicator -->
    <div class="flex items-center justify-center pt-3 border-t border-gray-200 mt-4">
      <div class="flex items-center text-xs text-gray-400">
        <svg
          class="w-3 h-3 mr-1 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Обновляется автоматически
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  alerts: {
    type: Array,
    default: () => [],
  },
  totalAlertsCount: {
    type: Number,
    default: 0,
  },
})

const router = useRouter()
// const authStore = useAuthStore()

const getAlertClasses = (alert) => {
  const baseClasses = 'border-l-4'

  switch (alert.type) {
    case 'overdue':
      return `${baseClasses} border-l-red-500 bg-red-50 border-red-200`
    case 'approaching':
      return `${baseClasses} border-l-yellow-500 bg-yellow-50 border-yellow-200`
    case 'high_priority':
      return `${baseClasses} border-l-orange-500 bg-orange-50 border-orange-200`
    case 'repeat':
      return `${baseClasses} border-l-purple-500 bg-purple-50 border-purple-200`
    case 'new':
      return `${baseClasses} border-l-blue-500 bg-blue-50 border-blue-200`
    default:
      return `${baseClasses} border-l-gray-500 bg-gray-50 border-gray-200`
  }
}

const getIconClasses = (type) => {
  switch (type) {
    case 'overdue':
      return 'bg-red-100 text-red-600'
    case 'approaching':
      return 'bg-yellow-100 text-yellow-600'
    case 'high_priority':
      return 'bg-orange-100 text-orange-600'
    case 'repeat':
      return 'bg-purple-100 text-purple-600'
    case 'new':
      return 'bg-blue-100 text-blue-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getTypeClasses = (type) => {
  switch (type) {
    case 'overdue':
      return 'bg-red-100 text-red-800'
    case 'approaching':
      return 'bg-yellow-100 text-yellow-800'
    case 'high_priority':
      return 'bg-orange-100 text-orange-800'
    case 'repeat':
      return 'bg-purple-100 text-purple-800'
    case 'new':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getAlertTitle = (alert) => {
  const titles = {
    overdue: `Жалоба №${alert.number} просрочена`,
    approaching: `Срок по жалобе №${alert.number} истекает`,
    high_priority: `Высокий приоритет: №${alert.number}`,
    repeat: `Повторная жалоба №${alert.number}`,
    new: `Новое назначение №${alert.number}`,
  }
  return titles[alert.type] || `Обращение №${alert.number}`
}

const getTypeLabel = (type) => {
  const labels = {
    overdue: 'Просрочено',
    approaching: 'Скоро срок',
    high_priority: 'Приоритет',
    repeat: 'Повторная',
    new: 'Новое',
  }
  return labels[type] || 'Внимание'
}

const getTimeLeftColor = (timeLeft) => {
  if (timeLeft.includes('час') || timeLeft.includes('мин')) {
    return 'text-red-600'
  } else if (timeLeft.includes('1 день')) {
    return 'text-yellow-600'
  }
  return 'text-gray-600'
}

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Только что'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} ч. назад`
  } else if (diffInHours < 48) {
    return 'Вчера'
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    })
  }
}

const openAlert = (alert) => {
  router.push(`/tickets/${alert.id}`)
}

const viewAllAlerts = () => {
  // Navigate to tickets page with priority filter
  router.push('/tickets?filter=priority')
}
</script>
