<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Icon -->
      <div
        v-if="slots.icon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <slot name="icon" />
      </div>

      <!-- Clear button -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        @click="handleClear"
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

    <!-- Helper text or error -->
    <div v-if="error || helperText" class="mt-1 text-sm">
      <span v-if="error" class="text-red-600">{{ error }}</span>
      <span v-else-if="helperText" class="text-gray-500">{{ helperText }}</span>
    </div>

    <!-- Character count -->
    <div v-if="maxlength" class="mt-1 text-xs text-gray-500 text-right">
      {{ (modelValue || '').length }} / {{ maxlength }}
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const slots = useSlots()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  label: String,
  placeholder: String,
  error: String,
  helperText: String,
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  clearable: Boolean,
  maxlength: Number,
  id: String,
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const baseClasses =
    'block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0'

  let borderClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  let backgroundClasses = 'bg-white'

  if (props.error) {
    borderClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500'
  }

  if (props.disabled) {
    backgroundClasses = 'bg-gray-50'
    borderClasses += ' cursor-not-allowed'
  }

  if (props.readonly) {
    backgroundClasses = 'bg-gray-50'
  }

  const paddingClasses = props.clearable || slots.icon ? 'px-3 py-2 pr-10' : 'px-3 py-2'

  return [baseClasses, borderClasses, backgroundClasses, paddingClasses].join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.form-group {
  /* @apply space-y-1; */
}

.form-label {
  /* @apply block text-sm font-medium text-gray-700; */
}
</style>