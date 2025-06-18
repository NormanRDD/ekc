export const validatePhone = (phone) => {
  // Kazakhstan phone number validation
  const phoneRegex = /^(\+7|7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/

  return phoneRegex.test(phone?.replace(/\s/g, ''))
}

export const validateIIN = (iin) => {
  if (!iin || iin.length !== 12) return false

  // Check if all characters are digits
  if (!/^\d{12}$/.test(iin)) return false

  // Validate control sum
  const weights1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const weights2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]

  const digits = iin.split('').map(Number)

  let sum1 = 0
  for (let i = 0; i < 11; i++) {
    sum1 += digits[i] * weights1[i]
  }

  let controlDigit = sum1 % 11

  if (controlDigit === 10) {
    let sum2 = 0
    for (let i = 0; i < 11; i++) {
      sum2 += digits[i] * weights2[i]
    }
    controlDigit = sum2 % 11
  }

  return controlDigit === digits[11]
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength
}

export const validateMinLength = (value, minLength) => {
  return !value || value.length >= minLength
}

export const validateDate = (date) => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj) && dateObj <= new Date()
}

// ===== src/utils/formatters.js =====
export const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return ''

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Format as +7 (XXX) XXX-XX-XX
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
  }

  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`
  }

  return phone
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}ч ${minutes}м ${secs}с`
  }
  if (minutes > 0) {
    return `${minutes}м ${secs}с`
  }
  return `${secs}с`
}

export const formatTicketNumber = (number) => {
  if (!number) return ''
  return `#${number}`
}

// ===== src/composables/useForm.js =====
import { reactive, computed } from 'vue'

export const useForm = (initialData = {}, validationRules = {}) => {
  const form = reactive({ ...initialData })
  const errors = reactive({})
  const touched = reactive({})

  const isValid = computed(() => {
    return Object.keys(validationRules).every((field) => {
      return !errors[field]
    })
  })

  const isDirty = computed(() => {
    return Object.keys(touched).some((field) => touched[field])
  })

  const validate = (field) => {
    if (!validationRules[field]) return true

    const rules = validationRules[field]
    const value = form[field]

    for (const rule of rules) {
      const result = rule.validator(value)
      if (!result) {
        errors[field] = rule.message
        return false
      }
    }

    delete errors[field]
    return true
  }

  const validateAll = () => {
    let isFormValid = true

    Object.keys(validationRules).forEach((field) => {
      touched[field] = true
      if (!validate(field)) {
        isFormValid = false
      }
    })

    return isFormValid
  }

  const setFieldValue = (field, value) => {
    form[field] = value
    touched[field] = true
    validate(field)
  }

  const setFieldError = (field, error) => {
    errors[field] = error
  }

  const clearErrors = () => {
    Object.keys(errors).forEach((field) => {
      delete errors[field]
    })
  }

  const reset = () => {
    Object.keys(form).forEach((field) => {
      form[field] = initialData[field] || ''
    })

    Object.keys(errors).forEach((field) => {
      delete errors[field]
    })

    Object.keys(touched).forEach((field) => {
      touched[field] = false
    })
  }

  return {
    form,
    errors,
    touched,
    isValid,
    isDirty,
    validate,
    validateAll,
    setFieldValue,
    setFieldError,
    clearErrors,
    reset,
  }
}
