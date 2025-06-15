import React, { useState } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'

interface TaskFormProps {
  initial?: {
    title?: string
    description?: string
    dueDate?: string
    priority?: string
    status?: string
    image?: string
  }
  onSubmit: (data: FormData) => Promise<void>
  loading?: boolean
  submitLabel?: string
}

const TaskForm: React.FC<TaskFormProps> = ({ initial = {}, onSubmit, loading, submitLabel = 'Save' }) => {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [dueDate, setDueDate] = useState<Date | null>(initial.dueDate ? new Date(initial.dueDate) : null)
  const [priority, setPriority] = useState(initial.priority || 'Moderate')
  const [status, setStatus] = useState(initial.status || 'Not Started')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initial.image || null)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!title.trim()) {
      setTitleError('Title is required')
      return
    }
    
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      if (dueDate) {
        formData.append('dueDate', format(dueDate, 'yyyy-MM-dd'))
      }
      formData.append('priority', priority)
      formData.append('status', status)
      
      if (image && image instanceof File) {
        // Check file size (max 5MB)
        if (image.size > 5 * 1024 * 1024) {
          setError('Image size should be less than 5MB')
          return
        }
        // Check file type
        if (!image.type.startsWith('image/')) {
          setError('Please upload an image file')
          return
        }
        formData.append('image', image)
      }
      
      await onSubmit(formData)
    } catch (err: any) {
      console.error('Task submission error:', err)
      setError(err.message || 'Failed to create task. Please try again.')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onload = ev => {
        if (ev.target?.result) {
          setImagePreview(ev.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value)
  }

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setTitleError(null)
          }}
          error={!!titleError}
          helperText={titleError}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        
        <Box sx={{ mt: 2, mb: 2 }}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={handlePriorityChange}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 2 }}>
          <input
            accept="image/*"
            type="file"
            id="image-upload"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
            >
              Upload Image
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '200px' }} 
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </form>
  )
}

export default TaskForm 