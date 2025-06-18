<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">История изменений</h3>
    </div>
    
    <div class="px-6 py-4">
      <div v-if="history.length === 0" class="text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-1">История изменений пуста</p>
        <p class="text-sm text-gray-500">Изменения будут отображаться здесь</p>
      </div>
      
      <div v-else class="flow-root">
        <ul class="-mb-8">
          <li
            v-for="(entry, index) in sortedHistory"
            :key="entry.id"
            class="relative pb-8"
          >
            <!-- Timeline line -->
            <div
              v-if="index !== sortedHistory.length - 1"
              class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            ></div>
            
            <div class="relative flex items-start space-x-3">
              <!-- Timeline icon -->
              <div class="relative">
                <div
                  :class="[
                    'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                    getEntryIconClass(entry.action)
                  ]"
                >
                  <component :is="getEntryIcon(entry.action)" class="h-4 w-4 text-white" />
                </div>
              </div>
              
              <!-- Timeline content -->
              <div class="flex-1 min-w-0">
                <div class="text-sm">
                  <p class="font-medium text-gray-900">{{ entry.action }}</p>
                  <p class="text-gray-500 mt-0.5">{{ entry.user }}</p>
                </div>
                
                <div class="mt-2 text-sm text-gray-700">
                  <p v-if="entry.details">{{ entry.details }}</p>
                  
                  <!-- Changes details -->
                  <div v-if="entry.changes" class="mt-2 space-y-1">
                    <div
                      v-for="change in entry.changes"
                      :key="change.field"
                      class="text-xs bg-gray-50 rounded p-2"
                    >
                      <span class="font-medium">{{ getFieldDisplayName(change.field) }}:</span>
                      <span class="text-red-600 line-through ml-1">{{ change.oldValue }}</span>
                      <span class="mx-1">→</span>
                      <span class="text-green-600">{{ change.newValue }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="mt-2 text-xs text-gray-400">
                  {{ formatDateTime(entry.date) }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDateTime } from '@/utils/formatters'

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

// Computed properties
const sortedHistory = computed(() => {
  return [...props.history].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Methods
const getEntryIconClass = (action) => {
  const classes = {
    'Обращение создано': 'bg-green-500',
    'Статус изменен': 'bg-blue-500',
    'Жалоба назначена': 'bg-yellow-500',
    'Комментарий добавлен': 'bg-purple-500',
    'Жалоба отозвана': 'bg-red-500',
    'Жалоба закрыта': 'bg-green-600',
    'Данные обновлены': 'bg-blue-400'
  }
  return classes[action] || 'bg-gray-500'
}

// const getEntryIcon = (action) => {
//   // Return SVG icons as template strings
//   const icons = {
//     'Обращение создано': 'PlusIcon',
//     'Статус изменен': 'RefreshIcon',
//     'Жалоба назначена': 'UserIcon',
//     'Комментарий добавлен': 'ChatIcon',
//     'Жалоба отозвана': 'XIcon',
//     'Жалоба закрыта': 'CheckIcon',
//     'Данные обновлены': 'PencilIcon'
//   }
  
//   // Return a simple template string for the icon
//   return {
//     template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
//     </svg>`
//   }
// }

const getFieldDisplayName = (field) => {
  const fieldNames = {
    'status': 'Статус',
    'assignedTo': 'Назначено',
    'category': 'Категория',
    'subcategory': 'Подкатегория',
    'result': 'Результат',
    'deadline': 'Срок выполнения',
    'priority': 'Приоритет'
  }
  return fieldNames[field] || field
}
</script>

<style scoped>
/* Custom timeline styles */
.flow-root {
  position: relative;
}

/* Ensure proper spacing for timeline */
li:last-child .absolute {
  display: none;
}
</style>