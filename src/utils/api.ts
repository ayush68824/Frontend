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
    const res = await api.get('/tasks')
    return res.data
  } catch (error: any) {
    console.error('Get tasks error:', error.response?.data)
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch tasks'
    throw new Error(errorMessage)
  }
}

export const createTask = async (data: FormData) => {
  try {
    // Remove Content-Type header to let browser set it with boundary
    const res = await api.post('/tasks', data, {
      headers: {
        'Content-Type': undefined
      }
    })
    return res.data
  } catch (error: any) {
    console.error('Create task error:', error.response?.data)
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create task'
    throw new Error(errorMessage)
  }
}

export const updateTask = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/tasks/${id}`, data, {
      headers: {
        'Content-Type': undefined
      }
    })
    return res.data
  } catch (error: any) {
    console.error('Update task error:', error.response?.data)
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update task'
    throw new Error(errorMessage)
  }
}

export const deleteTask = async (id: string) => {
  try {
    const res = await api.delete(`/tasks/${id}`)
    return res.data
  } catch (error: any) {
    console.error('Delete task error:', error.response?.data)
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to delete task'
    throw new Error(errorMessage)
  }
} 