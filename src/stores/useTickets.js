import { computed } from 'vue'
import { useTicketsStore } from '../stores/tickets'
import { useAuthStore } from '../stores/auth'

export const useTickets = () => {
  const ticketsStore = useTicketsStore()
  const authStore = useAuthStore()

  const canEditTicket = computed(() => (ticket) => {
    if (!ticket || !authStore.user) return false

    const userRole = authStore.user.role
    const userOrg = authStore.user.organization

    switch (userRole) {
      case 'dispatcher':
        return ticket.createdBy === authStore.user.name && 
               (!ticket.complaint || ticket.complaint.status === 'Назначено')
      
      case 'senior_doctor':
        return true
      
      case 'pmsp':
        return ticket.organization === userOrg && 
               ticket.registration.callType === 'Жалоба'
      
      case 'uoz':
        return ticket.complaint?.assignedTo === 'УОЗ' && 
               ticket.registration.callType === 'Жалоба'
      
      default:
        return false
    }
  })

  const canWithdrawComplaint = computed(() => (ticket) => {
    if (!ticket?.complaint || !authStore.user) return false

    const userRole = authStore.user.role
    
    return (userRole === 'dispatcher' && ticket.createdBy === authStore.user.name) ||
           (userRole === 'pmsp' && ticket.organization === authStore.user.organization) ||
           (userRole === 'uoz' && ticket.complaint.assignedTo === 'УОЗ')
  })

  const getTicketStatusColor = (status) => {
    const colors = {
      'Новое': 'bg-blue-100 text-blue-800',
      'Назначено': 'bg-purple-100 text-purple-800',
      'В работе': 'bg-yellow-100 text-yellow-800',
      'Отработана': 'bg-green-100 text-green-800',
      'Исполнено': 'bg-green-100 text-green-800',
      'Закрыто': 'bg-gray-100 text-gray-800',
      'Просрочена': 'bg-red-100 text-red-800',
      'Отозвана заявителем': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTicketPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    }
    return colors[priority] || 'text-gray-600'
  }

  const isTicketOverdue = (ticket) => {
    if (!ticket.complaint) return false
    
    const createdDate = new Date(ticket.date)
    const now = new Date()
    const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
    
    // PMSP: 5 calendar days
    if (ticket.complaint.assignedTo !== 'УОЗ' && daysDiff > 5) {
      return true
    }
    
    // UOZ: 7 calendar days after PMSP deadline
    if (ticket.complaint.assignedTo === 'УОЗ' && daysDiff > 7) {
      return true
    }
    
    return false
  }

  const getTimeLeft = (ticket) => {
    if (!ticket.complaint) return null
    
    const createdDate = new Date(ticket.date)
    const now = new Date()
    const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
    
    let deadline = 5 // Default PMSP deadline
    if (ticket.complaint.assignedTo === 'УОЗ') {
      deadline = 7 // UOZ deadline
    }
    
    const daysLeft = deadline - daysDiff
    
    if (daysLeft < 0) {
      return `Просрочено на ${Math.abs(daysLeft)} дн.`
    } else if (daysLeft === 0) {
      return 'Сегодня последний день'
    } else {
      return `Осталось ${daysLeft} дн.`
    }
  }

  return {
    ...ticketsStore,
    canEditTicket,
    canWithdrawComplaint,
    getTicketStatusColor,
    getTicketPriorityColor,
    isTicketOverdue,
    getTimeLeft
  }
}
