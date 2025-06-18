<template>
  <div v-if="loading" class="flex justify-center items-center min-h-96">
    <BaseLoader size="lg" text="Загрузка обращения..." />
  </div>

  <div v-else-if="!ticket" class="text-center py-12">
    <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Обращение не найдено</h3>
    <p class="text-gray-600 mb-4">Возможно, обращение было удалено или у вас нет прав доступа</p>
    <BaseButton @click="$router.push('/tickets')"> Вернуться к списку </BaseButton>
  </div>

  <div v-else class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Назад
        </button>

        <div class="h-6 border-l border-gray-300"></div>

        <div>
          <h1 class="text-2xl font-bold text-gray-900">Обращение #{{ ticket.number }}</h1>
          <p class="text-gray-600">
            {{ formatDateTime(ticket.date) }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <StatusBadge
          :status="ticket.complaint?.status || 'Зарегистрировано'"
          type="ticket"
          show-dot
        />

        <BaseButton v-if="canEdit" variant="outline" @click="editMode = !editMode">
          {{ editMode ? 'Отменить' : 'Редактировать' }}
        </BaseButton>
      </div>
    </div>

    <!-- Time Left Warning -->
    <div v-if="timeLeftWarning" :class="timeLeftWarningClass">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
        <span class="font-medium">{{ timeLeftWarning }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Information -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-blue-700">Контактная информация</h3>
          </div>
          <div class="px-6 py-4">
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Телефон</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.contact.phone }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">ФИО</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.contact.fullName }}</dd>
              </div>
              <div v-if="ticket.contact.iin">
                <dt class="text-sm font-medium text-gray-500">ИИН</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.contact.iin }}</dd>
              </div>
              <div v-if="ticket.contact.birthDate">
                <dt class="text-sm font-medium text-gray-500">Дата рождения</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(ticket.contact.birthDate) }}
                </dd>
              </div>
              <div v-if="ticket.contact.address" class="md:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Адрес</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.contact.address }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Registration Information -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-blue-700">Регистрация обращения</h3>
          </div>
          <div class="px-6 py-4">
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Город</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.registration.city }}</dd>
              </div>
              <div v-if="ticket.registration.district">
                <dt class="text-sm font-medium text-gray-500">Район</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.registration.district }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Организация</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.registration.organization }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Тип обращения</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ ticket.registration.callType }}
                  <span v-if="ticket.registration.callSubtype" class="text-gray-500">
                    — {{ ticket.registration.callSubtype }}
                  </span>
                </dd>
              </div>
              <div class="md:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Причина обращения</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.registration.reason }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Complaint Information -->
        <div v-if="ticket.complaint" class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-red-700">Информация о жалобе</h3>
          </div>
          <div class="px-6 py-4">
            <div v-if="!editMode">
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Статус</dt>
                  <dd class="mt-1">
                    <StatusBadge :status="ticket.complaint.status" type="ticket" />
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Назначено</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ ticket.complaint.assignedTo }}</dd>
                </div>
                <div v-if="ticket.complaint.assignedUser">
                  <dt class="text-sm font-medium text-gray-500">Исполнитель</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ ticket.complaint.assignedUser }}</dd>
                </div>
                <div v-if="ticket.complaint.category">
                  <dt class="text-sm font-medium text-gray-500">Категория</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ ticket.complaint.category }}</dd>
                </div>
                <div v-if="ticket.complaint.result" class="md:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Результат</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ ticket.complaint.result }}</dd>
                </div>
              </dl>
            </div>

            <!-- Edit Form -->
            <div v-else>
              <ComplaintEditForm
                :complaint="ticket.complaint"
                :loading="updating"
                @save="updateComplaint"
                @cancel="editMode = false"
              />
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <CommentsSection
          :ticket-id="ticket.id"
          :comments="ticket.comments"
          @comment-added="handleCommentAdded"
        />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Действия</h3>
          </div>
          <div class="px-6 py-4 space-y-3">
            <BaseButton
              v-if="canWithdraw"
              variant="danger"
              size="sm"
              full-width
              @click="showWithdrawModal = true"
            >
              Отозвать жалобу
            </BaseButton>

            <BaseButton
              v-if="canTransfer"
              variant="outline"
              size="sm"
              full-width
              @click="showTransferModal = true"
            >
              Передать
            </BaseButton>

            <BaseButton variant="outline" size="sm" full-width @click="printTicket">
              Печать
            </BaseButton>
          </div>
        </div>

        <!-- System Information -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Системная информация</h3>
          </div>
          <div class="px-6 py-4">
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Создал</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ ticket.createdBy }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Дата создания</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(ticket.date) }}</dd>
              </div>
              <div v-if="ticket.complaint">
                <dt class="text-sm font-medium text-gray-500">Срок выполнения</dt>
                <dd class="mt-1 text-sm" :class="getTimeLeftClass()">
                  {{ getTimeLeft() }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- History -->
        <TicketHistory :history="ticket.history" />
      </div>
    </div>

    <!-- Modals -->
    <WithdrawComplaintModal
      v-if="showWithdrawModal"
      @close="showWithdrawModal = false"
      @confirm="handleWithdraw"
    />

    <TransferTicketModal
      v-if="showTransferModal"
      :ticket="ticket"
      @close="showTransferModal = false"
      @confirm="handleTransfer"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTickets } from '@/composables/useTickets'
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatDateTime } from '@/utils/formatters'
import CommentsSection from '@/components/tickets/CommentsSection.vue'
import ComplaintEditForm from '@/components/forms/ComplaintEditForm.vue'
import TicketHistory from '@/components/tickets/TicketHistory.vue'
import WithdrawComplaintModal from '@/components/modals/WithdrawComplaintModal.vue'
import TransferTicketModal from '@/components/modals/TransferTicketModal.vue'

const route = useRoute()
const router = useRouter()
const ticketsStore = useTickets()
const authStore = useAuthStore()

const {
  currentTicket: ticket,
  loading,
  getTicket,
  updateTicket,
  addComment,
  withdrawComplaint,
  canEditTicket,
  canWithdrawComplaint,
  getTimeLeft: getTicketTimeLeft,
  //   isTicketOverdue
} = ticketsStore

const editMode = ref(false)
const updating = ref(false)
const showWithdrawModal = ref(false)
const showTransferModal = ref(false)

const canEdit = computed(() => canEditTicket.value(ticket.value))
const canWithdraw = computed(() => canWithdrawComplaint.value(ticket.value))
const canTransfer = computed(
  () =>
    authStore.hasPermission('edit_all') ||
    (authStore.user?.role === 'dispatcher' && ticket.value?.createdBy === authStore.user.name),
)

const timeLeftWarning = computed(() => {
  if (!ticket.value?.complaint) return null

  const timeLeft = getTicketTimeLeft(ticket.value)

  if (timeLeft?.includes('Просрочено')) {
    return `Жалоба просрочена: ${timeLeft}`
  } else if (timeLeft?.includes('Сегодня')) {
    return 'Жалоба должна быть обработана сегодня'
  } else if (timeLeft?.includes('1 дн')) {
    return 'Жалоба должна быть обработана завтра'
  }

  return null
})

const timeLeftWarningClass = computed(() => {
  if (!timeLeftWarning.value) return ''

  if (timeLeftWarning.value.includes('Просрочено')) {
    return 'bg-red-50 border border-red-200 rounded-lg p-4 text-red-800'
  } else if (timeLeftWarning.value.includes('сегодня')) {
    return 'bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-800'
  } else {
    return 'bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800'
  }
})

const getTimeLeft = () => {
  return getTicketTimeLeft(ticket.value) || 'Не определено'
}

const getTimeLeftClass = () => {
  const timeLeft = getTimeLeft()
  if (timeLeft.includes('Просрочено')) return 'text-red-600 font-medium'
  if (timeLeft.includes('1 дн')) return 'text-yellow-600 font-medium'
  return 'text-green-600'
}

const updateComplaint = async (complaintData) => {
  updating.value = true
  try {
    await updateTicket(ticket.value.id, { complaint: complaintData })
    editMode.value = false
    window.showToast('Жалоба обновлена', 'success')
  } catch (error) {
    console.log(error)

    window.showToast('Ошибка обновления жалобы', 'error')
  } finally {
    updating.value = false
  }
}

const handleCommentAdded = async (comment) => {
  try {
    await addComment(ticket.value.id, comment)
  } catch (error) {
    console.log(error)

    window.showToast('Ошибка добавления комментария', 'error')
  }
}

const handleWithdraw = async (reason) => {
  try {
    await withdrawComplaint(ticket.value.id, reason)
    showWithdrawModal.value = false
    window.showToast('Жалоба отозвана', 'success')
  } catch (error) {
    console.log(error)

    window.showToast('Ошибка отзыва жалобы', 'error')
  }
}

const handleTransfer = async (transferData) => {
  try {
    await updateTicket(ticket.value.id, {
      complaint: {
        ...ticket.value.complaint,
        assignedTo: transferData.assignedTo,
        status: 'Назначено',
      },
    })
    showTransferModal.value = false
    window.showToast('Обращение передано', 'success')
  } catch (error) {
    console.log(error);

    window.showToast('Ошибка передачи обращения', 'error')
  }
}

const printTicket = () => {
  window.print()
}

onMounted(async () => {
  const ticketId = route.params.id

  try {
    await getTicket(ticketId)

    if (!ticket.value) {
      router.push('/tickets')
      return
    }

    // Check if user can view this ticket
    if (!canEdit.value && !authStore.hasPermission('view_all_tickets')) {
      const userRole = authStore.user?.role
      const userOrg = authStore.user?.organization

      if (userRole === 'pmsp' && ticket.value.organization !== userOrg) {
        window.showToast('У вас нет доступа к этому обращению', 'error')
        router.push('/tickets')
        return
      }

      if (userRole === 'dispatcher' && ticket.value.createdBy !== authStore.user.name) {
        window.showToast('У вас нет доступа к этому обращению', 'error')
        router.push('/tickets')
        return
      }
    }
  } catch (error) {
    console.log(error);

    window.showToast('Ошибка загрузки обращения', 'error')
    router.push('/tickets')
  }
})
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
