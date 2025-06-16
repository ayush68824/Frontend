import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
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
    return Promise.reject(error)
  }
)

// Task endpoints
export const getTasks = async () => {
  try {
    const response = await api.get('/tasks')
    return response.data
  } catch (error: any) {
    console.error('Error fetching tasks:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
  }
}

export const createTask = async (formData: FormData) => {
  try {
    const response = await api.post('/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error creating task:', error)
    throw new Error(error.response?.data?.message || 'Failed to create task')
  }
}

export const updateTask = async (id: string, formData: FormData) => {
  try {
    const response = await api.put(`/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error updating task:', error)
    throw new Error(error.response?.data?.message || 'Failed to update task')
  }
}

export const deleteTask = async (id: string) => {
  try {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  } catch (error: any) {
    console.error('Error deleting task:', error)
    throw new Error(error.response?.data?.message || 'Failed to delete task')
  }
}

// Auth endpoints
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error: any) {
    console.error('Error logging in:', error)
    throw new Error(error.response?.data?.message || 'Failed to login')
  }
}

export const register = async (formData: FormData) => {
  try {
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error registering:', error)
    throw new Error(error.response?.data?.message || 'Failed to register')
  }
}

export const logout = async () => {
  try {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  } catch (error: any) {
    console.error('Error logging out:', error)
    throw new Error(error.response?.data?.message || 'Failed to logout')
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