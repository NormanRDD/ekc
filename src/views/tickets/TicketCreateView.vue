<template>
  <div class="max-w-4xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Назад
        </button>
        
        <div class="h-6 border-l border-gray-300"></div>
        
        <h1 class="text-2xl font-bold text-gray-900">Создание обращения</h1>
      </div>
      
      <!-- Bright Pattern Integration Info -->
      <div v-if="phoneFromBrightPattern" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <span class="text-blue-800 font-medium">
            Входящий звонок: {{ $route.query.phone }}
          </span>
        </div>
      </div>
    </div>

    <!-- Ticket Form -->
    <TicketForm
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @save-draft="handleSaveDraft"
    />

    <!-- Success Modal -->
    <BaseModal
      v-if="showSuccessModal"
      title="Обращение создано"
      @close="closeSuccessModal"
    >
      <div class="text-center py-4">
        <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Обращение успешно создано
        </h3>
        
        <p class="text-gray-600 mb-4">
          Номер обращения: <span class="font-medium">#{{ createdTicket?.number }}</span>
        </p>
        
        <div class="flex justify-center space-x-3">
          <BaseButton
            variant="outline"
            @click="createAnother"
          >
            Создать еще
          </BaseButton>
          
          <BaseButton
            variant="primary"
            @click="viewTicket"
          >
            Просмотреть
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { useAuthStore } from '@/stores/auth'
import TicketForm from '@/components/forms/TicketForm.vue'

const router = useRouter()
const route = useRoute()
const ticketsStore = useTicketsStore()
const authStore = useAuthStore()

const loading = ref(false)
const showSuccessModal = ref(false)
const createdTicket = ref(null)

const phoneFromBrightPattern = computed(() => !!route.query.phone)

const handleSubmit = async (formData) => {
  loading.value = true
  
  try {
    const ticket = await ticketsStore.createTicket(formData)
    createdTicket.value = ticket
    showSuccessModal.value = true
    
    // Clear draft after successful creation
    localStorage.removeItem('ticket-draft')
    
    // Notify Bright Pattern about successful creation if applicable
    if (phoneFromBrightPattern.value && window.$brightPattern) {
      window.$brightPattern.sendMessage('ticket_created', {
        ticketId: ticket.id,
        ticketNumber: ticket.number
      })
    }
    
    window.showToast('Обращение успешно создано', 'success')
  } catch (error) {
    console.error('Error creating ticket:', error)
    window.showToast(error.message || 'Ошибка создания обращения', 'error')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (confirm('Вы уверены, что хотите отменить создание обращения? Несохраненные данные будут потеряны.')) {
    router.push('/tickets')
  }
}

const handleSaveDraft = (formData) => {
  try {
    localStorage.setItem('ticket-draft', JSON.stringify(formData))
    window.showToast('Черновик сохранен', 'success')
  } catch (error) {
    console.log(error);
    
    window.showToast('Ошибка сохранения черновика', 'error')
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/tickets')
}

const createAnother = () => {
  showSuccessModal.value = false
  createdTicket.value = null
  
  // Clear form by reloading page or resetting form data
  router.push('/tickets/new')
}

const viewTicket = () => {
  if (createdTicket.value) {
    router.push(`/tickets/${createdTicket.value.id}`)
  }
}

// Check permissions on mount
onMounted(() => {
  if (!authStore.hasPermission('create_ticket')) {
    window.showToast('У вас нет прав для создания обращений', 'error')
    router.push('/tickets')
  }
})

// Warn about unsaved changes when leaving
onUnmounted(() => {
  const draft = localStorage.getItem('ticket-draft')
  if (draft && !createdTicket.value) {
    // Could implement a "restore draft" feature here
  }
})
</script>