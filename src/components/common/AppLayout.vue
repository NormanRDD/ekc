<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm border-r">
      <div class="p-6 border-b">
        <h1 class="text-xl font-semibold text-gray-900">Тикетная система ТМЦ</h1>
      </div>

      <nav class="p-4 space-y-2">
        <router-link
          to="/dashboard"
          class="nav-link"
          :class="{ 'nav-link-active': $route.name === 'Dashboard' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            ></path>
          </svg>
          Главная
        </router-link>

        <router-link
          to="/tickets"
          class="nav-link"
          :class="{ 'nav-link-active': $route.path.startsWith('/tickets') }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          Обращения
        </router-link>

        <router-link
          v-if="authStore.hasPermission('create_ticket')"
          to="/tickets/new"
          class="nav-link"
          :class="{ 'nav-link-active': $route.name === 'TicketCreate' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Создать обращение
        </router-link>

        <router-link
          v-if="authStore.hasPermission('reports')"
          to="/reports"
          class="nav-link"
          :class="{ 'nav-link-active': $route.name === 'Reports' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          Отчеты
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b px-6 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ $route.meta.title || 'Главная' }}
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ getPageDescription() }}
            </p>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                <span
                  v-if="notificationsStore.unreadCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {{ notificationsStore.unreadCount }}
                </span>
              </button>

              <!-- Notifications Dropdown -->
              <NotificationsDropdown v-if="showNotifications" @close="showNotifications = false" />
            </div>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</div>
                  <div class="text-xs text-gray-500">{{ getRoleDisplayName() }}</div>
                </div>
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-medium text-sm">
                    {{ getUserInitials() }}
                  </span>
                </div>
              </button>

              <!-- User Menu Dropdown -->
              <UserMenuDropdown v-if="showUserMenu" @close="showUserMenu = false" />
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>

    <!-- Global Modals -->
    <Teleport to="body">
      <BaseModal v-if="showSettingsModal" @close="showSettingsModal = false">
        <UserSettings @close="showSettingsModal = false" />
      </BaseModal>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationsDropdown from './NotificationsDropdown.vue'
import UserMenuDropdown from './UserMenuDropdown.vue'
import UserSettings from '../modals/UserSettings.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()

const showNotifications = ref(false)
const showUserMenu = ref(false)
const showSettingsModal = ref(false)

const getRoleDisplayName = () => {
  const roleNames = {
    dispatcher: 'Диспетчер',
    senior_doctor: 'Старший врач ТМЦ',
    pmsp: 'Сотрудник ПМСП',
    uoz: 'Сотрудник УОЗ',
  }
  return roleNames[authStore.user?.role] || authStore.user?.role
}

const router = useRouter()

const getUserInitials = () => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
}

const getPageDescription = () => {
  const descriptions = {
    Dashboard: 'Обзор активности и статистика',
    TicketsList: 'Управление обращениями граждан',
    TicketCreate: 'Регистрация нового обращения',
    TicketDetail: 'Детальная информация об обращении',
    Reports: 'Аналитика и отчетность',
  }
  return descriptions[router.name] || ''
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Load initial notifications
  notificationsStore.loadNotifications()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors;
}

.nav-link-active {
  @apply bg-blue-50 text-blue-700 border-r-2 border-blue-500;
}
</style>
