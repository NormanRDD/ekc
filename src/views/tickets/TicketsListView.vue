<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Список обращений</h1>
        <p class="text-gray-600 mt-1">Управление обращениями граждан</p>
      </div>

      <div class="flex space-x-3">
        <BaseButton
          v-if="authStore.hasPermission('create_ticket')"
          variant="primary"
          @click="$router.push('/tickets/new')"
        >
          <template #icon>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
          </template>
          Создать обращение
        </BaseButton>

        <BaseButton
          v-if="authStore.hasPermission('reports')"
          variant="outline"
          @click="exportTickets"
          :loading="exporting"
        >
          <template #icon>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </template>
          Экспорт
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Фильтры</h3>
        <BaseButton variant="outline" size="sm" @click="clearFilters"> Очистить </BaseButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Период с</label>
          <BaseInput v-model="filters.dateFrom" type="date" placeholder="Выберите дату" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Период по</label>
          <BaseInput v-model="filters.dateTo" type="date" placeholder="Выберите дату" />
        </div>

        <BaseSelect
          v-model="filters.city"
          label="Город"
          :options="cityOptions"
          placeholder="Все города"
          @change="onCityChange"
        />

        <BaseSelect
          v-model="filters.organization"
          label="Организация"
          :options="organizationOptions"
          placeholder="Все организации"
        />

        <BaseSelect
          v-model="filters.callType"
          label="Тип обращения"
          :options="callTypeOptions"
          placeholder="Все типы"
          @change="onCallTypeChange"
        />

        <BaseSelect
          v-model="filters.complaintStatus"
          label="Статус жалобы"
          :options="complaintStatusOptions"
          placeholder="Все статусы"
          :disabled="filters.callType !== 'Жалоба'"
        />

        <BaseInput v-model="filters.search" label="Поиск" placeholder="ФИО, телефон, ИИН, номер" />

        <div class="flex items-end">
          <BaseButton variant="primary" @click="applyFilters" :loading="loading" full-width>
            Применить
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Найдено обращений: <span class="font-medium">{{ pagination.total }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Показывать по:</span>
        <BaseSelect
          v-model="pagination.perPage"
          :options="[
            { label: '25', value: 25 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
          ]"
          @change="onPerPageChange"
        />
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <BaseTable
        :columns="tableColumns"
        :data="tickets"
        :loading="loading"
        :sortable="true"
        @row-click="onRowClick"
        @sort="onSort"
      >
        <template #number="{ row }">
          <router-link
            :to="`/tickets/${row.id}`"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            #{{ row.number }}
          </router-link>
        </template>

        <template #status="{ row }">
          <StatusBadge
            :status="row.complaint?.status || 'Зарегистрировано'"
            type="ticket"
            show-dot
          />
        </template>

        <template #priority="{ row }">
          <StatusBadge v-if="row.priority" :status="row.priority" type="priority" />
        </template>

        <template #timeLeft="{ row }">
          <span v-if="row.timeLeft" :class="getTimeLeftClass(row.timeLeft)">
            {{ row.timeLeft }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex space-x-2">
            <button
              @click.stop="editTicket(row)"
              class="text-blue-600 hover:text-blue-800"
              title="Редактировать"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>

            <button
              v-if="canWithdrawComplaint(row)"
              @click.stop="withdrawComplaint(row)"
              class="text-red-600 hover:text-red-800"
              title="Отозвать жалобу"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </template>
      </BaseTable>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t">
        <BasePagination
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          :per-page="pagination.perPage"
          :total="pagination.total"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTickets } from '@/composables/useTickets'
import { useDictionariesStore } from '@/stores/dictionaries'

const router = useRouter()
const authStore = useAuthStore()
const ticketsStore = useTickets()
const dictionariesStore = useDictionariesStore()

const {
  tickets,
  loading,
  filters,
  pagination,
  getTickets,
  exportTickets: exportTicketsAction,
  clearFilters: clearFiltersAction,
} = ticketsStore

const exporting = ref(false)

// Table configuration
const tableColumns = [
  { key: 'number', label: '№ обращения', sortable: true },
  { key: 'date', label: 'Дата', sortable: true, format: 'datetime' },
  { key: 'contact.fullName', label: 'ФИО', sortable: true },
  { key: 'contact.phone', label: 'Телефон', sortable: false },
  { key: 'registration.city', label: 'Город', sortable: true },
  { key: 'registration.organization', label: 'Организация', sortable: true },
  { key: 'registration.callType', label: 'Тип', sortable: true },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'priority', label: 'Приоритет', sortable: false },
  { key: 'timeLeft', label: 'Осталось', sortable: false },
  { key: 'actions', label: 'Действия', sortable: false, width: '100px' },
]

// Filter options
const cityOptions = computed(() =>
  dictionariesStore.dictionaries.cities.map((city) => ({ label: city, value: city })),
)

const organizationOptions = computed(() => {
  if (!filters.city) return []
  const orgs = dictionariesStore.getOrganizations(filters.city)
  return orgs.map((org) => ({ label: org, value: org }))
})

const callTypeOptions = computed(() =>
  dictionariesStore.dictionaries.callTypes.map((type) => ({ label: type, value: type })),
)

const complaintStatusOptions = computed(() =>
  dictionariesStore.dictionaries.complaintStatuses.map((status) => ({
    label: status,
    value: status,
  })),
)

// Methods
const onCityChange = () => {
  filters.organization = ''
}

const onCallTypeChange = () => {
  if (filters.callType !== 'Жалоба') {
    filters.complaintStatus = ''
  }
}

const applyFilters = () => {
  pagination.page = 1
  getTickets()
}

const clearFilters = () => {
  clearFiltersAction()
  getTickets()
}

const onPerPageChange = () => {
  pagination.page = 1
  getTickets()
}

const onPageChange = (page) => {
  pagination.page = page
  getTickets()
}

const onSort = (column, direction) => {
  // Implement sorting logic
  console.log('Sort:', column, direction)
}

const onRowClick = (ticket) => {
  router.push(`/tickets/${ticket.id}`)
}

const editTicket = (ticket) => {
  router.push(`/tickets/${ticket.id}`)
}

const canWithdrawComplaint = (ticket) => {
  return (
    ticket.complaint &&
    authStore.hasPermission('withdraw_complaint') &&
    ['В работе', 'Назначено'].includes(ticket.complaint.status)
  )
}

const withdrawComplaint = async (ticket) => {
  if (confirm('Вы уверены, что хотите отозвать жалобу?')) {
    try {
      const reason = prompt('Укажите причину отзыва:')
      if (reason) {
        await ticketsStore.withdrawComplaint(ticket.id, reason)
        window.showToast('Жалоба отозвана', 'success')
        getTickets()
      }
    } catch (error) {
        console.log(error);
        
      window.showToast('Ошибка отзыва жалобы', 'error')
    }
  }
}

const exportTickets = async () => {
  exporting.value = true
  try {
    await exportTicketsAction('excel')
    window.showToast('Данные экспортированы', 'success')
  } catch (error) {
    console.log(error);
    
    window.showToast('Ошибка экспорта', 'error')
  } finally {
    exporting.value = false
  }
}

const getTimeLeftClass = (timeLeft) => {
  if (timeLeft.includes('Просрочено')) return 'text-red-600 font-medium'
  if (timeLeft.includes('1 день')) return 'text-yellow-600 font-medium'
  return 'text-green-600'
}

// Watch for filter changes
watch(
  filters,
  () => {
    // Auto-apply filters with debounce for search
    if (filters.search) {
      const timeoutId = setTimeout(() => {
        applyFilters()
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  },
  { deep: true },
)

onMounted(() => {
  getTickets()
})
</script>
