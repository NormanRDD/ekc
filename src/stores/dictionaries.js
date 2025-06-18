import { defineStore } from 'pinia'
import { reactive } from 'vue'
import axios from 'axios'

export const useDictionariesStore = defineStore('dictionaries', () => {
  const dictionaries = reactive({
    cities: [],
    districts: {},
    organizations: {},
    callTypes: [],
    callSubtypes: {},
    complaintStatuses: [],
    complaintCategories: [],
    complaintSubcategories: {}
  })

  const loading = reactive({
    cities: false,
    districts: false,
    organizations: false,
    callTypes: false,
    complaintStatuses: false
  })

  const loadDictionaries = async () => {
    try {
      const response = await axios.get('/dictionaries')
      Object.assign(dictionaries, response.data)
    } catch (error) {
      console.error('Error loading dictionaries:', error)
    }
  }

  const loadCities = async () => {
    loading.cities = true
    try {
      const response = await axios.get('/dictionaries/cities')
      dictionaries.cities = response.data
    } catch (error) {
      console.error('Error loading cities:', error)
    } finally {
      loading.cities = false
    }
  }

  const loadDistricts = async (city) => {
    if (!city) return []
    
    loading.districts = true
    try {
      const response = await axios.get(`/dictionaries/districts/${city}`)
      dictionaries.districts[city] = response.data
      return response.data
    } catch (error) {
      console.error('Error loading districts:', error)
      return []
    } finally {
      loading.districts = false
    }
  }

  const loadOrganizations = async (city) => {
    if (!city) return []
    
    loading.organizations = true
    try {
      const response = await axios.get(`/dictionaries/organizations/${city}`)
      dictionaries.organizations[city] = response.data
      return response.data
    } catch (error) {
      console.error('Error loading organizations:', error)
      return []
    } finally {
      loading.organizations = false
    }
  }

  const getDistricts = (city) => {
    return dictionaries.districts[city] || []
  }

  const getOrganizations = (city) => {
    return dictionaries.organizations[city] || []
  }

  const getCallSubtypes = (type) => {
    return dictionaries.callSubtypes[type] || []
  }

  const getComplaintSubcategories = (category) => {
    return dictionaries.complaintSubcategories[category] || []
  }

  const updateDictionary = async (type, data) => {
    try {
      const response = await axios.put(`/dictionaries/${type}`, data)
      dictionaries[type] = response.data
      return response.data
    } catch (error) {
      console.error(`Error updating ${type} dictionary:`, error)
      throw error
    }
  }

  return {
    dictionaries,
    loading,
    loadDictionaries,
    loadCities,
    loadDistricts,
    loadOrganizations,
    getDistricts,
    getOrganizations,
    getCallSubtypes,
    getComplaintSubcategories,
    updateDictionary
  }
})
