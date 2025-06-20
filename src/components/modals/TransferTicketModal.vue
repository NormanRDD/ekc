<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Передача обращения
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- Current Assignment Info -->
            <div v-if="ticket?.complaint?.assignedTo" class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Текущее назначение:</span>
                {{ ticket.complaint.assignedTo }}
              </p>
              <p v-if="ticket.complaint.assignedUser" class="text-sm text-gray-600 mt-1">
                <span class="font-medium">Исполнитель:</span>
                {{ ticket.complaint.assignedUser }}
              </p>
            </div>

            <!-- Organization Selection -->
            <div>
              <label for="organization" class="block text-sm font-medium text-gray-700 mb-2">
                Организация *
              </label>
              <select
                id="organization"
                v-model="form.organization"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="onOrganizationChange"
              >
                <option value="">Выберите организацию</option>
                <option
                  v-for="org in organizations"
                  :key="org.id"
                  :value="org.name"
                >
                  {{ org.name }}
                </option>
              </select>
            </div>

            <!-- User Selection -->
            <div v-if="availableUsers.length > 0">
              <label for="assignedUser" class="block text-sm font-medium text-gray-700 mb-2">
                Исполнитель
              </label>
              <select
                id="assignedUser"
                v-model="form.assignedUser"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Не назначен</option>
                <option
                  v-for="user in availableUsers"
                  :key="user.id"
                  :value="user.name"
                >
                  {{ user.name }} ({{ user.position || 'Специалист' }})
                </option>
              </select>
            </div>

            <!-- Transfer Reason -->
            <div>
              <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
                Причина передачи
              </label>
              <textarea
                id="reason"
                v-model="form.reason"
                rows="3"
                placeholder="Укажите причину передачи обращения..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <!-- Priority -->
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                Приоритет
              </label>
              <select
                id="priority"
                v-model="form.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Обычный</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </div>

            <!-- Notification checkbox -->
            <div class="flex items-center">
              <input
                id="notify"
                v-model="form.notify"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="notify" class="ml-2 text-sm text-gray-700">
                Уведомить получателя о передаче
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex justify-end space-x-3">
            <BaseButton
              type="button"
              variant="outline"
              @click="$emit('close')"
              :disabled="loading"
            >
              Отмена
            </BaseButton>
            <BaseButton
              type="submit"
              :loading="loading"
              :disabled="!form.organization"
            >
              Передать
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  organization: '',
  assignedUser: '',
  reason: '',
  priority: 'normal',
  notify: true
})

// Mock data - в реальном проекте это должно приходить от API
const organizations = ref([
  { id: 1, name: 'ПМСП №1' },
  { id: 2, name: 'ПМСП №2' },
  { id: 3, name: 'ПМСП №3' },
  { id: 4, name: 'Городская поликлиника №1' },
  { id: 5, name: 'Городская поликлиника №2' },
  { id: 6, name: 'Центральная районная больница' },
  { id: 7, name: 'Департамент здравоохранения' }
])

const users = ref([
  { id: 1, name: 'Иванов И.И.', organization: 'ПМСП №1', position: 'Главный врач' },
  { id: 2, name: 'Петров П.П.', organization: 'ПМСП №1', position: 'Заместитель главного врача' },
  { id: 3, name: 'Сидоров С.С.', organization: 'ПМСП №2', position: 'Главный врач' },
  { id: 4, name: 'Козлов К.К.', organization: 'ПМСП №2', position: 'Специалист по работе с жалобами' },
  { id: 5, name: 'Морозов М.М.', organization: 'Городская поликлиника №1', position: 'Главный врач' },
  { id: 6, name: 'Волков В.В.', organization: 'Департамент здравоохранения', position: 'Начальник отдела' }
])

const availableUsers = computed(() => {
  if (!form.value.organization) return []
  return users.value.filter(user => user.organization === form.value.organization)
})

const onOrganizationChange = () => {
  form.value.assignedUser = ''
}

const handleSubmit = async () => {
  if (!form.value.organization) return

  loading.value = true

  try {
    const transferData = {
      assignedTo: form.value.organization,
      assignedUser: form.value.assignedUser || null,
      reason: form.value.reason,
      priority: form.value.priority,
      notify: form.value.notify,
      transferredBy: authStore.user?.name,
      transferredAt: new Date().toISOString()
    }

    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('confirm', transferData)
  } catch (error) {
    console.error('Ошибка передачи обращения:', error)
    window.showToast('Ошибка передачи обращения', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Можно предзаполнить форму текущими данными
  if (props.ticket?.complaint?.assignedTo) {
    // Не устанавливаем текущую организацию по умолчанию,
    // чтобы пользователь осознанно выбрал новую
  }
})
</script>

<style scoped>
/* Анимации для модального окна */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>