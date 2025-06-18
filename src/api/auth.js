import { apiClient } from './client'

// Mock API implementation for development
const mockAuthApi = {
  async login(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock users database
    const mockUsers = {
      'admin@example.com': {
        id: 1,
        email: 'admin@example.com',
        name: 'Системный администратор',
        fullName: 'Иванов Иван Иванович',
        role: 'admin',
        organization: 'УОЗ г. Алматы',
        permissions: [],
        phone: '+7 700 000 0001'
      },
      'dispatcher@example.com': {
        id: 2,
        email: 'dispatcher@example.com',
        name: 'Диспетчер ТМЦ',
        fullName: 'Петрова Анна Сергеевна',
        role: 'dispatcher',
        organization: 'ТМЦ г. Алматы',
        permissions: [],
        phone: '+7 700 000 0002'
      },
      'doctor@example.com': {
        id: 3,
        email: 'doctor@example.com',
        name: 'Старший врач',
        fullName: 'Сидоров Петр Александрович',
        role: 'senior_doctor',
        organization: 'ТМЦ г. Алматы',
        permissions: [],
        phone: '+7 700 000 0003'
      },
      'pmsp@example.com': {
        id: 4,
        email: 'pmsp@example.com',
        name: 'Сотрудник ПМСП',
        fullName: 'Козлова Мария Викторовна',
        role: 'pmsp',
        organization: 'ГП №15',
        permissions: [],
        phone: '+7 700 000 0004'
      },
      'uoz@example.com': {
        id: 5,
        email: 'uoz@example.com',
        name: 'Сотрудник УОЗ',
        fullName: 'Назарбаев Асылбек Маратович',
        role: 'uoz',
        organization: 'УОЗ г. Алматы',
        permissions: [],
        phone: '+7 700 000 0005'
      }
    }
    
    const user = mockUsers[credentials.email]
    
    if (!user || credentials.password !== 'password') {
      throw new Error('Неверный email или пароль')
    }
    
    return {
      success: true,
      data: {
        user,
        token: `mock_token_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_token_${user.id}_${Date.now()}`
      }
    }
  },
  
  async logout() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true }
  },
  
  async refreshToken() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: {
        token: `mock_refreshed_token_${Date.now()}`
      }
    }
  },
  
  async verifyToken() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: { valid: true }
    }
  },
  
  async updateProfile(data) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      success: true,
      data
    }
  },
  
  async changePassword(passwordData) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (passwordData.currentPassword !== 'password') {
      throw new Error('Неверный текущий пароль')
    }
    
    if (passwordData.newPassword.length < 6) {
      throw new Error('Новый пароль должен содержать не менее 6 символов')
    }
    
    return { success: true }
  },
  
  async resetPassword(email) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (!email || !email.includes('@')) {
      throw new Error('Неверный email адрес')
    }
    
    return {
      success: true,
      message: 'Инструкции по восстановлению пароля отправлены на указанный email'
    }
  }
}

// Real API implementation using axios
const realAuthApi = {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },
  
  async logout() {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },
  
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data
  },
  
  async verifyToken() {
    const response = await apiClient.get('/auth/verify')
    return response.data
  },
  
  async updateProfile(data) {
    const response = await apiClient.put('/auth/profile', data)
    return response.data
  },
  
  async changePassword(passwordData) {
    const response = await apiClient.put('/auth/change-password', passwordData)
    return response.data
  },
  
  async resetPassword(email) {
    const response = await apiClient.post('/auth/reset-password', { email })
    return response.data
  }
}

// Export the appropriate API based on environment
export const authApi = import.meta.env.DEV ? mockAuthApi : realAuthApi