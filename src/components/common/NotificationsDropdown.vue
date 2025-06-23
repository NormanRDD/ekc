<template>
  <div 
    v-if="show"
    class="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    @click.stop
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">
          Уведомления
          <span v-if="unreadCount > 0" class="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
            {{ unreadCount }}
          </span>
        </h3>
        <div class="flex items-center space-x-2">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Прочитать все
          </button>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
        <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </div>
        <p class="text-sm text-gray-500">Нет новых уведомлений</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50': !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start space-x-3">
            <!-- Icon based on notification type -->
            <div class="flex-shrink-0 mt-0.5">
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="getNotificationIconClass(notification.type)"
              >
                <!-- Assignment icon -->
                <svg 
                  v-if="notification.type === 'assignment'"
                  class="w-3 h-3" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                </svg>
                
                <!-- Deadline warning icon -->
                <svg 
                  v-else-if="notification.type === 'deadline_warning'"
                  class="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                
                <!-- Overdue icon -->
                <svg 
                  v-else-if="notification.type === 'overdue'"
                  class="w-3 h-3" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                
                <!-- Status change icon -->
                <svg 
                  v-else-if="notification.type === 'status_change'"
                  class="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                
                <!-- Comment icon -->
                <svg 
                  v-else-if="notification.type === 'comment'"
                  class="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                
                <!-- Default icon -->
                <svg 
                  v-else
                  class="w-3 h-3" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"></path>
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">
                {{ notification.message }}
              </p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">
                  {{ formatTimeAgo(notification.createdAt) }}
                </span>
                <span 
                  v-if="notification.ticketNumber"
                  class="text-xs text-blue-600 font-medium"
                >
                  №{{ notification.ticketNumber }}
                </span>
              </div>
            </div>

            <!-- Unread indicator -->
            <div v-if="!notification.read" class="flex-shrink-0">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="notifications.length > 0" class="px-4 py-3 border-t border-gray-200">
      <button
        @click="viewAllNotifications"
        class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-1"
      >
        Показать все уведомления
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
 
const emit = defineEmits(['close'])

const router = useRouter()
const notificationsStore = useNotificationsStore()

const notifications = computed(() => notificationsStore.recentNotifications)
const unreadCount = computed(() => notificationsStore.unreadCount)

const getNotificationIconClass = (type) => {
  const classes = {
    assignment: 'bg-blue-100 text-blue-600',
    deadline_warning: 'bg-yellow-100 text-yellow-600',
    overdue: 'bg-red-100 text-red-600',
    status_change: 'bg-green-100 text-green-600',
    comment: 'bg-purple-100 text-purple-600',
    withdrawn: 'bg-gray-100 text-gray-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = (now - date) / (1000 * 60)
  
  if (diffInMinutes < 1) {
    return 'Только что'
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)} мин. назад`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} ч. назад`
  } else if (diffInMinutes < 2880) {
    return 'Вчера'
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }
}

const handleNotificationClick = (notification) => {
  // Mark as read
  if (!notification.read) {
    notificationsStore.markAsRead(notification.id)
  }
  
  // Navigate to ticket if available
  if (notification.ticketId) {
    router.push(`/tickets/${notification.ticketId}`)
  }
  
  // Close dropdown
  emit('close')
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const viewAllNotifications = () => {
  router.push('/notifications')
  emit('close')
}
</script>