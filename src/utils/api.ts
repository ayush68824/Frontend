import axios from 'axios'
import type { AxiosInstance } from 'axios'

const API_URL = 'https://todo-full-stack-1-9ewe.onrender.com/api'

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getTasks = async () => {
  try {
    const res = await api.get('/task')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
  }
}

export const createTask = async (data: FormData) => {
  try {
    const res = await api.post('/task', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create task')
  }
}

export const updateTask = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/task/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update task')
  }
}

export const deleteTask = async (id: string) => {
  try {
    const res = await api.delete(`/task/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete task')
  }
}

export const getCategories = async () => {
  try {
    const res = await api.get('/category')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories')
  }
}

export const updateProfile = async (data: FormData) => {
  try {
    const res = await api.put('/user/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile')
  }
} 