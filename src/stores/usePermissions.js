import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export const usePermissions = () => {
  const authStore = useAuthStore()

  const hasPermission = computed(() => (permission) => {
    return authStore.hasPermission(permission)
  })

  const hasAnyPermission = computed(() => (permissions) => {
    return permissions.some(permission => authStore.hasPermission(permission))
  })

  const hasAllPermissions = computed(() => (permissions) => {
    return permissions.every(permission => authStore.hasPermission(permission))
  })

  const canViewTicket = computed(() => (ticket) => {
    if (!ticket || !authStore.user) return false

    const userRole = authStore.user.role
    const userOrg = authStore.user.organization

    switch (userRole) {
      case 'dispatcher':
        return ticket.createdBy === authStore.user.name
      
      case 'senior_doctor':
        return true
      
      case 'pmsp':
        return ticket.organization === userOrg
      
      case 'uoz':
        return true // UOZ can view all tickets
      
      default:
        return false
    }
  })

  const canEditSection = computed(() => (section, ticket) => {
    if (!authStore.user || !ticket) return false

    const userRole = authStore.user.role

    switch (section) {
      case 'contact':
      case 'registration':
        return userRole === 'senior_doctor' || 
               (userRole === 'dispatcher' && ticket.createdBy === authStore.user.name && 
                (!ticket.complaint || ticket.complaint.status === 'Назначено'))
      
      case 'complaint':
        return userRole === 'senior_doctor' ||
               (userRole === 'pmsp' && ticket.organization === authStore.user.organization) ||
               (userRole === 'uoz' && ticket.complaint?.assignedTo === 'УОЗ')
      
      default:
        return false
    }
  })

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canViewTicket,
    canEditSection
  }
}
