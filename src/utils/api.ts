import axios from 'axios'

const API_URL = 'https://todo-full-stack-1-9ewe.onrender.com/api'

export const getTasks = async (token: string) => {
  const res = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const createTask = async (token: string, data: any) => {
  const res = await axios.post(`${API_URL}/tasks`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const updateTask = async (token: string, id: string, data: any) => {
  const res = await axios.put(`${API_URL}/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const deleteTask = async (token: string, id: string) => {
  const res = await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const getCategories = async (token: string) => {
  const res = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
} 