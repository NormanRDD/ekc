<template>
  <div class="form-group">
    <label v-if="label" :for="selectId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Loading indicator -->
      <div v-if="loading" class="absolute inset-y-0 right-8 flex items-center">
        <BaseLoader class="w-4 h-4" />
      </div>

      <!-- Dropdown arrow -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseLoader from './BaseLoader.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  label: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  required: Boolean,
  loading: Boolean,
  id: String,
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substr(2, 9)}`)

const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option }
    }
    return option
  })
})

const selectClasses = computed(() => {
  const baseClasses =
    'block w-full rounded-lg border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 pr-10 px-3 py-2'

  let borderClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'

  if (props.error) {
    borderClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500'
  }

  if (props.disabled) {
    borderClasses += ' bg-gray-50 cursor-not-allowed'
  }

  return [baseClasses, borderClasses].join(' ')
})

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
