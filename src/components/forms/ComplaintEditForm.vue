// ===== src/components/forms/ComplaintEditForm.vue =====
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Form Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">
        Редактирование жалобы
      </h3>
      <div class="flex items-center space-x-2">
        <StatusBadge :status="form.status" type="complaint" />
        <span class="text-sm text-gray-500">
          № {{ ticketNumber }}
        </span>
      </div>
    </div>

    <!-- Assignment Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseSelect
        v-model="form.assignedTo"
        label="Назначить организации"
        :options="organizationOptions"
        :error="errors.assignedTo"
        required
      />
      
      <BaseInput
        v-model="form.assignedUser"
        label="Ответственное лицо"
        placeholder="ФИО ответственного сотрудника"
        :error="errors.assignedUser"
      />
    </div>

    <!-- Category Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseSelect
        v-model="form.category"
        label="Категория жалобы"
        :options="categoryOptions"
        :error="errors.category"
        required
        @change="onCategoryChange"
      />
      
      <BaseSelect
        v-model="form.subcategory"
        label="Подкатегория"
        :options="subcategoryOptions"
        :error="errors.subcategory"
        :disabled="!form.category"
      />
    </div>

    <!-- Status and Priority -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseSelect
        v-model="form.status"
        label="Статус"
        :options="statusOptions"
        :error="errors.status"
        required
      />
      
      <BaseSelect
        v-model="form.priority"
        label="Приоритет"
        :options="priorityOptions"
        :error="errors.priority"
      />
      
      <BaseInput
        v-model="form.deadline"
        label="Срок выполнения"
        type="datetime-local"
        :error="errors.deadline"
        :min="minDeadline"
      />
    </div>

    <!-- Investigation Details -->
    <div v-if="form.status !== 'Зарегистрировано'" class="space-y-4">
      <h4 class="text-md font-semibold text-gray-900">Детали расследования</h4>
      
      <BaseTextarea
        v-model="form.investigationDetails"
        label="Проведенное расследование"
        rows="4"
        placeholder="Опишите проведенные мероприятия по расследованию жалобы..."
        :error="errors.investigationDetails"
      />
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.investigatedBy"
          label="Расследование проведено"
          placeholder="ФИО ответственного"
          :error="errors.investigatedBy"
        />
        
        <BaseInput
          v-model="form.investigationDate"
          label="Дата расследования"
          type="date"
          :error="errors.investigationDate"
        />
      </div>
    </div>

    <!-- Result Section -->
    <div v-if="['В работе', 'Выполнено', 'Закрыто'].includes(form.status)">
      <h4 class="text-md font-semibold text-gray-900 mb-4">Результат рассмотрения</h4>
      
      <BaseTextarea
        v-model="form.result"
        label="Результат рассмотрения жалобы"
        rows="6"
        placeholder="Опишите результат рассмотрения жалобы, принятые меры..."
        :error="errors.result"
        :required="form.status === 'Выполнено' || form.status === 'Закрыто'"
      />
      
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseSelect
          v-model="form.resultType"
          label="Тип результата"
          :options="resultTypeOptions"
          :error="errors.resultType"
        />
        
        <BaseInput
          v-model="form.completedDate"
          label="Дата завершения"
          type="date"
          :error="errors.completedDate"
          :max="maxCompletedDate"
        />
      </div>
    </div>

    <!-- Corrective Actions -->
    <div v-if="form.status === 'Выполнено' || form.status === 'Закрыто'">
      <h4 class="text-md font-semibold text-gray-900 mb-4">Корректирующие мероприятия</h4>
      
      <BaseTextarea
        v-model="form.correctiveActions"
        label="Принятые корректирующие мероприятия"
        rows="4"
        placeholder="Опишите принятые корректирующие мероприятия для предотвращения подобных случаев..."
        :error="errors.correctiveActions"
      />
      
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.responsiblePerson"
          label="Ответственный за выполнение"
          placeholder="ФИО ответственного"
          :error="errors.responsiblePerson"
        />
        
        <BaseInput
          v-model="form.controlDate"
          label="Дата контроля выполнения"
          type="date"
          :error="errors.controlDate"
          :min="today"
        />
      </div>
    </div>

    <!-- Patient Satisfaction -->
    <div v-if="form.status === 'Закрыто'">
      <h4 class="text-md font-semibold text-gray-900 mb-4">Удовлетворенность заявителя</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseSelect
          v-model="form.patientSatisfaction"
          label="Удовлетворенность результатом"
          :options="satisfactionOptions"
          :error="errors.patientSatisfaction"
        />
        
        <BaseInput
          v-model="form.feedbackDate"
          label="Дата получения обратной связи"
          type="date"
          :error="errors.feedbackDate"
        />
      </div>
      
      <BaseTextarea
        v-model="form.patientFeedback"
        label="Комментарий заявителя"
        rows="3"
        placeholder="Отзыв заявителя о рассмотрении жалобы..."
        :error="errors.patientFeedback"
        class="mt-4"
      />
    </div>

    <!-- Additional Documents -->
    <div class="space-y-4">
      <h4 class="text-md font-semibold text-gray-900">Дополнительные документы</h4>
      
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <div class="mt-4">
            <label for="file-upload" class="cursor-pointer">
              <span class="mt-2 block text-sm font-medium text-gray-900">
                Загрузить документы
              </span>
              <span class="mt-1 block text-sm text-gray-500">
                PDF, DOC, DOCX до 10 МБ
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                class="sr-only"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                @change="handleFileUpload"
              />
            </label>
          </div>
        </div>
      </div>
      
      <!-- Uploaded Files List -->
      <div v-if="uploadedFiles.length > 0" class="space-y-2">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-900">{{ file.name }}</span>
            <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
          </div>
          <button
            type="button"
            @click="removeFile(index)"
            class="text-red-500 hover:text-red-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-between pt-6 border-t border-gray-200">
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Изменения будут сохранены в истории обращения</span>
      </div>
      
      <div class="flex space-x-3">
        <BaseButton
          type="button"
          variant="outline"
          @click="$emit('cancel')"
        >
          Отмена
        </BaseButton>
        
        <BaseButton
          type="button"
          variant="outline"
          @click="saveDraft"
          :disabled="loading"
        >
          Сохранить черновик
        </BaseButton>
        
        <BaseButton
          type="submit"
          variant="primary"
          :loading="loading"
        >
          Сохранить изменения
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDictionariesStore } from '@/stores/dictionaries'
import { formatFileSize } from '@/utils/formatters'
import StatusBadge from '@/components/common/StatusBadge.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  complaint: {
    type: Object,
    required: true
  },
  ticketNumber: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const authStore = useAuthStore()
const dictionariesStore = useDictionariesStore()

// Form data
const form = reactive({
  status: '',
  assignedTo: '',
  assignedUser: '',
  category: '',
  subcategory: '',
  priority: 'medium',
  deadline: '',
  investigationDetails: '',
  investigatedBy: '',
  investigationDate: '',
  result: '',
  resultType: '',
  completedDate: '',
  correctiveActions: '',
  responsiblePerson: '',
  controlDate: '',
  patientSatisfaction: '',
  patientFeedback: '',
  feedbackDate: ''
})

const errors = reactive({})
const uploadedFiles = ref([])

// Computed properties
const today = computed(() => new Date().toISOString().split('T')[0])
const minDeadline = computed(() => new Date().toISOString().slice(0, 16))
const maxCompletedDate = computed(() => today.value)

const organizationOptions = computed(() =>
  dictionariesStore.dictionaries.organizations.map(org => ({ label: org, value: org }))
)

const categoryOptions = computed(() =>
  dictionariesStore.dictionaries.complaintCategories.map(cat => ({ label: cat, value: cat }))
)

const subcategoryOptions = computed(() => {
  if (!form.category) return []
  const subcategories = dictionariesStore.dictionaries.complaintSubcategories[form.category] || []
  return subcategories.map(sub => ({ label: sub, value: sub }))
})

const statusOptions = computed(() => {
  const userRole = authStore.userRole
  const allStatuses = [
    { label: 'Зарегистрировано', value: 'Зарегистрировано' },
    { label: 'Назначено', value: 'Назначено' },
    { label: 'В работе', value: 'В работе' },
    { label: 'Выполнено', value: 'Выполнено' },
    { label: 'Закрыто', value: 'Закрыто' },
    { label: 'Отозвано', value: 'Отозвано' }
  ]
  
  // Filter statuses based on user role
  if (userRole === 'dispatcher') {
    return allStatuses.filter(status => 
      ['Зарегистрировано', 'Назначено', 'Отозвано'].includes(status.value)
    )
  }
  
  if (userRole === 'pmsp') {
    return allStatuses.filter(status => 
      ['Назначено', 'В работе', 'Выполнено'].includes(status.value)
    )
  }
  
  return allStatuses
})

const priorityOptions = [
  { label: 'Низкий', value: 'low' },
  { label: 'Средний', value: 'medium' },
  { label: 'Высокий', value: 'high' },
  { label: 'Критический', value: 'critical' }
]

const resultTypeOptions = [
  { label: 'Жалоба обоснована', value: 'justified' },
  { label: 'Жалоба частично обоснована', value: 'partially_justified' },
  { label: 'Жалоба необоснована', value: 'unjustified' },
  { label: 'Требует дополнительного рассмотрения', value: 'requires_review' }
]

const satisfactionOptions = [
  { label: 'Полностью удовлетворен', value: 'fully_satisfied' },
  { label: 'Частично удовлетворен', value: 'partially_satisfied' },
  { label: 'Не удовлетворен', value: 'not_satisfied' },
  { label: 'Без ответа', value: 'no_response' }
]

// Methods
const handleSubmit = () => {
  errors.value = {}
  
  if (validateForm()) {
    const changes = getChanges()
    emit('submit', { ...form, changes, uploadedFiles: uploadedFiles.value })
  }
}

const validateForm = () => {
  let isValid = true
  
  if (!form.status) {
    errors.status = 'Статус обязателен'
    isValid = false
  }
  
  if (!form.assignedTo) {
    errors.assignedTo = 'Организация обязательна'
    isValid = false
  }
  
  if (!form.category) {
    errors.category = 'Категория обязательна'
    isValid = false
  }
  
  if ((form.status === 'Выполнено' || form.status === 'Закрыто') && !form.result) {
    errors.result = 'Результат рассмотрения обязателен'
    isValid = false
  }
  
  return isValid
}

const getChanges = () => {
  const changes = []
  const original = props.complaint
  
  Object.keys(form).forEach(key => {
    if (form[key] !== original[key]) {
      changes.push({
        field: key,
        oldValue: original[key] || '',
        newValue: form[key] || ''
      })
    }
  })
  
  return changes
}

const onCategoryChange = () => {
  form.subcategory = '' // Reset subcategory when category changes
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      window.showToast(`Файл ${file.name} превышает максимальный размер 10 МБ`, 'error')
      return
    }
    
    uploadedFiles.value.push(file)
  })
  
  // Clear input
  event.target.value = ''
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const saveDraft = () => {
  try {
    const draftData = { ...form, uploadedFiles: uploadedFiles.value }
    localStorage.setItem(`complaint-draft-${props.ticketNumber}`, JSON.stringify(draftData))
    window.showToast('Черновик сохранен', 'success')
  } catch (error) {
    console.log(error);
    
    window.showToast('Ошибка сохранения черновика', 'error')
  }
}

const loadDraft = () => {
  try {
    const draftData = localStorage.getItem(`complaint-draft-${props.ticketNumber}`)
    if (draftData) {
      const parsed = JSON.parse(draftData)
      Object.assign(form, parsed)
      uploadedFiles.value = parsed.uploadedFiles || []
    }
  } catch (error) {
    console.error('Error loading draft:', error)
  }
}

// Initialize form with complaint data
const initializeForm = () => {
  Object.assign(form, props.complaint)
  
  // Load draft if exists
  loadDraft()
}

// Watchers
watch(() => props.complaint, initializeForm, { immediate: true })

onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
/* File upload area hover effect */
.border-dashed:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

/* Form section spacing */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Custom file input styling */
input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>