import axios from 'axios'

const API_URL = 'https://todo-full-stack-1-9ewe.onrender.com/api'

// Create axios instance with default config
const api = axios.create({
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

export const getTasks = async (token: string) => {
  try {
    const res = await api.get('/tasks')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
  }
}

export const createTask = async (token: string, data: FormData) => {
  try {
    const res = await api.post('/tasks', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create task')
  }
}

export const updateTask = async (token: string, id: string, data: FormData) => {
  try {
    const res = await api.put(`/tasks/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update task')
  }
}

export const deleteTask = async (token: string, id: string) => {
  try {
    const res = await api.delete(`/tasks/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete task')
  }
}

export const getCategories = async (token: string) => {
  try {
    const res = await api.get('/categories')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories')
  }
}

export const updateProfile = async (token: string, data: FormData) => {
  try {
    const res = await api.put('/users/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile')
  }
} 