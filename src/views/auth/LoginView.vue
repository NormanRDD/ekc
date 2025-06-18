<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Вход в систему
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Тикетная система ТМЦ
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <BaseInput
            v-model="form.username"
            label="Логин"
            type="text"
            required
            :error="errors.username"
            placeholder="Введите логин"
          />
          
          <BaseInput
            v-model="form.password"
            label="Пароль"
            type="password"
            required
            :error="errors.password"
            placeholder="Введите пароль"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Запомнить меня
            </label>
          </div>
        </div>

        <div>
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="loading"
          >
            Войти
          </BaseButton>
        </div>
        
        <!-- Demo credentials -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800 font-medium mb-2">Демо доступы:</p>
          <div class="text-xs text-blue-700 space-y-1">
            <div>Диспетчер: dispatcher / 123</div>
            <div>ПМСП: pmsp / 123</div>
            <div>Старший врач: senior / 123</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const errors = reactive({})
const loading = ref(false)

const handleLogin = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  // Basic validation
  if (!form.username) {
    errors.username = 'Введите логин'
    return
  }
  
  if (!form.password) {
    errors.password = 'Введите пароль'
    return
  }
  
  loading.value = true
  
  try {
    await authStore.login({
      username: form.username,
      password: form.password,
      rememberMe: form.rememberMe
    })
    
    router.push('/dashboard')
    window.showToast('Добро пожаловать в систему!', 'success')
  } catch (error) {
    errors.general = error.message
    window.showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>