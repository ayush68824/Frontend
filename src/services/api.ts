import axios from 'axios';
import { User, Task, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://todo-full-stack-1-9ewe.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  },

  register: async (userData: FormData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  },

  googleLogin: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/google', { token });
    return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Google login failed');
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
    }
  },

  updateProfile: async (userData: FormData): Promise<User> => {
    try {
      const response = await api.put<User>('/auth/profile', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Profile update failed');
      }
      throw error;
    }
  },
};

// Tasks API calls
export const taskAPI = {
  getTasks: async (): Promise<Task[]> => {
    try {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
      }
      throw error;
    }
  },

  createTask: async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    try {
      const response = await api.post<Task>('/tasks', taskData);
    return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create task');
      }
      throw error;
    }
  },

  updateTask: async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.put<Task>(`/tasks/${taskId}`, taskData);
    return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update task');
      }
      throw error;
    }
  },

  deleteTask: async (taskId: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete task');
      }
      throw error;
    }
  },
};

export default api; 