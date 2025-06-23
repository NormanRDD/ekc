<template>
  <div 
    v-if="show"
    class="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    @click.stop
  >
    <!-- User Info Header -->
    <div class="px-4 py-3 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-600 font-medium text-sm">
            {{ getUserInitials() }}
          </span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
          <p class="text-xs text-gray-500">{{ getRoleDisplayName() }}</p>
          <p v-if="authStore.user?.organization" class="text-xs text-gray-500">
            {{ authStore.user.organization }}
          </p>
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="py-1">
      <!-- Profile -->
      <button
        @click="openProfile"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span>Профиль</span>
      </button>

      <!-- Settings -->
      <button
        @click="openSettings"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span>Настройки</span>
      </button>

      <!-- Notifications Settings -->
      <button
        @click="openNotificationSettings"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        <span>Уведомления</span>
      </button>

      <!-- Organization Switch (для ПМСП с несколькими организациями) -->
      <button
        v-if="canSwitchOrganization"
        @click="openOrganizationSwitch"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span>Сменить организацию</span>
      </button>

      <!-- Divider -->
      <div class="border-t border-gray-100 my-1"></div>

      <!-- Help -->
      <button
        @click="openHelp"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Справка</span>
      </button>

      <!-- Change Password -->
      <button
        @click="openChangePassword"
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
        </svg>
        <span>Сменить пароль</span>
      </button>

      <!-- Divider -->
      <div class="border-t border-gray-100 my-1"></div>

      <!-- Logout -->
      <button
        @click="logout"
        class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
      >
        <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span>Выйти</span>
      </button>
    </div>

    <!-- User Statistics (для старших врачей) -->
    <div v-if="authStore.hasPermission('analytics')" class="border-t border-gray-200 px-4 py-3">
      <div class="text-xs text-gray-500 mb-2">Сегодня</div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="text-gray-600">Обращений:</span>
          <span class="font-medium">{{ userStats.todayTickets }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-600">В работе:</span>
          <span class="font-medium text-yellow-600">{{ userStats.inProgress }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-600">Завершено:</span>
          <span class="font-medium text-green-600">{{ userStats.completed }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

 
const emit = defineEmits(['close', 'openSettings'])

const router = useRouter()
const authStore = useAuthStore()

const userStats = ref({
  todayTickets: 0,
  inProgress: 0,
  completed: 0
})

const canSwitchOrganization = computed(() => {
  return authStore.user?.role === 'pmsp' && authStore.user?.organizations?.length > 1
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

const openProfile = () => {
  router.push('/profile')
  emit('close')
}

const openSettings = () => {
  emit('openSettings')
  emit('close')
}

const openNotificationSettings = () => {
  router.push('/settings/notifications')
  emit('close')
}

const openOrganizationSwitch = () => {
  // Открыть модал выбора организации
  // Это будет реализовано в родительском компоненте
  console.log('Open organization switch modal')
  emit('close')
}

const openHelp = () => {
  router.push('/help')
  emit('close')
}

const openChangePassword = () => {
  router.push('/profile/change-password')
  emit('close')
}

const logout = async () => {
  try {
    await authStore.logout()
    // Logout автоматически перенаправит на /login
  } catch (error) {
    console.error('Logout error:', error)
    // Показать toast с ошибкой
    if (window.showToast) {
      window.showToast('Ошибка при выходе из системы', 'error')
    }
  }
  emit('close')
}

const loadUserStats = async () => {
  // Загрузить статистику пользователя для старших врачей
  if (authStore.hasPermission('analytics')) {
    try {
      // Mock данные - в реальности будет API запрос
      userStats.value = {
        todayTickets: 28,
        inProgress: 12,
        completed: 16
      }
    } catch (error) {
      console.error('Failed to load user stats:', error)
    }
  }
}

onMounted(() => {
  loadUserStats()
})
</script>