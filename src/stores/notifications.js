import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const loading = ref(false)

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      date: new Date().toISOString(),
      ...notification
    })
  }

  const markAsRead = async (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      
      try {
        await axios.patch(`/notifications/${id}/read`)
      } catch (error) {
        console.error('Error marking notification as read:', error)
        notification.read = false
      }
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.value
      .filter(n => !n.read)
      .map(n => n.id)

    notifications.value.forEach(n => n.read = true)

    try {
      await axios.patch('/notifications/read-all', { ids: unreadIds })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      // Revert changes on error
      unreadIds.forEach(id => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) notification.read = false
      })
    }
  }

  const loadNotifications = async () => {
    loading.value = true
    try {
      const response = await axios.get('/notifications')
      notifications.value = response.data
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      loading.value = false
    }
  }

  const deleteNotification = async (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      const notification = notifications.value[index]
      notifications.value.splice(index, 1)

      try {
        await axios.delete(`/notifications/${id}`)
      } catch (error) {
        console.error('Error deleting notification:', error)
        // Restore notification on error
        notifications.value.splice(index, 0, notification)
      }
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    deleteNotification
  }
})
