<template>
  <span :class="badgeClasses">
    <span v-if="showDot" :class="dotClasses"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'ticket',
    validator: (value) => ['ticket', 'complaint', 'priority'].includes(value),
  },
  showDot: {
    type: Boolean,
    default: false,
  },
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

  let colorClasses = ''

  if (props.type === 'ticket') {
    const ticketColors = {
      Новое: 'bg-blue-100 text-blue-800',
      Назначено: 'bg-purple-100 text-purple-800',
      'В работе': 'bg-yellow-100 text-yellow-800',
      Отработана: 'bg-green-100 text-green-800',
      Исполнено: 'bg-green-100 text-green-800',
      Закрыто: 'bg-gray-100 text-gray-800',
      Просрочена: 'bg-red-100 text-red-800',
      'Отозвана заявителем': 'bg-gray-100 text-gray-800',
    }
    colorClasses = ticketColors[props.status] || 'bg-gray-100 text-gray-800'
  } else if (props.type === 'priority') {
    const priorityColors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    }
    colorClasses = priorityColors[props.status] || 'bg-gray-100 text-gray-800'
  }

  return [baseClasses, colorClasses].join(' ')
})

const dotClasses = computed(() => {
  const baseClasses = 'w-1.5 h-1.5 rounded-full mr-1.5'

  let colorClass = ''

  if (props.type === 'ticket') {
    const dotColors = {
      Новое: 'bg-blue-400',
      Назначено: 'bg-purple-400',
      'В работе': 'bg-yellow-400',
      Отработана: 'bg-green-400',
      Исполнено: 'bg-green-400',
      Закрыто: 'bg-gray-400',
      Просрочена: 'bg-red-400',
      'Отозвана заявителем': 'bg-gray-400',
    }
    colorClass = dotColors[props.status] || 'bg-gray-400'
  }

  return [baseClasses, colorClass].join(' ')
})

const label = computed(() => {
  if (props.type === 'priority') {
    const priorityLabels = {
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий',
    }
    return priorityLabels[props.status] || props.status
  }

  return props.status
})
</script>
