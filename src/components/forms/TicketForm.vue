<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Раздел "Контакт" -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        Контакт
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Номер телефона -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Номер телефона <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.phone"
            type="tel"
            required
            placeholder="+7 (___) ___-__-__"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @blur="searchExistingContact"
          />
        </div>

        <!-- ФИО -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ФИО <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.fullName"
            type="text"
            required
            placeholder="Иванов Иван Иванович или АНОНИМНО"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- ИИН -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ИИН</label>
          <input
            v-model="formData.iin"
            type="text"
            maxlength="12"
            pattern="[0-9]{12}"
            placeholder="123456789012"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="validateIIN"
          />
          <p v-if="iinError" class="text-red-500 text-xs mt-1">{{ iinError }}</p>
        </div>

        <!-- Дата рождения -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
          <input
            v-model="formData.birthDate"
            type="date"
            :max="today"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Пол -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пол</label>
          <select
            v-model="formData.gender"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>

        <!-- Адрес проживания -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Адрес проживания</label>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              v-model="formData.address.district"
              type="text"
              placeholder="Микрорайон"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              v-model="formData.address.street"
              type="text"
              placeholder="Улица"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              v-model="formData.address.house"
              type="text"
              placeholder="Дом"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              v-model="formData.address.apartment"
              type="text"
              placeholder="Квартира"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Раздел "Регистрация обращения" -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Регистрация обращения
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Город -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Город <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.city"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="onCityChange"
          >
            <option value="">Выберите город</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>

        <!-- Район -->
        <div v-if="showDistrict">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Район <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.district"
            :required="formData.city === 'Алматы'"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите район</option>
            <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
          </select>
        </div>

        <!-- ГП (Городская поликлиника) -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ГП (Городская поликлиника) <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.clinic"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите поликлинику</option>
            <option v-for="clinic in filteredClinics" :key="clinic" :value="clinic">{{ clinic }}</option>
          </select>
        </div>

        <!-- Дата обращения (автозаполнение) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Дата обращения</label>
          <input
            :value="currentDateTime"
            type="text"
            readonly
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
          />
        </div>

        <!-- ФИО сотрудника ТМЦ (автозаполнение) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ФИО сотрудника ТМЦ</label>
          <input
            :value="currentUser?.fullName || ''"
            type="text"
            readonly
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
          />
        </div>

        <!-- Тип звонка -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Тип звонка <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.callType"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="onCallTypeChange"
          >
            <option value="">Выберите тип звонка</option>
            <option v-for="type in callTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
        </div>

        <!-- Подтип звонка -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Подтип звонка <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.callSubtype"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="!formData.callType"
          >
            <option value="">Выберите подтип звонка</option>
            <option v-for="subtype in callSubtypes" :key="subtype.value" :value="subtype.value">{{ subtype.label }}</option>
          </select>
        </div>

        <!-- Причина обращения -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Причина обращения <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.reason"
            required
            rows="3"
            maxlength="1000"
            placeholder="Краткое описание сути обращения..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ formData.reason.length }}/1000 символов</p>
        </div>

        <!-- Источник обращения -->
        <div>
          <label class="flex items-center space-x-2">
            <input
              v-model="formData.isPatronage"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700">Патронаж</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Раздел "Жалоба" (показывается только если тип = жалоба) -->
    <div v-if="formData.callType === 'complaint'" class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        Жалоба
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Статус жалобы -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Статус жалобы <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.complaintStatus"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите статус</option>
            <option v-for="status in complaintStatuses" :key="status.value" :value="status.value">{{ status.label }}</option>
          </select>
        </div>

        <!-- Кому передано -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Кому передано <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.assignedTo"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите получателя</option>
            <option value="second_line">Вторая линия (ПМСП)</option>
            <option value="third_line">Третья линия (УОЗ)</option>
          </select>
        </div>

        <!-- Категория жалобы -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Категория жалобы <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.complaintCategory"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="onComplaintCategoryChange"
          >
            <option value="">Выберите категорию</option>
            <option v-for="category in complaintCategories" :key="category.value" :value="category.value">{{ category.label }}</option>
          </select>
        </div>

        <!-- Подкатегория жалобы -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Подкатегория жалобы <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.complaintSubcategory"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="!formData.complaintCategory"
          >
            <option value="">Выберите подкатегорию</option>
            <option v-for="subcategory in complaintSubcategories" :key="subcategory.value" :value="subcategory.value">{{ subcategory.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="flex justify-between items-center pt-6 border-t border-gray-200">
      <div class="flex space-x-3">
        <BaseButton
          type="button"
          variant="outline"
          @click="saveDraft"
          :disabled="loading"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 0V4a2 2 0 00-2-2H9a2 2 0 00-2 2v3m1 0h4"></path>
          </svg>
          Сохранить черновик
        </BaseButton>
        
        <BaseButton
          type="button"
          variant="outline"
          @click="cancel"
          :disabled="loading"
        >
          Отменить
        </BaseButton>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        :loading="loading"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Создать обращение
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

// const props = defineProps({
//   loading: {
//     type: Boolean,
//     default: false
//   }
// })

const emit = defineEmits(['submit', 'cancel', 'save-draft'])

const authStore = useAuthStore()

// Реактивные данные формы
const formData = reactive({
  // Контакт
  phone: '',
  fullName: '',
  iin: '',
  birthDate: '',
  gender: '',
  address: {
    district: '',
    street: '',
    house: '',
    apartment: ''
  },
  
  // Регистрация обращения
  city: '',
  district: '',
  clinic: '',
  callType: '',
  callSubtype: '',
  reason: '',
  isPatronage: false,
  
  // Жалоба
  complaintStatus: '',
  assignedTo: '',
  complaintCategory: '',
  complaintSubcategory: ''
})

const iinError = ref('')
const today = new Date().toISOString().split('T')[0]

// Справочники
const cities = [
  'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Есик', 'Жаркент', 
  'Жезказган', 'Караганда', 'Каскелен', 'Талгар', 'Талдыкорган', 
  'Тараз', 'Туркестан', 'Уральск', 'Ушарал'
]

const districts = [
  'Алатауский', 'Алмалинский', 'Ауэзовский', 'Бостандыкский', 
  'Жетысуский', 'Медеуский', 'Наурызбайский', 'Турксибский'
]

const clinics = [
  'АО ЦКБ', 'Алатау', 'ГП №1', 'ГП №2', 'ГП №3', 'ГП №4', 'ГП №5', 
  'ГП №7', 'ГП №8', 'ГП №9', 'ГП №10', 'ГП №11', 'ГП №12', 'ГП №13', 
  'ГП №14', 'ГП №15', 'ГП №16', 'ГП №17', 'ГП №18', 'ГП №19', 'ГП №20',
  'ГП №21', 'ГП №22', 'ГП №23', 'ГП №24', 'ГП №25', 'ГП №26', 'ГП №27',
  'ГП №28', 'ГП №29', 'ГП №30', 'ГП №32', 'ГП №36', 'ГП №55', 'ГП ВОВ',
  'ПМСП Кулагер', 'ПМСП Алмалинского района', 'ПМСП Медеуского района',
  'Университет Асфендиярова', 'Центр урологии Джарбусынова'
]

const callTypes = [
  { value: 'medical_consultation', label: 'Медицинская консультация' },
  { value: 'osms_gobmp', label: 'ОСМС, ГОБМП' },
  { value: 'reference_info', label: 'Справочная информация' },
  { value: 'gratitude', label: 'Благодарность' },
  { value: 'vaccination', label: 'Вакцинация' },
  { value: 'non_target_call', label: 'Нецелевой звонок' },
  { value: 'organizational', label: 'Организационные вопросы' },
  { value: 'complaint', label: 'Жалоба' },
  { value: 'other', label: 'Прочее' }
]

const callSubtypesMap = {
  medical_consultation: [
    { value: 'symptoms', label: 'По симптомам (температура, кашель, боль и т.д.)' },
    { value: 'medications', label: 'По приёму препаратов' },
    { value: 'test_results', label: 'По результатам анализов' },
    { value: 'treatment', label: 'По назначенному лечению' },
    { value: 'chronic_disease', label: 'Консультация по хроническому заболеванию' },
    { value: 'pregnancy_patronage', label: 'По патронажу беременных' },
    { value: 'child_patronage', label: 'По патронажу детей' }
  ],
  osms_gobmp: [
    { value: 'attachment_check', label: 'Проверка прикрепления' },
    { value: 'services_info', label: 'Уточнение услуг, входящих в ГОБМП / ОСМС' },
    { value: 'free_help_procedure', label: 'Порядок получения бесплатной помощи' },
    { value: 'insurance_questions', label: 'Вопросы по страховым отчислениям / задолженности' }
  ],
  // Добавить остальные подтипы...
}

const complaintStatuses = [
  { value: 'assigned', label: 'Назначено' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'rejected', label: 'Отказано' },
  { value: 'completed', label: 'Исполнено' },
  { value: 'confirmed', label: 'Подтверждено' },
  { value: 'closed', label: 'Закрыто' },
  { value: 'closed_by_initiator', label: 'Закрыто инициатором' },
  { value: 'pending', label: 'В ожидании' },
  { value: 'noted', label: 'Принято к сведению' },
  { value: 'withdrawn', label: 'Жалоба отозвана' }
]

const complaintCategories = [
  { value: 'organizational_administrative', label: 'Организационно-административные' },
  { value: 'medical_quality', label: 'Качество медицинской помощи' },
  { value: 'ethics_behavior', label: 'Этика и поведение персонала' },
  { value: 'infrastructure', label: 'Инфраструктура и материально-техническое обеспечение' },
  { value: 'digitalization', label: 'Цифровизация и ИТ-сервисы' },
  { value: 'financial_pharmaceutical', label: 'Финансовые и фармацевтические вопросы' },
  { value: 'prevention_patronage', label: 'Профилактика и патронаж' },
  { value: 'emergency_urgent', label: 'Экстренная и неотложная помощь' },
  { value: 'legal', label: 'Юридические и правовые вопросы' }
]

const complaintSubcategoriesMap = {
  organizational_administrative: [
    { value: 'long_wait', label: 'Долгое ожидание приёма к врачу' },
    { value: 'appointment_difficulties', label: 'Трудности с записью на приём' },
    { value: 'staff_shortage', label: 'Отсутствие врачей / дефицит кадров' },
    { value: 'doctor_access', label: 'Невозможность попасть к закреплённому врачу' },
    { value: 'attachment_issues', label: 'Сложности с прикреплением к ПМСП' }
  ],
  // Добавить остальные подкатегории...
}

// Вычисляемые свойства
const currentUser = computed(() => authStore.user)
const currentDateTime = computed(() => {
  return new Date().toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const showDistrict = computed(() => formData.city === 'Алматы')
const filteredClinics = computed(() => {
  // В реальном приложении здесь была бы фильтрация по городу
  return clinics
})

const callSubtypes = computed(() => {
  return callSubtypesMap[formData.callType] || []
})

const complaintSubcategories = computed(() => {
  return complaintSubcategoriesMap[formData.complaintCategory] || []
})

// Методы
const validateIIN = () => {
  if (!formData.iin) {
    iinError.value = ''
    return
  }
  
  if (formData.iin.length !== 12) {
    iinError.value = 'ИИН должен содержать 12 цифр'
    return
  }
  
  // Простая проверка контрольной суммы ИИН
  const digits = formData.iin.split('').map(Number)
  const weights1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const weights2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]
  
  let sum1 = 0
  for (let i = 0; i < 11; i++) {
    sum1 += digits[i] * weights1[i]
  }
  
  let checkDigit = sum1 % 11
  if (checkDigit === 10) {
    let sum2 = 0
    for (let i = 0; i < 11; i++) {
      sum2 += digits[i] * weights2[i]
    }
    checkDigit = sum2 % 11
  }
  
  if (checkDigit !== digits[11]) {
    iinError.value = 'Неверная контрольная сумма ИИН'
  } else {
    iinError.value = ''
  }
}

const searchExistingContact = async () => {
  if (!formData.phone) return
  
  try {
    // Здесь должен быть запрос к API для поиска существующего контакта
    // const existingContact = await api.searchContact(formData.phone)
    // if (existingContact) {
    //   Object.assign(formData, existingContact)
    // }
    console.log('Поиск существующего контакта по номеру:', formData.phone)
  } catch (error) {
    console.error('Ошибка поиска контакта:', error)
  }
}

const onCityChange = () => {
  formData.district = ''
  formData.clinic = ''
}

const onCallTypeChange = () => {
  formData.callSubtype = ''
  if (formData.callType !== 'complaint') {
    // Очищаем поля жалобы если тип не "жалоба"
    formData.complaintStatus = ''
    formData.assignedTo = ''
    formData.complaintCategory = ''
    formData.complaintSubcategory = ''
  }
}

const onComplaintCategoryChange = () => {
  formData.complaintSubcategory = ''
}

const loadDraft = () => {
  try {
    const draft = localStorage.getItem('ticket-draft')
    if (draft) {
      const draftData = JSON.parse(draft)
      Object.assign(formData, draftData)
    }
  } catch (error) {
    console.error('Ошибка загрузки черновика:', error)
  }
}

const saveDraft = () => {
  emit('save-draft', { ...formData })
}

const cancel = () => {
  emit('cancel')
}

const handleSubmit = () => {
  // Валидация формы
  if (!validateForm()) {
    return
  }
  
  // Подготовка данных для отправки
  const submitData = {
    // Контакт
    contact: {
      phone: formData.phone,
      fullName: formData.fullName,
      iin: formData.iin || null,
      birthDate: formData.birthDate || null,
      gender: formData.gender || null,
      address: {
        district: formData.address.district || null,
        street: formData.address.street || null,
        house: formData.address.house || null,
        apartment: formData.address.apartment || null
      }
    },
    
    // Регистрация обращения
    registration: {
      city: formData.city,
      district: formData.district || null,
      clinic: formData.clinic,
      createdAt: new Date().toISOString(),
      employeeName: currentUser.value?.fullName,
      callType: formData.callType,
      callSubtype: formData.callSubtype,
      reason: formData.reason,
      isPatronage: formData.isPatronage
    },
    
    // Жалоба (если применимо)
    complaint: formData.callType === 'complaint' ? {
      status: formData.complaintStatus,
      assignedTo: formData.assignedTo,
      category: formData.complaintCategory,
      subcategory: formData.complaintSubcategory
    } : null
  }
  
  emit('submit', submitData)
}

const validateForm = () => {
  // Базовая валидация обязательных полей
  const requiredFields = [
    { field: 'phone', message: 'Номер телефона обязателен' },
    { field: 'fullName', message: 'ФИО обязательно' },
    { field: 'city', message: 'Город обязателен' },
    { field: 'clinic', message: 'ГП обязательна' },
    { field: 'callType', message: 'Тип звонка обязателен' },
    { field: 'callSubtype', message: 'Подтип звонка обязателен' },
    { field: 'reason', message: 'Причина обращения обязательна' }
  ]
  
  // Дополнительная валидация для Алматы
  if (formData.city === 'Алматы') {
    requiredFields.push({ field: 'district', message: 'Район обязателен для г. Алматы' })
  }
  
  // Валидация полей жалобы
  if (formData.callType === 'complaint') {
    requiredFields.push(
      { field: 'complaintStatus', message: 'Статус жалобы обязателен' },
      { field: 'assignedTo', message: 'Получатель жалобы обязателен' },
      { field: 'complaintCategory', message: 'Категория жалобы обязательна' },
      { field: 'complaintSubcategory', message: 'Подкатегория жалобы обязательна' }
    )
  }
  
  for (const { field, message } of requiredFields) {
    if (!formData[field]) {
      window.showToast(message, 'error')
      return false
    }
  }
  
  // Валидация ИИН если заполнен
  if (formData.iin && iinError.value) {
    window.showToast(iinError.value, 'error')
    return false
  }
  
  return true
}

// Автозаполнение из URL параметров (для интеграции с Bright Pattern)
const fillFromUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const phone = urlParams.get('phone')
  
  if (phone) {
    formData.phone = phone
    searchExistingContact()
  }
}

// Watchers
watch(() => formData.iin, validateIIN)

// Lifecycle
onMounted(() => {
  loadDraft()
  fillFromUrlParams()
})
</script>

<style scoped>
/* Дополнительные стили для формы */
.grid {
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    gap: 1.5rem;
  }
}

/* Стили для обязательных полей */
.text-red-500 {
  color: #ef4444;
}

/* Анимация для появления раздела жалобы */
.bg-white {
  transition: all 0.3s ease;
}

/* Стили для кнопок */
.BaseButton {
  transition: all 0.2s ease;
}

.BaseButton:hover {
  transform: translateY(-1px);
}

/* Стили для disabled элементов */
select:disabled,
input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* Стили для валидации */
.border-red-300 {
  border-color: #fca5a5;
}

.focus\:ring-red-500:focus {
  --tw-ring-color: #ef4444;
}

.focus\:border-red-500:focus {
  border-color: #ef4444;
}
</style>