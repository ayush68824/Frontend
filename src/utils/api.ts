import axios from 'axios'
import type { AxiosInstance } from 'axios'

const API_URL = 'http://localhost:5000/api'

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
    const message = error.response?.data?.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// Task endpoints
export const getTasks = () => api.get('/tasks')
export const createTask = (formData: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return api.post('/tasks', formData, config)
}
export const updateTask = (id: string, formData: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return api.put(`/tasks/${id}`, formData, config)
}
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`)

// Auth endpoints
export const login = (data: { email: string; password: string }) => 
  api.post('/auth/login', data)
export const register = (data: { name: string; email: string; password: string }) => 
  api.post('/auth/register', data)
export const getCurrentUser = () => api.get('/auth/me') 