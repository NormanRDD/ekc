// ===== src/views/NotFoundView.vue =====
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-lg w-full text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="relative">
          <!-- Large 404 Text -->
          <h1 class="text-9xl font-bold text-gray-200 select-none">404</h1>
          
          <!-- Animated Icon -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="animate-bounce">
              <svg class="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Страница не найдена</h2>
        <p class="text-lg text-gray-600 leading-relaxed">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <p class="text-sm text-gray-500 mt-2">
          Проверьте правильность введенного адреса или воспользуйтесь навигацией.
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <BaseButton
            variant="primary"
            size="lg"
            @click="goHome"
            class="flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            На главную
          </BaseButton>
          
          <BaseButton
            variant="outline"
            size="lg"
            @click="goBack"
            class="flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Назад
          </BaseButton>
        </div>
        
        <!-- Quick Links -->
        <div class="pt-6 border-t border-gray-200 mt-8">
          <p class="text-sm text-gray-500 mb-4">Или перейдите к:</p>
          <div class="flex flex-wrap justify-center gap-3">
            <button
              @click="$router.push('/tickets')"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              Обращения
            </button>
            
            <button
              v-if="authStore.hasPermission('reports')"
              @click="$router.push('/reports')"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              Отчеты
            </button>
            
            <button
              @click="$router.push('/help')"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              Справка
            </button>
          </div>
        </div>
      </div>
      
      <!-- Search Suggestion -->
      <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-sm font-medium text-blue-900 mb-2">Не можете найти нужную страницу?</h3>
        <p class="text-sm text-blue-700 mb-3">
          Воспользуйтесь поиском или обратитесь к администратору системы.
        </p>
        
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по системе..."
            class="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="performSearch"
          />
          <BaseButton
            variant="primary"
            size="sm"
            @click="performSearch"
            :disabled="!searchQuery.trim()"
          >
            Найти
          </BaseButton>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-400">
          Нужна помощь? Обратитесь в техподдержку: 
          <a href="tel:+77000000000" class="text-blue-600 hover:text-blue-800">+7 (700) 000-00-00</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const searchQuery = ref('')

const goHome = () => {
  // Redirect based on user role
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}

const goBack = () => {
  // Check if there's history to go back to
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // In a real application, this would perform a global search
  // For now, we'll redirect to tickets with a search parameter
  router.push({
    path: '/tickets',
    query: { search: searchQuery.value.trim() }
  })
}

onMounted(() => {
  // Log 404 for analytics (in production)
  console.warn('404 Page Not Found:', route.fullPath)
  
  // Send to analytics service
  if (window.gtag) {
    window.gtag('event', 'page_not_found', {
      page_path: route.fullPath,
      page_title: '404 - Page Not Found'
    })
  }
})
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Responsive text scaling */
@media (max-width: 640px) {
  h1 {
    font-size: 6rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 4rem;
  }
}
</style>