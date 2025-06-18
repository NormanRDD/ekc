<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="hideCloseButton" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="handleBackdropClick"
          ></div>

          <!-- Modal -->
          <div :class="modalClasses" @click.stop>
            <!-- Header -->
            <div
              v-if="title || $slots.header || !hideCloseButton"
              class="flex items-center justify-between p-6 border-b"
            >
              <div>
                <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                <slot name="header" />
              </div>

              <button
                v-if="!hideCloseButton"
                type="button"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                @click="handleClose"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: String,
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value),
  },
  hideCloseButton: Boolean,
  persistent: Boolean,
})

const emit = defineEmits(['close'])

const modalClasses = computed(() => {
  const baseClasses = 'relative bg-white rounded-lg shadow-xl transform transition-all'

  const sizeClasses = {
    sm: 'max-w-md w-full',
    md: 'max-w-lg w-full',
    lg: 'max-w-2xl w-full',
    xl: 'max-w-4xl w-full',
    full: 'max-w-full w-full h-full',
  }

  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.persistent) {
    handleClose()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && !props.persistent) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(-10px);
}
</style>
