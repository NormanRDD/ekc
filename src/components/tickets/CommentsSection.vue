<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Комментарии</h3>
    </div>
    
    <div class="px-6 py-4">
      <!-- Add Comment Form -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Добавить комментарий
        </label>
        <textarea
          v-model="newComment"
          rows="3"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Введите комментарий..."
          :disabled="!canAddComment"
        ></textarea>
        <div class="mt-2 flex justify-between items-center">
          <span v-if="!canAddComment" class="text-sm text-gray-500">
            У вас нет прав для добавления комментариев
          </span>
          <div class="flex space-x-2 ml-auto">
            <BaseButton
              variant="outline"
              size="sm"
              @click="clearComment"
              :disabled="!newComment.trim()"
            >
              Очистить
            </BaseButton>
            <BaseButton
              @click="addComment"
              :disabled="!newComment.trim() || !canAddComment"
              :loading="adding"
              size="sm"
            >
              Добавить комментарий
            </BaseButton>
          </div>
        </div>
      </div>
      
      <!-- Comments List -->
      <div v-if="comments.length === 0" class="text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-1">Комментариев пока нет</p>
        <p class="text-sm text-gray-500">Станьте первым, кто оставит комментарий</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="comment in sortedComments"
          :key="comment.id"
          class="relative"
        >
          <div class="flex items-start space-x-3">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
            
            <!-- Comment Content -->
            <div class="flex-1 min-w-0">
              <div class="bg-gray-50 rounded-lg p-4">
                <!-- Comment Header -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">{{ comment.author }}</span>
                    <StatusBadge 
                      :status="getRoleDisplayName(comment.role)" 
                      type="user" 
                      size="sm"
                    />
                  </div>
                  <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{{ formatDateTime(comment.date) }}</span>
                    <button
                      v-if="canDeleteComment(comment)"
                      @click="deleteComment(comment.id)"
                      class="text-red-500 hover:text-red-700 transition-colors"
                      title="Удалить комментарий"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Comment Text -->
                <div class="text-gray-700 whitespace-pre-wrap">{{ comment.text }}</div>
                
                <!-- Comment Metadata -->
                <div v-if="comment.edited" class="mt-2 text-xs text-gray-500 italic">
                  Отредактировано {{ formatDateTime(comment.editedAt) }}
                </div>
              </div>
              
              <!-- Reply Option -->
              <div v-if="canAddComment" class="mt-2">
                <button
                  @click="replyToComment(comment)"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ответить
                </button>
              </div>
            </div>
          </div>
          
          <!-- Replies -->
          <div v-if="comment.replies && comment.replies.length > 0" class="ml-11 mt-4 space-y-3">
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0">
                <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              
              <div class="flex-1 bg-gray-100 rounded-lg p-3">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{ reply.author }}</span>
                    <StatusBadge 
                      :status="getRoleDisplayName(reply.role)" 
                      type="user" 
                      size="xs"
                    />
                  </div>
                  <span class="text-xs text-gray-500">{{ formatDateTime(reply.date) }}</span>
                </div>
                <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ reply.text }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Load More Comments -->
      <div v-if="hasMoreComments" class="mt-6 text-center">
        <BaseButton
          variant="outline"
          @click="loadMoreComments"
          :loading="loadingMore"
        >
          Загрузить еще комментарии
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatDateTime } from '@/utils/formatters'
import StatusBadge from '@/components/common/StatusBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  ticketId: {
    type: [String, Number],
    required: true
  },
  comments: {
    type: Array,
    default: () => []
  },
  canComment: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['comment-added', 'comment-deleted'])

const authStore = useAuthStore()

const newComment = ref('')
const adding = ref(false)
const loadingMore = ref(false)
const hasMoreComments = ref(false)

// Computed properties
const canAddComment = computed(() => {
  return props.canComment && authStore.isAuthenticated
})

const sortedComments = computed(() => {
  return [...props.comments].sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Methods
const addComment = async () => {
  if (!newComment.value.trim() || !canAddComment.value) return
  
  adding.value = true
  
  try {
    const commentData = {
      text: newComment.value.trim(),
      author: authStore.user?.name || authStore.user?.fullName || 'Пользователь',
      role: authStore.userRole,
      date: new Date().toISOString()
    }
    
    emit('comment-added', commentData)
    newComment.value = ''
    
    window.showToast('Комментарий добавлен', 'success')
  } catch (error) {
    console.error('Error adding comment:', error)
    window.showToast('Ошибка добавления комментария', 'error')
  } finally {
    adding.value = false
  }
}

const clearComment = () => {
  newComment.value = ''
}

const deleteComment = async (commentId) => {
  if (!confirm('Вы уверены, что хотите удалить комментарий?')) return
  
  try {
    emit('comment-deleted', commentId)
    window.showToast('Комментарий удален', 'success')
  } catch (error) {
    console.error('Error deleting comment:', error)
    window.showToast('Ошибка удаления комментария', 'error')
  }
}

const canDeleteComment = (comment) => {
  if (!authStore.isAuthenticated) return false
  
  // Admin can delete any comment
  if (authStore.hasRole('admin')) return true
  
  // UOZ can delete any comment
  if (authStore.hasRole('uoz')) return true
  
  // Users can delete their own comments
  return comment.author === authStore.user?.name || 
         comment.author === authStore.user?.fullName
}

const replyToComment = (comment) => {
  newComment.value = `@${comment.author} `
  // Focus on textarea
  const textarea = document.querySelector('textarea')
  if (textarea) {
    textarea.focus()
    textarea.setSelectionRange(newComment.value.length, newComment.value.length)
  }
}

const loadMoreComments = async () => {
  loadingMore.value = true
  
  try {
    // Simulate loading more comments
    await new Promise(resolve => setTimeout(resolve, 1000))
    hasMoreComments.value = false
  } catch (error) {
    console.error('Error loading more comments:', error)
    window.showToast('Ошибка загрузки комментариев', 'error')
  } finally {
    loadingMore.value = false
  }
}

const getRoleDisplayName = (role) => {
  const roleNames = {
    'admin': 'Администратор',
    'dispatcher': 'Диспетчер',
    'senior_doctor': 'Старший врач ТМЦ',
    'pmsp': 'Сотрудник ПМСП',
    'uoz': 'Сотрудник УОЗ'
  }
  return roleNames[role] || role
}

// Keyboard shortcuts
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    addComment()
  }
}

// Add event listener for keyboard shortcuts
document.addEventListener('keydown', handleKeyDown)
</script>

<style scoped>
/* Custom scrollbar for comment text */
.whitespace-pre-wrap {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Smooth transitions */
.transition-colors {
  transition: color 0.15s ease-in-out;
}

/* Reply indentation line */
.ml-11::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: -1rem;
  bottom: 0;
  width: 2px;
  background-color: #e5e7eb;
}
</style>