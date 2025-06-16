import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask, deleteTask } from '../utils/api'
import { CircularProgress, Typography, Box, List, ListItem, ListItemText, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Checkbox, MenuItem, Select, FormControl, InputLabel, TextField, Stack, Chip, Snackbar, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import { Task } from '../types'

const statusOptions = ['All', 'Not Started', 'In Progress', 'Completed']
const priorityOptions = ['All', 'High', 'Moderate', 'Low']
const sortOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
]

const Dashboard: React.FC = () => {
  const { token, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const [openEditForm, setOpenEditForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' }>({
    message: '',
    type: 'success'
  })
  const navigate = useNavigate()

  const fetchTasks = async () => {
    if (!token) return
    setLoading(true)
    try {
      const response = await getTasks()
      setTasks(response.data.tasks || response.data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks')
      setSnackbar({
        message: err.message || 'Failed to load tasks',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchTasks()
  }, [token, navigate])

  const handleCreateTask = async (formData: FormData) => {
    if (!token) return
    try {
      const response = await createTask(formData)
      if (response.data.task) {
        setOpenTaskForm(false)
        fetchTasks()
        setSnackbar({
          message: 'Task created successfully',
          type: 'success'
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      setSnackbar({
        message: err.message || 'Failed to create task',
        type: 'error'
      })
    }
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setOpenEditForm(true)
  }

  const handleUpdateTask = async (formData: FormData) => {
    if (!token || !selectedTask) return
    try {
      const response = await updateTask(selectedTask._id, formData)
      if (response.data.task) {
        setOpenEditForm(false)
        setSelectedTask(null)
        fetchTasks()
        setSnackbar({
          message: 'Task updated successfully',
          type: 'success'
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      setSnackbar({
        message: err.message || 'Failed to update task',
        type: 'error'
      })
    }
  }

  const handleDeleteTask = async () => {
    if (!token || !deleteId) return
    try {
      await deleteTask(deleteId)
      setDeleteId(null)
      fetchTasks()
      setSnackbar({
        message: 'Task deleted successfully',
        type: 'success'
      })
    } catch (err: any) {
      setSnackbar({
        message: err.message || 'Failed to delete task',
        type: 'error'
      })
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  if (!user) return null

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <Button
            variant="contained"
            onClick={() => setOpenTaskForm(true)}
            startIcon={<AddIcon />}
            fullWidth={false}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '200px' }
            }}
          >
            Create Task
          </Button>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: '120px' } }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', sm: '120px' } }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TextField
          label="Search Tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredTasks.length === 0 ? (
          <Alert severity="info">No tasks found</Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <TaskCard
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => setDeleteId(task._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      <TaskForm
        open={openTaskForm}
        onClose={() => setOpenTaskForm(false)}
        onSubmit={handleCreateTask}
        loading={loading}
        submitLabel="Create Task"
      />

      <TaskForm
        open={openEditForm}
        onClose={() => setOpenEditForm(false)}
        onSubmit={handleUpdateTask}
        loading={loading}
        submitLabel="Update Task"
        initial={selectedTask || undefined}
      />

      <Snackbar
        open={!!snackbar.message}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ message: '', type: 'success' })}
      >
        <Alert 
          onClose={() => setSnackbar({ message: '', type: 'success' })} 
          severity={snackbar.type}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Dashboard 