import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string, avatar?: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', { name, email, password, avatar });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  googleLogin: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/google', { token });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },
  updateProfile: async (userData: { name?: string; avatar?: string }): Promise<User> => {
    try {
      const response = await api.put<{ user: User }>('/auth/profile', userData);
      return response.data.user;
    } catch (error) {
      console.error('Profile update error:', error);
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
      console.error('Get tasks error:', error);
      throw error;
    }
  },
  createTask: async (taskData: { title: string; description: string; dueDate: string }): Promise<Task> => {
    try {
      const response = await api.post<Task>('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.put<Task>(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },
};

export default api; 