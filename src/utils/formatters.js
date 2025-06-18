
/**
 * Форматирование даты
 * @param {string|Date} date - Дата для форматирования
 * @param {string} locale - Локаль (по умолчанию 'ru-RU')
 * @returns {string} Отформатированная дата
 */
export function formatDate(date, locale = 'ru-RU') {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Форматирование даты и времени
 * @param {string|Date} date - Дата для форматирования
 * @param {string} locale - Локаль (по умолчанию 'ru-RU')
 * @returns {string} Отформатированная дата и время
 */
export function formatDateTime(date, locale = 'ru-RU') {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }
    
    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return ''
  }
}

/**
 * Форматирование времени
 * @param {string|Date} date - Дата для форматирования времени
 * @param {string} locale - Локаль (по умолчанию 'ru-RU')
 * @returns {string} Отформатированное время
 */
export function formatTime(date, locale = 'ru-RU') {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }
    
    return dateObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return ''
  }
}

/**
 * Форматирование номера телефона
 * @param {string} phone - Номер телефона
 * @returns {string} Отформатированный номер телефона
 */
export function formatPhone(phone) {
  if (!phone) return ''
  
  // Удаляем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '')
  
  // Форматирование для казахстанских номеров
  if (cleaned.startsWith('7') && cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
  }
  
  // Форматирование для российских номеров
  if (cleaned.startsWith('8') && cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
  }
  
  // Если номер не подходит под стандартные форматы, возвращаем как есть
  return phone
}

/**
 * Форматирование ИИН
 * @param {string} iin - ИИН
 * @returns {string} Отформатированный ИИН
 */
export function formatIIN(iin) {
  if (!iin) return ''
  
  const cleaned = iin.replace(/\D/g, '')
  
  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 6)} ${cleaned.slice(6)}`
  }
  
  return iin
}

/**
 * Форматирование денежных сумм
 * @param {number} amount - Сумма
 * @param {string} currency - Валюта (по умолчанию 'KZT')
 * @param {string} locale - Локаль (по умолчанию 'ru-RU')
 * @returns {string} Отформатированная сумма
 */
export function formatCurrency(amount, currency = 'KZT', locale = 'ru-RU') {
  if (amount === null || amount === undefined) return ''
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return amount.toString()
  }
}

/**
 * Форматирование чисел
 * @param {number} number - Число
 * @param {string} locale - Локаль (по умолчанию 'ru-RU')
 * @returns {string} Отформатированное число
 */
export function formatNumber(number, locale = 'ru-RU') {
  if (number === null || number === undefined) return ''
  
  try {
    return new Intl.NumberFormat(locale).format(number)
  } catch (error) {
    console.error('Error formatting number:', error)
    return number.toString()
  }
}

/**
 * Форматирование относительного времени (назад)
 * @param {string|Date} date - Дата
 * @param {string} locale - Локаль (по умолчанию 'ru-RU')
 * @returns {string} Относительное время
 */
export function formatRelativeTime(date, locale = 'ru-RU') {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now - dateObj) / 1000)
    
    // Менее минуты
    if (diffInSeconds < 60) {
      return 'только что'
    }
    
    // Менее часа
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} мин назад`
    }
    
    // Менее дня
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ч назад`
    }
    
    // Менее недели
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} дн назад`
    }
    
    // Более недели - показываем дату
    return formatDate(dateObj, locale)
    
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return formatDate(date, locale)
  }
}

/**
 * Форматирование размера файла
 * @param {number} bytes - Размер в байтах
 * @param {number} decimals - Количество знаков после запятой
 * @returns {string} Отформатированный размер
 */
export function formatFileSize(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Байт'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Форматирование процентов
 * @param {number} value - Значение (от 0 до 1 или от 0 до 100)
 * @param {boolean} isDecimal - Является ли значение десятичным (0-1) или процентным (0-100)
 * @param {number} decimals - Количество знаков после запятой
 * @returns {string} Отформатированный процент
 */
export function formatPercent(value, isDecimal = true, decimals = 1) {
  if (value === null || value === undefined) return ''
  
  const percentage = isDecimal ? value * 100 : value
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Форматирование продолжительности времени
 * @param {number} seconds - Продолжительность в секундах
 * @returns {string} Отформатированная продолжительность
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0 сек'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  const parts = []
  
  if (hours > 0) {
    parts.push(`${hours} ч`)
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} мин`)
  }
  
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} сек`)
  }
  
  return parts.join(' ')
}

/**
 * Склонение слов в зависимости от числа
 * @param {number} count - Количество
 * @param {string[]} forms - Формы слова [1, 2-4, 5+]
 * @returns {string} Правильная форма слова
 */
export function pluralize(count, forms) {
  if (!Array.isArray(forms) || forms.length !== 3) {
    console.error('pluralize: forms must be an array of 3 elements')
    return forms[0] || ''
  }
  
  const n = Math.abs(count) % 100
  const n1 = n % 10
  
  if (n > 10 && n < 20) {
    return forms[2]
  }
  
  if (n1 > 1 && n1 < 5) {
    return forms[1]
  }
  
  if (n1 === 1) {
    return forms[0]
  }
  
  return forms[2]
}

/**
 * Форматирование текста с ограничением длины
 * @param {string} text - Исходный текст
 * @param {number} maxLength - Максимальная длина
 * @param {string} suffix - Суффикс для обрезанного текста
 * @returns {string} Обрезанный текст
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text || text.length <= maxLength) return text || ''
  
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Капитализация первой буквы
 * @param {string} str - Строка
 * @returns {string} Строка с заглавной первой буквой
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Маскирование чувствительных данных
 * @param {string} value - Значение для маскирования
 * @param {number} visibleStart - Количество видимых символов в начале
 * @param {number} visibleEnd - Количество видимых символов в конце
 * @param {string} maskChar - Символ маскирования
 * @returns {string} Замаскированное значение
 */
export function maskSensitiveData(value, visibleStart = 3, visibleEnd = 3, maskChar = '*') {
  if (!value || value.length <= visibleStart + visibleEnd) {
    return value
  }
  
  const start = value.substring(0, visibleStart)
  const end = value.substring(value.length - visibleEnd)
  const maskLength = value.length - visibleStart - visibleEnd
  const mask = maskChar.repeat(maskLength)
  
  return start + mask + end
}

// Экспорт всех функций как объект для удобства
export const formatters = {
  formatDate,
  formatDateTime,
  formatTime,
  formatPhone,
  formatIIN,
  formatCurrency,
  formatNumber,
  formatRelativeTime,
  formatFileSize,
  formatPercent,
  formatDuration,
  pluralize,
  truncateText,
  capitalize,
  maskSensitiveData
}

// Экспорт по умолчанию
export default formatters
