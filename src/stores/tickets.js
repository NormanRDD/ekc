import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref([])
  const currentTicket = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const filters = reactive({
    dateFrom: '',
    dateTo: '',
    city: '',
    district: '',
    organization: '',
    callType: '',
    callSubtype: '',
    complaintStatus: '',
    assignedTo: '',
    search: ''
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 50,
    total: 0,
    totalPages: 0
  })

  const filteredTickets = computed(() => {
    let result = [...tickets.value]
    const auth = useAuthStore()

    // Role-based filtering
    if (auth.user?.role === 'dispatcher') {
      result = result.filter(ticket => ticket.createdBy === auth.user.name)
    } else if (auth.user?.role === 'pmsp') {
      result = result.filter(ticket => ticket.organization === auth.user.organization)
    }

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(ticket => 
        ticket.contact.fullName.toLowerCase().includes(search) ||
        ticket.contact.phone.includes(search) ||
        ticket.contact.iin?.includes(search) ||
        ticket.number.toLowerCase().includes(search)
      )
    }

    // Apply other filters
    if (filters.city) {
      result = result.filter(ticket => ticket.registration.city === filters.city)
    }

    if (filters.callType) {
      result = result.filter(ticket => ticket.registration.callType === filters.callType)
    }

    if (filters.complaintStatus && filters.callType === 'Жалоба') {
      result = result.filter(ticket => ticket.complaint?.status === filters.complaintStatus)
    }

    return result
  })

  const getTickets = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/tickets', {
        params: { ...filters, ...params, page: pagination.page, perPage: pagination.perPage }
      })
      
      tickets.value = response.data.tickets
      pagination.total = response.data.total
      pagination.totalPages = response.data.totalPages
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка загрузки обращений'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTicket = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`/tickets/${id}`)
      currentTicket.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка загрузки обращения'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTicket = async (ticketData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/tickets', ticketData)
      tickets.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка создания обращения'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTicket = async (id, updates) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`/tickets/${id}`, updates)
      
      // Update in tickets list
      const index = tickets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tickets.value[index] = response.data
      }
      
      // Update current ticket if it's the same
      if (currentTicket.value?.id === id) {
        currentTicket.value = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка обновления обращения'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addComment = async (ticketId, comment) => {
    try {
      const response = await axios.post(`/tickets/${ticketId}/comments`, { text: comment })
      
      // Update current ticket comments if it's the same ticket
      if (currentTicket.value?.id === ticketId) {
        currentTicket.value.comments.push(response.data)
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка добавления комментария'
      throw err
    }
  }

  const withdrawComplaint = async (ticketId, reason) => {
    try {
      const response = await axios.post(`/tickets/${ticketId}/withdraw`, { reason })
      
      // Update ticket status
      await updateTicket(ticketId, { 
        complaint: { ...currentTicket.value.complaint, status: 'Отозвана заявителем' }
      })
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка отзыва жалобы'
      throw err
    }
  }

  const exportTickets = async (format = 'excel') => {
    try {
      const response = await axios.get('/tickets/export', {
        params: { format, ...filters },
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `tickets-export.${format === 'excel' ? 'xlsx' : 'csv'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка экспорта данных'
      throw err
    }
  }

  const updateTicketFromWebSocket = (ticketData) => {
    // Update ticket from WebSocket notification
    const index = tickets.value.findIndex(t => t.id === ticketData.id)
    if (index !== -1) {
      tickets.value[index] = { ...tickets.value[index], ...ticketData }
    }
    
    if (currentTicket.value?.id === ticketData.id) {
      currentTicket.value = { ...currentTicket.value, ...ticketData }
    }
  }

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      filters[key] = ''
    })
  }

  const setPage = (page) => {
    pagination.page = page
  }

  return {
    tickets,
    currentTicket,
    loading,
    error,
    filters,
    pagination,
    filteredTickets,
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    addComment,
    withdrawComplaint,
    exportTickets,
    updateTicketFromWebSocket,
    clearFilters,
    setPage
  }
})