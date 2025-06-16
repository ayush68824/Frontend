import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// Task endpoints
export const getTasks = async () => {
  try {
    const res = await api.get('/tasks')
    return res.data
  } catch (error: any) {
    console.error('Get tasks error:', error)
    throw error
  }
}

export const createTask = async (formData: FormData) => {
  try {
    // Remove Content-Type header to let browser set it with boundary
    const res = await api.post('/tasks', formData, {
      headers: {
        'Content-Type': undefined
      }
    })
    return res.data
  } catch (error: any) {
    console.error('Create task error:', error)
    throw error
  }
}

export const updateTask = async (id: string, formData: FormData) => {
  try {
    const res = await api.put(`/tasks/${id}`, formData, {
      headers: {
        'Content-Type': undefined
      }
    })
    return res.data
  } catch (error: any) {
    console.error('Update task error:', error)
    throw error
  }
}

export const deleteTask = async (id: string) => {
  try {
    const res = await api.delete(`/tasks/${id}`)
    return res.data
  } catch (error: any) {
    console.error('Delete task error:', error)
    throw error
  }
}

// Auth endpoints
export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await api.post('/auth/login', data)
    return res.data
  } catch (error: any) {
    console.error('Login error:', error)
    throw error
  }
}

export const register = async (data: { name: string; email: string; password: string }) => {
  try {
    const res = await api.post('/auth/register', data)
    return res.data
  } catch (error: any) {
    console.error('Register error:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const res = await api.get('/auth/me')
    return res.data
  } catch (error: any) {
    console.error('Get current user error:', error)
    throw error
  }
} 