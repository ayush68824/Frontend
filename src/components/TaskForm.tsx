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

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Task>;
  onSubmit: (formData: FormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = 'Submit'
}) => {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [status, setStatus] = useState(initial.status || 'Not Started');
  const [priority, setPriority] = useState(initial.priority || 'Moderate');
  const [dueDate, setDueDate] = useState<Date | null>(initial.dueDate ? new Date(initial.dueDate) : null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initial.image || null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('status', status);
      formData.append('priority', priority);
      if (dueDate) {
        formData.append('dueDate', dueDate.toISOString());
      }
      if (image) {
        formData.append('image', image);
      }

      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit task');
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initial._id ? 'Edit Task' : 'Create Task'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              error={!!error}
              helperText={error}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
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
                label="Priority"
                onChange={(e: SelectChangeEvent) => setPriority(e.target.value)}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
              {imagePreview && (
                <Box mt={2}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 