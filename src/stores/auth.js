import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { router } from '@/router'
import { apiClient } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const refreshToken = ref(localStorage.getItem('refresh_token'))
  const loading = ref(false)
  const loginAttempts = ref(0)
  const lastLoginAttempt = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
  const userRole = computed(() => user.value?.role || null)
  
  const userPermissions = computed(() => user.value?.permissions || [])
  
  const isBlocked = computed(() => {
    if (loginAttempts.value < 3) return false
    
    const lastAttempt = lastLoginAttempt.value
    if (!lastAttempt) return false
    
    const blockDuration = 15 * 60 * 1000 // 15 minutes
    return Date.now() - lastAttempt < blockDuration
  })

  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return user.value.fullName || user.value.name || user.value.email || 'Пользователь'
  })

  const userOrganization = computed(() => user.value?.organization || null)

  // Role-based permissions mapping
  const rolePermissions = {
    'admin': [
      'view_all_tickets',
      'edit_all_tickets',
      'create_ticket',
      'delete_ticket',
      'reports',
      'user_management',
      'system_settings',
      'export_data'
    ],
    'dispatcher': [
      'view_own_tickets',
      'create_ticket',
      'edit_own_tickets',
      'view_reports_basic'
    ],
    'senior_doctor': [
      'view_assigned_tickets',
      'edit_assigned_tickets',
      'view_reports_basic',
      'assign_tickets'
    ],
    'pmsp': [
      'view_organization_tickets',
      'edit_organization_tickets',
      'respond_to_complaints'
    ],
    'uoz': [
      'view_all_tickets',
      'edit_all_tickets',
      'reports',
      'assign_tickets',
      'escalate_tickets'
    ]
  }

  // Actions
  const login = async (credentials) => {
    if (isBlocked.value) {
      throw new Error('Аккаунт временно заблокирован. Попробуйте позже.')
    }

    loading.value = true
    
    try {
      const response = await authApi.login(credentials)
      
      if (response.success) {
        // Set tokens
        token.value = response.data.token
        refreshToken.value = response.data.refreshToken
        user.value = response.data.user
        
        // Store in localStorage
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('refresh_token', refreshToken.value)
        localStorage.setItem('user_data', JSON.stringify(user.value))
        
        // Reset login attempts
        loginAttempts.value = 0
        lastLoginAttempt.value = null
        localStorage.removeItem('login_attempts')
        localStorage.removeItem('last_login_attempt')
        
        // Set default axios auth header for apiClient
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        
        return response.data
      } else {
        throw new Error(response.message || 'Ошибка входа')
      }
    } catch (error) {
      // Track failed login attempts
      loginAttempts.value++
      lastLoginAttempt.value = Date.now()
      localStorage.setItem('login_attempts', loginAttempts.value.toString())
      localStorage.setItem('last_login_attempt', lastLoginAttempt.value.toString())
      
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      // Call logout API if token exists
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with logout even if API fails
    } finally {
      // Clear state
      user.value = null
      token.value = null
      refreshToken.value = null
      
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      
      // Clear axios auth header
      delete apiClient.defaults.headers.common['Authorization']
      
      loading.value = false
      
      // Redirect to login
      if (router) {
        router.push('/login')
      }
    }
  }

  const refreshAuthToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await authApi.refreshToken(refreshToken.value)
      
      if (response.success) {
        token.value = response.data.token
        localStorage.setItem('auth_token', token.value)
        
        // Update axios header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        
        return token.value
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      // Force logout on refresh failure
      await logout()
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    
    try {
      const response = await authApi.updateProfile(profileData)
      
      if (response.success) {
        // Update user data
        user.value = { ...user.value, ...response.data }
        localStorage.setItem('user_data', JSON.stringify(user.value))
        return response.data
      } else {
        throw new Error(response.message || 'Ошибка обновления профиля')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    loading.value = true
    
    try {
      const response = await authApi.changePassword(passwordData)
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || 'Ошибка смены пароля')
      }
    } catch (error) {
      console.error('Password change error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email) => {
    loading.value = true
    
    try {
      const response = await authApi.resetPassword(email)
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || 'Ошибка сброса пароля')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const verifyToken = async () => {
    if (!token.value) return false
    
    try {
      const response = await authApi.verifyToken()
      
      if (response.success && response.data.valid) {
        // Update user data if provided
        if (response.data.user) {
          user.value = response.data.user
          localStorage.setItem('user_data', JSON.stringify(user.value))
        }
        return true
      } else {
        // Token is invalid, try to refresh
        if (refreshToken.value) {
          await refreshAuthToken()
          return true
        } else {
          await logout()
          return false
        }
      }
    } catch (error) {
      console.error('Token verification error:', error)
      await logout()
      return false
    }
  }

  // Permission checking methods
  const hasPermission = (permission) => {
    if (!user.value || !user.value.role) return false
    
    // Admin has all permissions
    if (user.value.role === 'admin') return true
    
    // Check role-based permissions
    const rolePerms = rolePermissions[user.value.role] || []
    if (rolePerms.includes(permission)) return true
    
    // Check user-specific permissions
    const userPerms = userPermissions.value || []
    return userPerms.includes(permission)
  }

  const hasRole = (role) => {
    return userRole.value === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(userRole.value)
  }

  const canAccessRoute = (routeMeta) => {
    if (!routeMeta.requiresAuth) return true
    if (!isAuthenticated.value) return false
    
    if (routeMeta.roles && !hasAnyRole(routeMeta.roles)) return false
    if (routeMeta.permissions && !routeMeta.permissions.every(hasPermission)) return false
    
    return true
  }

  // Initialize store
  const initializeAuth = async () => {
    // Load from localStorage
    const storedToken = localStorage.getItem('auth_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user_data')
    const storedAttempts = localStorage.getItem('login_attempts')
    const storedLastAttempt = localStorage.getItem('last_login_attempt')
    
    if (storedToken) {
      token.value = storedToken
      
      // Set axios header for apiClient
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
    
    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken
    }
    
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('user_data')
      }
    }
    
    if (storedAttempts) {
      loginAttempts.value = parseInt(storedAttempts, 10) || 0
    }
    
    if (storedLastAttempt) {
      lastLoginAttempt.value = parseInt(storedLastAttempt, 10) || null
    }
    
    // Verify token if exists
    if (token.value && user.value) {
      await verifyToken()
    }
  }

  // Auto-refresh token setup
  const setupTokenRefresh = () => {
    // Refresh token 5 minutes before expiry
    const refreshInterval = 25 * 60 * 1000 // 25 minutes
    
    setInterval(async () => {
      if (token.value && refreshToken.value) {
        try {
          await refreshAuthToken()
        } catch (error) {
          console.error('Auto refresh failed:', error)
        }
      }
    }, refreshInterval)
  }

  return {
    // State
    user,
    token,
    loading,
    loginAttempts,
    
    // Computed
    isAuthenticated,
    userRole,
    userPermissions,
    isBlocked,
    userDisplayName,
    userOrganization,
    
    // Actions
    login,
    logout,
    refreshAuthToken,
    updateProfile,
    changePassword,
    resetPassword,
    verifyToken,
    initializeAuth,
    setupTokenRefresh,
    
    // Permission methods
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccessRoute
  }
})