// ===== src/views/reports/ReportsView.vue =====
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Отчеты и аналитика</h1>
        <p class="text-gray-600 mt-1">Статистика и отчетность по обращениям</p>
      </div>

      <div class="flex space-x-3">
        <BaseButton variant="outline" @click="refreshData" :loading="loading">
          <template #icon>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </template>
          Обновить
        </BaseButton>

        <BaseButton variant="primary" @click="exportReport" :loading="exporting">
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
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Фильтры отчета</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        />

        <BaseSelect
          v-model="filters.callType"
          label="Тип обращения"
          :options="callTypeOptions"
          placeholder="Все типы"
        />

        <div class="flex items-end">
          <BaseButton variant="primary" @click="applyFilters" :loading="loading" full-width>
            Применить
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Всего обращений</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
            <p class="text-sm text-green-600 mt-1">+{{ stats.totalChange }}% за период</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Жалобы</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.complaints }}</p>
            <p class="text-sm text-gray-500 mt-1">
              {{ Math.round((stats.complaints / stats.total) * 100) }}% от общего
            </p>
          </div>
          <div class="p-3 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Обработано</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.completed }}</p>
            <p class="text-sm text-gray-500 mt-1">
              {{ Math.round((stats.completed / stats.total) * 100) }}% эффективность
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Среднее время</p>
            <p class="text-3xl font-bold text-blue-600">{{ stats.avgTime }}ч</p>
            <p class="text-sm text-yellow-600 mt-1">
              {{ stats.avgTimeChange > 0 ? '+' : '' }}{{ stats.avgTimeChange }}ч к предыдущему
            </p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Line Chart -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Динамика обращений</h3>
        <div class="h-80">
          <canvas ref="lineChartRef"></canvas>
        </div>
      </div>

      <!-- Pie Chart -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Распределение по типам</h3>
        <div class="h-80">
          <canvas ref="pieChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Detailed Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- By Organizations -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">По организациям</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Организация
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Обращений
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Жалоб
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Обработано
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="org in organizationStats" :key="org.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ org.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ org.total }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  {{ org.complaints }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {{ org.completed }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- By Categories -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">По категориям жалоб</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Категория
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Количество
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  %
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in categoryStats" :key="category.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ category.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ category.count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ category.percentage }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <BaseModal v-if="showExportModal" title="Экспорт отчета" @close="showExportModal = false">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Формат файла</label>
          <BaseSelect
            v-model="exportFormat"
            :options="[
              { label: 'Excel (.xlsx)', value: 'xlsx' },
              { label: 'CSV (.csv)', value: 'csv' },
              { label: 'PDF (.pdf)', value: 'pdf' },
            ]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Включить</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input v-model="exportOptions.includeCharts" type="checkbox" class="mr-2" />
              Графики и диаграммы
            </label>
            <label class="flex items-center">
              <input v-model="exportOptions.includeDetails" type="checkbox" class="mr-2" />
              Детальные таблицы
            </label>
            <label class="flex items-center">
              <input v-model="exportOptions.includeComments" type="checkbox" class="mr-2" />
              Комментарии к обращениям
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="outline" @click="showExportModal = false"> Отмена </BaseButton>
        <BaseButton variant="primary" @click="confirmExport" :loading="exporting">
          Экспортировать
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDictionariesStore } from '@/stores/dictionaries'
import { Chart } from 'chart.js/auto'

const router = useRouter()
const authStore = useAuthStore()
const dictionariesStore = useDictionariesStore()

const loading = ref(false)
const exporting = ref(false)
const showExportModal = ref(false)
const lineChartRef = ref(null)
const pieChartRef = ref(null)
let lineChart = null
let pieChart = null

const filters = reactive({
  dateFrom: '',
  dateTo: '',
  city: '',
  callType: '',
})

const stats = reactive({
  total: 0,
  complaints: 0,
  completed: 0,
  avgTime: 0,
  totalChange: 0,
  avgTimeChange: 0,
})

const organizationStats = ref([])
const categoryStats = ref([])

const exportFormat = ref('xlsx')
const exportOptions = reactive({
  includeCharts: true,
  includeDetails: true,
  includeComments: false,
})

// Computed options for filters
const cityOptions = computed(() =>
  dictionariesStore.dictionaries.cities.map((city) => ({ label: city, value: city })),
)

const callTypeOptions = computed(() =>
  dictionariesStore.dictionaries.callTypes.map((type) => ({ label: type, value: type })),
)

// Mock data for demonstration
const loadReportData = async () => {
  loading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock statistics
    Object.assign(stats, {
      total: 1247,
      complaints: 234,
      completed: 1089,
      avgTime: 3.2,
      totalChange: 15,
      avgTimeChange: -0.5,
    })

    // Mock organization data
    organizationStats.value = [
      { name: 'ГП №15', total: 156, complaints: 32, completed: 140 },
      { name: 'ГП №7', total: 98, complaints: 18, completed: 85 },
      { name: 'ГП №29', total: 134, complaints: 28, completed: 120 },
      { name: 'УОЗ г. Алматы', total: 67, complaints: 45, completed: 52 },
      { name: 'ГП №12', total: 89, complaints: 15, completed: 78 },
    ]

    // Mock category data
    categoryStats.value = [
      { name: 'Качество медицинской помощи', count: 89, percentage: 38 },
      { name: 'Организационно-административные', count: 65, percentage: 28 },
      { name: 'Этика и поведение персонала', count: 45, percentage: 19 },
      { name: 'Инфраструктура', count: 23, percentage: 10 },
      { name: 'ИТ-сервисы', count: 12, percentage: 5 },
    ]

    // Initialize charts after data is loaded
    await nextTick()
    initializeCharts()
  } catch (error) {
    console.log(error)

    window.showToast('Ошибка загрузки данных отчета', 'error')
  } finally {
    loading.value = false
  }
}

const initializeCharts = () => {
  // Only initialize if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js is not loaded')
    return
  }

  // Line Chart
  if (lineChartRef.value) {
    const ctx = lineChartRef.value.getContext('2d')

    if (lineChart) {
      lineChart.destroy()
    }

    lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
        datasets: [
          {
            label: 'Новые обращения',
            data: [185, 159, 180, 181, 156, 155],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1,
          },
          {
            label: 'Жалобы',
            data: [28, 48, 40, 39, 35, 27],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.1,
          },
          {
            label: 'Закрытые',
            data: [165, 145, 167, 170, 148, 142],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  // Pie Chart
  if (pieChartRef.value) {
    const ctx = pieChartRef.value.getContext('2d')

    if (pieChart) {
      pieChart.destroy()
    }

    pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Жалобы', 'Благодарности', 'Консультации', 'Справочная информация', 'Прочее'],
        datasets: [
          {
            data: [234, 89, 456, 312, 156],
            backgroundColor: [
              'rgb(239, 68, 68)',
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(168, 85, 247)',
              'rgb(156, 163, 175)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    })
  }
}

const applyFilters = () => {
  loadReportData()
}

const refreshData = () => {
  loadReportData()
}

const exportReport = () => {
  showExportModal.value = true
}

const confirmExport = async () => {
  exporting.value = true

  try {
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In real implementation, this would call an API endpoint
    // that generates and downloads the report file
    const blob = new Blob(['mock report data'], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `report-${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    window.showToast(`Отчет экспортирован в формате ${exportFormat.value.toUpperCase()}`, 'success')
    showExportModal.value = false
  } catch (error) {
    console.log(error)

    window.showToast('Ошибка экспорта отчета', 'error')
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  // Check permissions
  if (!authStore.hasPermission('reports')) {
    window.showToast('У вас нет прав доступа к отчетам', 'error')
    router.push('/dashboard')
    return
  }

  // Set default date range (last 30 days)
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  filters.dateTo = today.toISOString().split('T')[0]
  filters.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]

  loadReportData()
})

onUnmounted(() => {
  // Clean up charts
  if (lineChart) {
    lineChart.destroy()
  }
  if (pieChart) {
    pieChart.destroy()
  }
})
</script>
