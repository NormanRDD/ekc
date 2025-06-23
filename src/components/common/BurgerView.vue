<template>
  <div class="h-creen min-w-[50px]">
    <div @click="isToggled = true" class="cursor-pointer">
      <img src="@/assets/icons/dashboard/burger.svg" alt="" />
    </div>

    <div
      :class="[
        'absolute top-0 mt-2 w-72 bg-blue-100 h-screen border border-gray-200 rounded-lg shadow-lg z-50 transition duration-300 ease-in-out',
        isToggled ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div
        @click="isToggled = false"
        class="cursor-pointer text-4xl text-right pr-5 font-bold text-black-600 hover:text-black font-[cursive]"
      >
        x
      </div>
      <nav class="pt-4 pb-4 space-y-2 text-2xl gap-5 grid">
        <router-link
          to="/dashboard"
          class="nav-link flex items-center gap-2 p-4 rounded hover:bg-red-100 transition-colors duration-200"
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
          <span> Главная </span>
        </router-link>

        <router-link
          to="/tickets"
          class="nav-link flex items-center gap-2 p-4 rounded hover:bg-red-100 transition-colors duration-200"
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
          class="nav-link flex items-center gap-2 p-4 rounded hover:bg-red-100 transition-colors duration-200"
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
          class="nav-link flex items-center gap-2 p-4 rounded hover:bg-red-100 transition-colors duration-200"
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
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const isToggled = ref(false)
</script>
