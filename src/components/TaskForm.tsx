import React, { useState } from 'react'
import { Box, Button, TextField, MenuItem, Stack, InputLabel, Select, FormControl } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'

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
  }
  onSubmit: (data: FormData) => void
  loading?: boolean
  submitLabel?: string
  token?: string | null
}

const TaskForm: React.FC<TaskFormProps> = ({ initial = {}, onSubmit, loading, submitLabel = 'Save' }) => {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [dueDate, setDueDate] = useState<Date | null>(initial.dueDate ? new Date(initial.dueDate) : null)
  const [priority, setPriority] = useState(initial.priority || 'Moderate')
  const [status, setStatus] = useState(initial.status || 'Not Started')
  const [image, setImage] = useState<File | null>(initial.image || null)
  const [titleError, setTitleError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Title is required')
      return
    }
    
    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('description', description.trim())
    if (dueDate) {
      formData.append('dueDate', format(dueDate, 'yyyy-MM-dd'))
    }
    formData.append('priority', priority)
    formData.append('status', status)
    if (image) formData.append('image', image)
    
    onSubmit(formData)
  }

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value)
  }

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} p={2}>
      <Stack spacing={2}>
        <TextField 
          label="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          fullWidth 
          variant="outlined" 
          error={!!titleError}
          helperText={titleError}
        />
        <TextField 
          label="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          multiline 
          rows={3} 
          fullWidth 
          variant="outlined" 
          helperText="Describe the task details" 
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                helperText: 'Set a due date (optional)'
              }
            }}
          />
        </LocalizationProvider>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select 
            value={priority} 
            label="Priority" 
            onChange={handlePriorityChange}
            variant="outlined"
          >
            {priorities.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select 
            value={status} 
            label="Status" 
            onChange={handleStatusChange}
            variant="outlined"
          >
            {statuses.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="outlined" 
          component="label"
          fullWidth
        >
          {image ? 'Change Image' : 'Upload Image'}
          <input 
            type="file" 
            accept="image/*" 
            hidden 
            onChange={e => setImage(e.target.files?.[0] || null)} 
          />
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading}
          fullWidth
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </Stack>
    </Box>
  )
}

export default TaskForm 