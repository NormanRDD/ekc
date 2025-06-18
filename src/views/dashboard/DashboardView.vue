<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white rounded-xl shadow-sm border p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Добро пожаловать, {{ authStore.user?.name }}!
          </h1>
          <p class="text-gray-600 mt-1">
            {{ getRoleDisplayName() }} • {{ getCurrentDate() }}
          </p>
        </div>
        
        <div class="flex space-x-3">
          <BaseButton
            v-if="authStore.hasPermission('create_ticket')"
            variant="primary"
            @click="$router.push('/tickets/new')"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </template>
            Создать обращение
          </BaseButton>
          
          <BaseButton
            variant="outline"
            @click="refreshData"
            :loading="loading"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </template>
            Обновить
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Всего обращений"
        :value="stats.totalTickets"
        type="default"
        :change="stats.totalChange"
        icon='<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>'
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Tickets -->
      <div class="lg:col-span-2">
        <RecentTickets 
          :tickets="recentTickets" 
          :loading="loading" 
        />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Priority Alerts -->
        <PriorityAlerts :alerts="priorityTickets" />
        
        <!-- Quick Actions -->
        <QuickActions />
        
        <!-- Performance Metrics -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Показатели</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Среднее время ответа</span>
              <span class="font-medium">{{ stats.avgResponseTime }}ч</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Уровень удовлетворенности</span>
              <span class="font-medium">{{ stats.satisfactionRate }}/5</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Эффективность решения</span>
              <span class="font-medium">{{ Math.round((stats.completed / stats.totalTickets) * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section (for senior doctors) -->
    <div v-if="authStore.hasPermission('analytics')" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Динамика обращений</h3>
        <canvas ref="chartCanvas" width="400" height="200"></canvas>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Распределение по типам</h3>
        <canvas ref="pieChartCanvas" width="400" height="200"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/dashboard/StatCard.vue'
import RecentTickets from '@/components/dashboard/RecentTickets.vue'
import PriorityAlerts from '@/components/dashboard/PriorityAlerts.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import { Chart } from 'chart.js/auto';

const authStore = useAuthStore()

const loading = ref(false)
const chartCanvas = ref(null)
const pieChartCanvas = ref(null)

const stats = reactive({
  totalTickets: 0,
  newTickets: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
  avgResponseTime: 0,
  satisfactionRate: 0,
  totalChange: '',
  progressChange: '',
  completedChange: '',
  overdueChange: ''
})

const recentTickets = ref([])
const priorityTickets = ref([])

const getRoleDisplayName = () => {
  const roleNames = {
    'dispatcher': 'Диспетчер',
    'senior_doctor': 'Старший врач ТМЦ',
    'pmsp': 'Сотрудник ПМСП',
    'uoz': 'Сотрудник УОЗ'
  }
  return roleNames[authStore.user?.role] || authStore.user?.role
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadDashboardData = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data based on user role
    const mockData = {
      dispatcher: {
        totalTickets: 45,
        newTickets: 8,
        inProgress: 12,
        completed: 23,
        overdue: 2,
        avgResponseTime: 2.5,
        satisfactionRate: 4.2,
        totalChange: '+12%',
        progressChange: '+5%',
        completedChange: '+8%',
        overdueChange: '-2%'
      },
      senior_doctor: {
        totalTickets: 847,
        newTickets: 23,
        inProgress: 156,
        completed: 645,
        overdue: 23,
        avgResponseTime: 3.1,
        satisfactionRate: 4.0,
        totalChange: '+18%',
        progressChange: '+3%',
        completedChange: '+15%',
        overdueChange: '+5%'
      },
      pmsp: {
        totalTickets: 89,
        newTickets: 5,
        inProgress: 24,
        completed: 58,
        overdue: 2,
        avgResponseTime: 4.2,
        satisfactionRate: 3.8,
        totalChange: '+6%',
        progressChange: '+2%',
        completedChange: '+4%',
        overdueChange: '0%'
      },
      uoz: {
        totalTickets: 234,
        newTickets: 12,
        inProgress: 67,
        completed: 148,
        overdue: 7,
        avgResponseTime: 5.8,
        satisfactionRate: 3.9,
        totalChange: '+14%',
        progressChange: '+8%',
        completedChange: '+12%',
        overdueChange: '+3%'
      }
    }
    
    const roleData = mockData[authStore.user.role] || mockData.dispatcher
    Object.assign(stats, roleData)
    
    // Mock recent tickets
    recentTickets.value = [
      {
        id: 1,
        number: '2024-001',
        date: '2025-06-16T10:30:00',
        contact: { fullName: 'Иванова Анна Сергеевна', phone: '+7 (777) 123-45-67' },
        registration: { city: 'Алматы', organization: 'ГП №15', callType: 'Жалоба' },
        complaint: { status: 'В работе', assignedTo: 'ГП №15' },
        priority: 'high',
        timeLeft: '2 дня'
      },
      {
        id: 2,
        number: '2024-002',
        date: '2025-06-16T09:15:00',
        contact: { fullName: 'Петров Владимир Михайлович', phone: '+7 (777) 987-65-43' },
        registration: { city: 'Алматы', organization: 'ГП №7', callType: 'Благодарность' },
        complaint: null,
        priority: 'low',
        timeLeft: null
      }
    ]
    
    // Mock priority tickets
    priorityTickets.value = recentTickets.value.filter(t => 
      t.priority === 'high' || (t.complaint && t.complaint.status === 'Просрочена')
    )
    
  } catch (e) {
    console.log(e)
    window.showToast('Ошибка загрузки данных', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadDashboardData()
}

const initializeCharts = () => {
  if (!authStore.hasPermission('analytics')) return
  
  // Line chart for ticket dynamics
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [{
          label: 'Новые обращения',
          data: [12, 19, 8, 15, 22, 8, 12],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        }, {
          label: 'Закрытые обращения',
          data: [8, 15, 12, 18, 20, 6, 10],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
  
  // Pie chart for ticket types
  if (pieChartCanvas.value) {
    const ctx = pieChartCanvas.value.getContext('2d')
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Жалобы', 'Благодарности', 'Консультации', 'Справочная информация'],
        datasets: [{
          data: [35, 15, 30, 20],
          backgroundColor: [
            'rgb(239, 68, 68)',
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(156, 163, 175)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  }
}

onMounted(() => {
  loadDashboardData()
  
  // Initialize charts after a delay to ensure DOM is ready
  setTimeout(() => {
    if (window.Chart) {
      initializeCharts()
    }
  }, 100)
})
</script>