import axios from 'axios';
import { Task, User } from '../types';

const API_URL = 'http://localhost:3000/api'; // Update this with your backend API URL

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

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/register', {
      name,
      email,
      password,
    });
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