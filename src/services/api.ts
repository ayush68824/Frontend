import axios from 'axios';
import { Task, User } from '../types';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'https://todo-full-stack-1-9ewe.onrender.com/api';
console.log('API URL being used:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  register: async (name: string, email: string, password: string, avatar?: string) => {
    try {
      const response = await api.post<{ user: User; token: string }>('/auth/register', {
        name,
        email,
        password,
        avatar,
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put<{ user: User }>('/auth/profile', userData);
    return response.data;
  },
};

// Tasks API calls
export const tasksAPI = {
  getTasks: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },
  createTask: async (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },
  updateTask: async (id: string, task: Partial<Task>) => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },
  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api; 