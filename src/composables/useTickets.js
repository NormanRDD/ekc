import { computed } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import { useAuthStore } from '@/stores/auth'

export function useTickets() {
  const ticketsStore = useTicketsStore()
  const authStore = useAuthStore()

  // Re-export store state and getters
  const tickets = computed(() => ticketsStore.tickets)
  const pagination = computed(() => ticketsStore.pagination)
  const currentTicket = computed(() => ticketsStore.currentTicket)
  const loading = computed(() => ticketsStore.loading)
  const error = computed(() => ticketsStore.error)
  const totalPages = computed(() => ticketsStore.totalPages)
  const currentPage = computed(() => ticketsStore.currentPage)
  const totalCount = computed(() => ticketsStore.totalCount)
  const filters = computed(() => ticketsStore.filters)

  // Re-export store actions
  const fetchTickets = ticketsStore.fetchTickets
  const getTicket = ticketsStore.getTicket
  const createTicket = ticketsStore.createTicket
  const updateTicket = ticketsStore.updateTicket
  const deleteTicket = ticketsStore.deleteTicket
  const addComment = ticketsStore.addComment
  const setFilters = ticketsStore.setFilters
  const setPage = ticketsStore.setPage

  // Permission-based computed properties
  const canEditTicket = computed(() => {
    return (ticket) => {
      if (!ticket || !authStore.isAuthenticated) return false

      const userRole = authStore.userRole
      //   const userId = authStore.user?.id
      const userOrg = authStore.user?.organization

      // Admin can edit all
      if (userRole === 'admin') return true

      // UOZ can edit all
      if (userRole === 'uoz') return true

      // Senior doctor can edit assigned tickets
      if (userRole === 'senior_doctor') {
        return (
          ticket.complaint?.assignedUser === authStore.user?.name ||
          ticket.complaint?.assignedTo === userOrg
        )
      }

      // Dispatcher can edit own tickets
      if (userRole === 'dispatcher') {
        return ticket.createdBy === authStore.user?.name
      }

      // PMSP can edit tickets for their organization
      if (userRole === 'pmsp') {
        return (
          ticket.registration?.organization === userOrg || ticket.complaint?.assignedTo === userOrg
        )
      }

      return false
    }
  })

  const canWithdrawComplaint = computed(() => {
    return (ticket) => {
      if (!ticket?.complaint || !authStore.isAuthenticated) return false

      const userRole = authStore.userRole

      // Only admin, UOZ, and ticket creator can withdraw
      if (userRole === 'admin' || userRole === 'uoz') return true

      if (userRole === 'dispatcher') {
        return ticket.createdBy === authStore.user?.name
      }

      return false
    }
  })

  const canViewTicket = computed(() => {
    return (ticket) => {
      if (!ticket || !authStore.isAuthenticated) return false

      const userRole = authStore.userRole
      const userOrg = authStore.user?.organization

      // Admin and UOZ can view all
      if (userRole === 'admin' || userRole === 'uoz') return true

      // Senior doctor can view assigned tickets
      if (userRole === 'senior_doctor') {
        return (
          ticket.complaint?.assignedUser === authStore.user?.name ||
          ticket.complaint?.assignedTo === userOrg
        )
      }

      // Dispatcher can view own tickets
      if (userRole === 'dispatcher') {
        return ticket.createdBy === authStore.user?.name
      }

      // PMSP can view organization tickets
      if (userRole === 'pmsp') {
        return (
          ticket.registration?.organization === userOrg || ticket.complaint?.assignedTo === userOrg
        )
      }

      return false
    }
  })

  // Time calculations
  const getTimeLeft = (ticket) => {
    if (!ticket?.complaint?.deadline) return null

    const deadline = new Date(ticket.complaint.deadline)
    const now = new Date()
    const diff = deadline - now

    if (diff < 0) {
      const overdue = Math.abs(diff)
      const days = Math.floor(overdue / (1000 * 60 * 60 * 24))
      const hours = Math.floor((overdue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) {
        return `Просрочено на ${days} дн ${hours} ч`
      } else {
        return `Просрочено на ${hours} ч`
      }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
      return `${days} дн ${hours} ч`
    } else if (hours > 0) {
      return `${hours} ч`
    } else {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes} мин`
    }
  }

  const isTicketOverdue = (ticket) => {
    if (!ticket?.complaint?.deadline) return false

    const deadline = new Date(ticket.complaint.deadline)
    const now = new Date()
    return now > deadline
  }

  const getTicketPriority = (ticket) => {
    if (!ticket) return 'low'

    // High priority conditions
    if (ticket.complaint) {
      if (isTicketOverdue(ticket)) return 'high'

      const timeLeft = getTimeLeft(ticket)
      if (timeLeft && timeLeft.includes('ч') && !timeLeft.includes('дн')) {
        return 'high'
      }
    }

    // Medium priority for complaints
    if (ticket.complaint) return 'medium'

    return 'low'
  }

  // Withdrawal complaint action
  const withdrawComplaint = async (ticketId, reason) => {
    try {
      const ticket = await getTicket(ticketId)
      if (!ticket) throw new Error('Обращение не найдено')

      const updatedComplaint = {
        ...ticket.complaint,
        status: 'Отозвано',
        withdrawReason: reason,
        withdrawnBy: authStore.user?.name,
        withdrawnAt: new Date().toISOString(),
      }

      await updateTicket(ticketId, {
        complaint: updatedComplaint,
      })

      return true
    } catch (error) {
      console.error('Error withdrawing complaint:', error)
      throw error
    }
  }

  // Statistics calculations
  const getTicketStats = (ticketsList = tickets.value) => {
    const stats = {
      total: ticketsList.length,
      new: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      complaints: 0,
    }

    ticketsList.forEach((ticket) => {
      if (ticket.complaint) {
        stats.complaints++

        switch (ticket.complaint.status) {
          case 'Зарегистрировано':
          case 'Назначено':
            stats.new++
            break
          case 'В работе':
            stats.inProgress++
            break
          case 'Выполнено':
          case 'Закрыто':
            stats.completed++
            break
        }

        if (isTicketOverdue(ticket)) {
          stats.overdue++
        }
      } else {
        stats.new++
      }
    })

    return stats
  }

  // Filter tickets by user role and organization
  const getFilteredTickets = () => {
    const allTickets = tickets.value
    const userRole = authStore.userRole
    const userOrg = authStore.user?.organization
    const userName = authStore.user?.name

    if (userRole === 'admin' || userRole === 'uoz') {
      return allTickets
    }

    return allTickets.filter((ticket) => {
      switch (userRole) {
        case 'dispatcher':
          return ticket.createdBy === userName

        case 'senior_doctor':
          return (
            ticket.complaint?.assignedUser === userName || ticket.complaint?.assignedTo === userOrg
          )

        case 'pmsp':
          return (
            ticket.registration?.organization === userOrg ||
            ticket.complaint?.assignedTo === userOrg
          )

        default:
          return false
      }
    })
  }

  // Search tickets
  const searchTickets = (query) => {
    if (!query) return getFilteredTickets()

    const searchQuery = query.toLowerCase()
    return getFilteredTickets().filter(
      (ticket) =>
        ticket.number?.toLowerCase().includes(searchQuery) ||
        ticket.contact?.fullName?.toLowerCase().includes(searchQuery) ||
        ticket.contact?.phone?.includes(searchQuery) ||
        ticket.registration?.reason?.toLowerCase().includes(searchQuery) ||
        ticket.complaint?.result?.toLowerCase().includes(searchQuery),
    )
  }

  return {
    // State
    tickets,
    currentTicket,
    pagination,
    loading,
    error,
    totalPages,
    currentPage,
    totalCount,
    filters,

    // Actions
    fetchTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    setFilters,
    setPage,
    withdrawComplaint,

    // Computed/Helper functions
    canEditTicket,
    canWithdrawComplaint,
    canViewTicket,
    getTimeLeft,
    isTicketOverdue,
    getTicketPriority,
    getTicketStats,
    getFilteredTickets,
    searchTickets,
  }
}
