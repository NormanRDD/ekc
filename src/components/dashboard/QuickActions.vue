<template>
  <button
    @click="$emit('click')"
    class="w-full flex items-center p-3 rounded-lg transition-all duration-200 group"
    :class="buttonClasses"
  >
    <!-- Icon -->
    <div 
      class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors"
      :class="iconClasses"
    >
      <!-- Plus icon -->
      <svg 
        v-if="icon === 'plus'"
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      
      <!-- List icon -->
      <svg 
        v-else-if="icon === 'list'"
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
      </svg>
      
      <!-- Warning icon -->
      <svg 
        v-else-if="icon === 'warning'"
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      
      <!-- Download icon -->
      <svg 
        v-else-if="icon === 'download'"
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      
      <!-- Settings icon -->
      <svg 
        v-else-if="icon === 'settings'"
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      
      <!-- Building icon -->
      <svg 
        v-else-if="icon === 'building'"
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      
      <!-- Default icon -->
      <svg 
        v-else
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1 text-left">
      <div class="flex items-center">
        <h4 class="text-sm font-medium transition-colors" :class="titleClasses">
          {{ title }}
        </h4>
        <div 
          v-if="badge !== null"
          class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          :class="badgeClasses"
        >
          {{ badge }}
        </div>
      </div>
      <p class="text-xs mt-0.5 transition-colors" :class="descriptionClasses">
        {{ description }}
      </p>
    </div>

    <!-- Arrow icon -->
    <div class="flex-shrink-0 ml-2">
      <svg 
        class="w-4 h-4 transition-transform group-hover:translate-x-1" 
        :class="arrowClasses"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'default'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'warning', 'danger'].includes(value)
  },
  badge: {
    type: [Number, String, null],
    default: null
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  switch (props.variant) {
    case 'primary':
      return `${base} bg-blue-50 hover:bg-blue-100 border border-blue-200 focus:ring-blue-500`
    case 'warning':
      return `${base} bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 focus:ring-yellow-500`
    case 'danger':
      return `${base} bg-red-50 hover:bg-red-100 border border-red-200 focus:ring-red-500`
    default:
      return `${base} bg-gray-50 hover:bg-gray-100 border border-gray-200 focus:ring-gray-500`
  }
})

const iconClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
    case 'warning':
      return 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200'
    case 'danger':
      return 'bg-red-100 text-red-600 group-hover:bg-red-200'
    default:
      return 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
  }
})

const titleClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-blue-900 group-hover:text-blue-950'
    case 'warning':
      return 'text-yellow-900 group-hover:text-yellow-950'
    case 'danger':
      return 'text-red-900 group-hover:text-red-950'
    default:
      return 'text-gray-900 group-hover:text-gray-950'
  }
})

const descriptionClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-blue-700 group-hover:text-blue-800'
    case 'warning':
      return 'text-yellow-700 group-hover:text-yellow-800'
    case 'danger':
      return 'text-red-700 group-hover:text-red-800'
    default:
      return 'text-gray-600 group-hover:text-gray-700'
  }
})

const arrowClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-blue-400 group-hover:text-blue-500'
    case 'warning':
      return 'text-yellow-400 group-hover:text-yellow-500'
    case 'danger':
      return 'text-red-400 group-hover:text-red-500'
    default:
      return 'text-gray-400 group-hover:text-gray-500'
  }
})

const badgeClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-100 text-blue-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'danger':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})
</script>