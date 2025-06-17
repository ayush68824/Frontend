import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Close as CloseIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { Task } from '../types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TaskFormProps {
  onSubmit: (taskData: FormData) => Promise<void>;
  onClose: () => void;
  initialData?: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    image?: string;
    _id?: string;
  };
  loading?: boolean;
  submitLabel?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onClose,
  initialData = {},
  loading = false,
  submitLabel = 'Submit'
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [status, setStatus] = useState(initialData.status || 'Not Started');
  const [priority, setPriority] = useState(initialData.priority || 'Moderate');
  const [dueDate, setDueDate] = useState<Date | null>(initialData.dueDate ? new Date(initialData.dueDate) : null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug: Log form state
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form State:', {
      title,
      description,
      status,
      priority,
      dueDate: dueDate?.toISOString(),
      image: image ? 'Image present' : 'No image'
    });

    // Validate required fields
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('status', status);
      formData.append('priority', priority);
      if (dueDate) {
        formData.append('dueDate', dueDate.toISOString().split('T')[0]);
      }
      if (image) {
        formData.append('image', image);
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      // Submit the task
      await onSubmit(formData);
      
      // Debug: Log success
      console.log('Task submitted successfully');
      
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('Not Started');
      setPriority('Moderate');
      setDueDate(null);
      setImage(null);
      setImagePreview(null);
      setError('');
      onClose();
    } catch (error: any) {
      // Debug: Log error details
      console.error('Task submission error:', {
        message: error.message,
        error: error
      });
      setError(error.message || 'Failed to create task');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setImagePreview(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData._id ? 'Edit Task' : 'Create Task'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!error}
            helperText={error}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {imagePreview ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {imagePreview && (
              <Box mt={2} textAlign="center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : submitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm; 