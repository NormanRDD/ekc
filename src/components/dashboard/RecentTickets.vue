<template>
  <div class="bg-white rounded-xl shadow-sm border">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Последние обращения</h3>
        <div class="flex items-center space-x-3">
          <!-- Filter dropdown -->
          <select 
            v-model="selectedFilter"
            class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Все обращения</option>
            <option value="new">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="overdue">Просроченные</option>
            <option value="complaints">Только жалобы</option>
          </select>
          
          <router-link 
            to="/tickets"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Все обращения →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-6">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-center space-x-4">
          <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div class="w-20 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Tickets list -->
    <div v-else-if="filteredTickets.length > 0" class="divide-y divide-gray-200">
      <div 
        v-for="ticket in filteredTickets" 
        :key="ticket.id"
        class="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
        @click="openTicket(ticket.id)"
      >
        <div class="flex items-start justify-between">
          <!-- Left side: ticket info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3 mb-2">
              <!-- Status indicator -->
              <div 
                class="w-3 h-3 rounded-full flex-shrink-0"
                :class="getStatusColor(ticket)"
              ></div>
              
              <!-- Ticket number and date -->
              <div class="flex items-center space-x-2">
                <span class="font-medium text-gray-900">{{ ticket.number }}</span>
                <span class="text-sm text-gray-500">
                  {{ formatDate(ticket.date) }}
                </span>
              </div>

              <!-- Priority indicator -->
              <div 
                v-if="ticket.priority === 'high'"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Срочно
              </div>
            </div>

            <!-- Contact info -->
            <div class="mb-2">
              <div class="text-sm font-medium text-gray-900">
                {{ ticket.contact.fullName }}
              </div>
              <div class="text-sm text-gray-500">
                {{ ticket.contact.phone }}
              </div>
            </div>

            <!-- Registration info -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <span>{{ ticket.registration.city }}</span>
              <span v-if="ticket.registration.organization">
                {{ ticket.registration.organization }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                {{ ticket.registration.callType }}
              </span>
            </div>

            <!-- Complaint status (if applicable) -->
            <div v-if="ticket.complaint" class="mt-2">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Статус жалобы:</span>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getComplaintStatusColor(ticket.complaint.status)"
                >
                  {{ ticket.complaint.status }}
                </span>
                <span v-if="ticket.complaint.assignedTo" class="text-sm text-gray-500">
                  → {{ ticket.complaint.assignedTo }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right side: actions and time info -->
          <div class="flex flex-col items-end space-y-2 ml-4">
            <!-- Time left indicator -->
            <div v-if="ticket.timeLeft" class="text-right">
              <div 
                class="text-sm font-medium"
                :class="getTimeLeftColor(ticket.timeLeft)"
              >
                {{ ticket.timeLeft }}
              </div>
              <div class="text-xs text-gray-500">до истечения</div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <button
                v-if="canEditTicket(ticket)"
                @click.stop="editTicket(ticket.id)"
                class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Редактировать"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>

              <button
                @click.stop="addComment(ticket.id)"
                class="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Добавить комментарий"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
              </button>

              <button
                @click.stop="openTicket(ticket.id)"
                class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Открыть"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Нет обращений</h3>
      <p class="text-sm text-gray-500">
        {{ getEmptyStateMessage() }}
      </p>
    </div>

    <!-- Footer with pagination -->
    <div v-if="!loading && filteredTickets.length > 0" class="px-6 py-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>Показано {{ filteredTickets.length }} из {{ tickets.length }} обращений</span>
        <router-link 
          to="/tickets"
          class="font-medium text-blue-600 hover:text-blue-800"
        >
          Показать все
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  tickets: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit-ticket', 'add-comment'])

const router = useRouter()
const authStore = useAuthStore()

const selectedFilter = ref('all')

const filteredTickets = computed(() => {
  if (selectedFilter.value === 'all') {
    return props.tickets
  }
  
  return props.tickets.filter(ticket => {
    switch (selectedFilter.value) {
      case 'new':
        return ticket.complaint?.status === 'Назначено' || !ticket.complaint
      case 'in_progress':
        return ticket.complaint?.status === 'В работе'
      case 'overdue':
        return ticket.priority === 'high' || ticket.complaint?.status === 'Просрочена'
      case 'complaints':
        return ticket.registration.callType === 'Жалоба'
      default:
        return true
    }
  })
})

const formatDate = (dateString) => {
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
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const getStatusColor = (ticket) => {
  if (!ticket.complaint) {
    return 'bg-gray-400' // Информационное обращение
  }
  
  switch (ticket.complaint.status) {
    case 'Назначено':
      return 'bg-blue-400'
    case 'В работе':
      return 'bg-yellow-400'
    case 'Исполнено':
    case 'Закрыто':
      return 'bg-green-400'
    case 'Отказано':
      return 'bg-red-400'
    case 'Просрочена':
      return 'bg-red-500'
    case 'Жалоба отозвана':
      return 'bg-gray-400'
    default:
      return 'bg-gray-400'
  }
}

const getComplaintStatusColor = (status) => {
  const colors = {
    'Назначено': 'bg-blue-100 text-blue-800',
    'В работе': 'bg-yellow-100 text-yellow-800',
    'Исполнено': 'bg-green-100 text-green-800',
    'Закрыто': 'bg-green-100 text-green-800',
    'Отказано': 'bg-red-100 text-red-800',
    'Просрочена': 'bg-red-100 text-red-800',
    'Жалоба отозвана': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getTimeLeftColor = (timeLeft) => {
  if (timeLeft.includes('час') || timeLeft.includes('мин')) {
    return 'text-red-600' // Срочно
  } else if (timeLeft.includes('1 день')) {
    return 'text-yellow-600' // Внимание
  }
  return 'text-gray-600' // Обычно
}

const canEditTicket = (ticket) => {
  const userRole = authStore.user?.role
  
  switch (userRole) {
    case 'dispatcher':
      // Диспетчер может редактировать только свои необработанные обращения
      return !ticket.complaint || ticket.complaint.status === 'Назначено'
    case 'senior_doctor':
      // Старший врач может редактировать все
      return true
    case 'pmsp':
      // ПМСП может редактировать только свои жалобы
      return ticket.complaint && ticket.complaint.assignedTo === authStore.user?.organization
    case 'uoz':
      // УОЗ может редактировать только переданные им жалобы
      return ticket.complaint && ticket.complaint.assignedTo === 'УОЗ'
    default:
      return false
  }
}

const getEmptyStateMessage = () => {
  switch (selectedFilter.value) {
    case 'new':
      return 'Нет новых обращений'
    case 'in_progress':
      return 'Нет обращений в работе'
    case 'overdue':
      return 'Нет просроченных обращений'
    case 'complaints':
      return 'Нет жалоб'
    default:
      return 'Обращения появятся здесь после их регистрации'
  }
}

const openTicket = (ticketId) => {
  router.push(`/tickets/${ticketId}`)
}

const editTicket = (ticketId) => {
  emit('edit-ticket', ticketId)
  router.push(`/tickets/${ticketId}/edit`)
}

const addComment = (ticketId) => {
  emit('add-comment', ticketId)
  router.push(`/tickets/${ticketId}#comments`)
}
</script>