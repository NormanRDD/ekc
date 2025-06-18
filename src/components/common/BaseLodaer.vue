<template>
  <div :class="loaderClasses">
    <div class="loader-spinner"></div>
    <span v-if="text" class="ml-2 text-sm">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  text: String,
  inline: Boolean
})

const loaderClasses = computed(() => {
  const baseClasses = props.inline ? 'inline-flex items-center' : 'flex items-center justify-center'
  return baseClasses
})

// const spinnerSizeClass = computed(() => {
//   const sizes = {
//     sm: 'w-4 h-4',
//     md: 'w-6 h-6',
//     lg: 'w-8 h-8'
//   }
//   return sizes[props.size]
// })
</script>

<style scoped>
.loader-spinner {
  @apply inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent;
  width: 1rem;
  height: 1rem;
}

.loader-spinner.w-4 {
  width: 1rem;
  height: 1rem;
}

.loader-spinner.w-6 {
  width: 1.5rem;
  height: 1.5rem;
}

.loader-spinner.w-8 {
  width: 2rem;
  height: 2rem;
}
</style>