import { apiClient } from './client'

// Mock tickets API
const mockTicketsApi = {
  async getTickets(params = {}) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Return mock data
    return {
      success: true,
      data: {
        tickets: [],
        total: 0,
        page: params.page || 1,
        perPage: params.perPage || 50
      }
    }
  },
  
  async getTicket(id) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      data: {
        id,
        number: `T2024-${String(id).padStart(3, '0')}`,
        // ... other ticket data
      }
    }
  },
  
  async createTicket(data) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      data: {
        id: Date.now(),
        number: `T2024-${String(Date.now()).slice(-3)}`,
        ...data
      }
    }
  },
  
  async updateTicket(id, data) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      success: true,
      data: { id, ...data }
    }
  },
  
//   async deleteTicket(id) {
//     await new Promise(resolve => setTimeout(resolve, 500))
    
//     return { success: true }
//   }
}

// Real tickets API using axios
const realTicketsApi = {
  async getTickets(params = {}) {
    const response = await apiClient.get('/tickets', { params })
    return response.data
  },
  
  async getTicket(id) {
    const response = await apiClient.get(`/tickets/${id}`)
    return response.data
  },
  
  async createTicket(data) {
    const response = await apiClient.post('/tickets', data)
    return response.data
  },
  
  async updateTicket(id, data) {
    const response = await apiClient.put(`/tickets/${id}`, data)
    return response.data
  },
  
  async deleteTicket(id) {
    const response = await apiClient.delete(`/tickets/${id}`)
    return response.data
  }
}

export const ticketsApi = import.meta.env.DEV ? mockTicketsApi : realTicketsApi

 