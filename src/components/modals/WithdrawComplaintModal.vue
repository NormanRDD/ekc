<template>
  <BaseModal
    :show="show"
    title="Отзыв жалобы"
    size="md"
    @close="handleClose"
  >
    <template #icon>
      <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Warning Message -->
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-amber-800">Внимание!</h3>
            <div class="mt-2 text-sm text-amber-700">
              <p>Отзыв жалобы является необратимым действием. После отзыва жалобу нельзя будет восстановить.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ticket Information -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-900 mb-3">Информация об обращении</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Номер:</span>
            <span class="ml-2 font-medium">{{ ticket?.number }}</span>
          </div>
          <div>
            <span class="text-gray-500">Статус:</span>
            <span class="ml-2">
              <StatusBadge :status="ticket?.complaint?.status" type="complaint" size="sm" />
            </span>
          </div>
          <div>
            <span class="text-gray-500">Заявитель:</span>
            <span class="ml-2 font-medium">{{ ticket?.contact?.fullName }}</span>
          </div>
          <div>
            <span class="text-gray-500">Дата создания:</span>
            <span class="ml-2">{{ formatDate(ticket?.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Withdrawal Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Withdrawal Reason -->
        <BaseSelect
          v-model="form.reason"
          label="Причина отзыва"
          :options="withdrawalReasons"
          :error="errors.reason"
          required
        />

        <!-- Custom Reason -->
        <BaseTextarea
          v-if="form.reason === 'other'"
          v-model="form.customReason"
          label="Укажите причину"
          rows="3"
          placeholder="Опишите причину отзыва жалобы..."
          :error="errors.customReason"
          required
        />

        <!-- Additional Comments -->
        <BaseTextarea
          v-model="form.comments"
          label="Дополнительные комментарии"
          rows="4"
          placeholder="Дополнительная информация об отзыве (необязательно)..."
          :error="errors.comments"
        />

        <!-- Notification Options -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900">Уведомления</h4>
          
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="form.notifyPatient"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Уведомить заявителя об отзыве</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="form.notifyOrganization"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Уведомить назначенную организацию</span>
            </label>
          </div>
        </div>

        <!-- Confirmation -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <label class="flex items-start">
            <input
              v-model="form.confirmed"
              type="checkbox"
              class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-0.5"
              required
            />
            <span class="ml-2 text-sm text-red-700">
              Я подтверждаю, что хочу отозвать данную жалобу. Я понимаю, что это действие необратимо.
            </span>
          </label>
        </div>
      </form>

      <!-- User Information -->
      <div class="text-xs text-gray-500 bg-gray-50 rounded p-3">
        <p><strong>Отзыв будет выполнен:</strong> {{ currentUser?.fullName || currentUser?.name }}</p>
        <p><strong>Дата и время:</strong> {{ formatDateTime(new Date()) }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <BaseButton
          variant="outline"
          @click="handleClose"
          :disabled="loading"
        >
          Отмена
        </BaseButton>
        
        <div class="flex space-x-3">
          <BaseButton
            variant="outline"
            @click="saveDraft"
            :disabled="loading || !form.reason"
          >
            Сохранить черновик
          </BaseButton>
          
          <BaseButton
            variant="danger"
            @click="handleSubmit"
            :loading="loading"
            :disabled="!form.confirmed || !form.reason"
          >
            Отозвать жалобу
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatDateTime } from '@/utils/formatters'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  ticket: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'withdraw'])

const authStore = useAuthStore()

const loading = ref(false)

const form = reactive({
  reason: '',
  customReason: '',
  comments: '',
  notifyPatient: true,
  notifyOrganization: true,
  confirmed: false
})

const errors = reactive({})

// Computed properties
const currentUser = computed(() => authStore.user)

const withdrawalReasons = [
  { label: 'Заявитель отозвал жалобу', value: 'patient_withdrew' },
  { label: 'Жалоба подана по ошибке', value: 'submitted_by_mistake' },
  { label: 'Дублирование жалобы', value: 'duplicate_complaint' },
  { label: 'Решен вопрос в частном порядке', value: 'resolved_privately' },
  { label: 'Некорректное оформление', value: 'incorrect_formatting' },
  { label: 'Отсутствие полномочий у заявителя', value: 'no_authority' },
  { label: 'Техническая ошибка при регистрации', value: 'technical_error' },
  { label: 'Другая причина', value: 'other' }
]

// Methods
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const withdrawalData = {
      ticketId: props.ticket.id,
      reason: form.reason === 'other' ? form.customReason : getReasonText(form.reason),
      reasonCode: form.reason,
      comments: form.comments,
      notifyPatient: form.notifyPatient,
      notifyOrganization: form.notifyOrganization,
      withdrawnBy: currentUser.value?.fullName || currentUser.value?.name,
      withdrawnAt: new Date().toISOString()
    }
    
    // Clear draft after successful submission
    clearDraft()
    
    emit('withdraw', withdrawalData)
    resetForm()
    
  } catch (error) {
    console.error('Error withdrawing complaint:', error)
    window.showToast('Ошибка при отзыве жалобы', 'error')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  if (hasUnsavedChanges()) {
    if (confirm('У вас есть несохраненные изменения. Вы действительно хотите закрыть окно?')) {
      resetForm()
      emit('close')
    }
  } else {
    resetForm()
    emit('close')
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true
  
  if (!form.reason) {
    errors.reason = 'Выберите причину отзыва'
    isValid = false
  }
  
  if (form.reason === 'other' && !form.customReason?.trim()) {
    errors.customReason = 'Укажите причину отзыва'
    isValid = false
  }
  
  if (!form.confirmed) {
    window.showToast('Необходимо подтвердить отзыв жалобы', 'error')
    isValid = false
  }
  
  return isValid
}

const resetForm = () => {
  Object.assign(form, {
    reason: '',
    customReason: '',
    comments: '',
    notifyPatient: true,
    notifyOrganization: true,
    confirmed: false
  })
  Object.assign(errors, {})
}

const getReasonText = (reasonCode) => {
  const reason = withdrawalReasons.find(r => r.value === reasonCode)
  return reason ? reason.label : reasonCode
}

const hasUnsavedChanges = () => {
  return form.reason || form.customReason || form.comments
}

// Draft management
const getDraftKey = () => {
  return `withdrawal-draft-${props.ticket?.id}`
}

const saveDraft = () => {
  if (!props.ticket?.id) return
  
  try {
    const draftData = {
      ...form,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(getDraftKey(), JSON.stringify(draftData))
    window.showToast('Черновик сохранен', 'success')
  } catch (error) {
    console.error('Error saving draft:', error)
    window.showToast('Ошибка сохранения черновика', 'error')
  }
}

const loadDraft = () => {
  if (!props.ticket?.id) return
  
  try {
    // const draftData = localStorage.getItem(getDraftKey())
    // if (draftData) {
    //   const parsed = JSON.parse(draftData)
    //   // Don't load confirmation state from draft
    //   const { confirmed, ...draftForm } = parsed
    //   Object.assign(form, draftForm)
      
    //   window.showToast('Черновик восстановлен', 'info')
    // }
  } catch (error) {
    console.error('Error loading draft:', error)
  }
}

const clearDraft = () => {
  if (!props.ticket?.id) return
  
  try {
    localStorage.removeItem(getDraftKey())
  } catch (error) {
    console.error('Error clearing draft:', error)
  }
}

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue && props.ticket?.id) {
    loadDraft()
  }
})

watch(() => props.ticket?.id, () => {
  resetForm()
})

// Auto-save draft
watch(form, () => {
  if (props.show && hasUnsavedChanges() && form.reason) {
    // Debounced auto-save could be implemented here
    // For now, just manual save
  }
}, { deep: true })
</script>

<style scoped>
/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-color: currentColor;
}

/* Smooth transitions for form elements */
.transition-all {
  transition: all 0.15s ease-in-out;
}

/* Error state styling */
.border-red-300 {
  border-color: #fca5a5;
}

.text-red-600 {
  color: #dc2626;
}

/* Success state styling */
.border-green-300 {
  border-color: #86efac;
}

/* Focus states */
input:focus, textarea:focus, select:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  border-color: #3b82f6;
}
</style>