<template>
  <div class="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
    <!-- Header with icon and title -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div 
          class="p-2 rounded-lg"
          :class="iconColorClasses"
        >
          <div v-html="icon" class="text-white"></div>
        </div>
        <h3 class="ml-3 text-sm font-medium text-gray-600">{{ title }}</h3>
      </div>
      
      <!-- Change indicator -->
      <div 
        v-if="change && change !== '0%'"
        class="flex items-center text-xs font-medium px-2 py-1 rounded-full"
        :class="changeColorClasses"
      >
        <svg 
          v-if="isPositiveChange"
          class="w-3 h-3 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7"></path>
        </svg>
        <svg 
          v-else-if="isNegativeChange"
          class="w-3 h-3 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10"></path>
        </svg>
        {{ change }}
      </div>
    </div>

    <!-- Main value -->
    <div class="mb-2">
      <div class="text-3xl font-bold text-gray-900">
        {{ formattedValue }}
      </div>
    </div>

    <!-- Description or additional info -->
    <div v-if="description" class="text-sm text-gray-500">
      {{ description }}
    </div>

    <!-- Progress bar for certain types -->
    <div v-if="showProgress && maxValue" class="mt-4">
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>Прогресс</span>
        <span>{{ Math.round((value / maxValue) * 100) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="progressColorClasses"
          :style="{ width: `${Math.min((value / maxValue) * 100, 100)}%` }"
        ></div>
      </div>
    </div>

    <!-- Status indicator for overdue items -->
    <div v-if="type === 'overdue' && value > 0" class="mt-3 flex items-center text-xs text-red-600">
      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>
      Требует внимания
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'new', 'progress', 'completed', 'overdue', 'success', 'warning', 'danger'].includes(value)
  },
  change: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>'
  },
  description: {
    type: String,
    default: null
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  maxValue: {
    type: Number,
    default: null
  }
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('ru-RU')
  }
  return props.value
})

const isPositiveChange = computed(() => {
  if (!props.change) return false
  return props.change.startsWith('+')
})

const isNegativeChange = computed(() => {
  if (!props.change) return false
  return props.change.startsWith('-') && props.change !== '-0%'
})

const iconColorClasses = computed(() => {
  const classes = {
    default: 'bg-blue-500',
    new: 'bg-purple-500',
    progress: 'bg-yellow-500',
    completed: 'bg-green-500',
    overdue: 'bg-red-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500'
  }
  return classes[props.type] || classes.default
})

const changeColorClasses = computed(() => {
  if (isPositiveChange.value) {
    return 'text-green-700 bg-green-100'
  } else if (isNegativeChange.value) {
    return 'text-red-700 bg-red-100'
  }
  return 'text-gray-700 bg-gray-100'
})

const progressColorClasses = computed(() => {
  const classes = {
    default: 'bg-blue-500',
    new: 'bg-purple-500',
    progress: 'bg-yellow-500',
    completed: 'bg-green-500',
    overdue: 'bg-red-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500'
  }
  return classes[props.type] || classes.default
})
</script>