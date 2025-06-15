import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, MenuItem, Stack, Typography, InputLabel, Select, FormControl } from '@mui/material'
import { getCategories } from '../utils/api'

const priorities = [
  { value: 'High', label: 'High' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Low', label: 'Low' },
]

const statuses = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
]

interface TaskFormProps {
  initial?: {
    title?: string
    description?: string
    dueDate?: string
    priority?: string
    status?: string
    image?: File | null
    category?: string
  }
  onSubmit: (data: FormData) => void
  loading?: boolean
  submitLabel?: string
  token?: string | null
}

const TaskForm: React.FC<TaskFormProps> = ({ initial = {}, onSubmit, loading, submitLabel = 'Save', token }) => {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [dueDate, setDueDate] = useState(initial.dueDate || '')
  const [priority, setPriority] = useState(initial.priority || 'Moderate')
  const [status, setStatus] = useState(initial.status || 'Not Started')
  const [image, setImage] = useState<File | null>(initial.image || null)
  const [category, setCategory] = useState(initial.category || '')
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([])

  useEffect(() => {
    if (token) {
      getCategories(token).then(data => setCategories(data.categories || data)).catch(() => setCategories([]))
    }
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('dueDate', dueDate)
    formData.append('priority', priority)
    formData.append('status', status)
    if (image) formData.append('image', image)
    if (category) formData.append('category', category)
    onSubmit(formData)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} p={2}>
      <Stack spacing={2}>
        <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required fullWidth variant="outlined" helperText="Enter a short, descriptive title" />
        <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} multiline rows={3} fullWidth variant="outlined" helperText="Describe the task details" />
        <TextField label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" helperText="Set a due date (optional)" />
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} label="Priority" onChange={e => setPriority(e.target.value)} variant="outlined">
            {priorities.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={e => setStatus(e.target.value)} variant="outlined">
            {statuses.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={e => setCategory(e.target.value)} variant="outlined">
            {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="outlined" component="label">
          {image ? 'Change Image' : 'Upload Image'}
          <input type="file" accept="image/*" hidden onChange={e => setImage(e.target.files?.[0] || null)} />
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ transition: 'all 0.2s' }}>{submitLabel}</Button>
      </Stack>
    </Box>
  )
}

export default TaskForm 