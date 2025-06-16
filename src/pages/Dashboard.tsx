import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask, deleteTask } from '../utils/api'
import { CircularProgress, Typography, Box, List, ListItem, ListItemText, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Checkbox, MenuItem, Select, FormControl, InputLabel, TextField, Stack, Chip, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate?: string
  image?: string
}

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
  const [open, setOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortBy, setSortBy] = useState('dueDate')
  const [search, setSearch] = useState('')
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
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
        open: true,
        message: err.message || 'Failed to load tasks',
        severity: 'error'
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
    setCreateLoading(true)
    setCreateError(null)
    try {
      const response = await createTask(formData)
      if (response.data.task) {
        setOpen(false)
        fetchTasks()
        setSnackbar({
          open: true,
          message: 'Task created successfully',
          severity: 'success'
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create task')
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create task',
        severity: 'error'
      })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditTask(task)
    setOpen(true)
  }

  const handleUpdateTask = async (formData: FormData) => {
    if (!token || !editTask) return
    setCreateLoading(true)
    setCreateError(null)
    try {
      const response = await updateTask(editTask._id, formData)
      if (response.data.task) {
        setOpen(false)
        setEditTask(null)
        fetchTasks()
        setSnackbar({
          open: true,
          message: 'Task updated successfully',
          severity: 'success'
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      setCreateError(err.message || 'Failed to update task')
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update task',
        severity: 'error'
      })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!token || !deleteId) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteTask(deleteId)
      setDeleteId(null)
      fetchTasks()
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      })
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete task')
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete task',
        severity: 'error'
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleStatusToggle = async (task: Task) => {
    if (!token) return
    try {
      const formData = new FormData()
      formData.append('status', task.status === 'Completed' ? 'Not Started' : 'Completed')
      await updateTask(task._id, formData)
      fetchTasks()
      setSnackbar({
        open: true,
        message: `Task marked as ${task.status === 'Completed' ? 'Not Started' : 'Completed'}`,
        severity: 'success'
      })
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update task status',
        severity: 'error'
      })
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                         task.description.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case 'priority':
        const priorityOrder = { High: 0, Moderate: 1, Low: 2 }
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  if (!user) return null

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }} 
        spacing={2}
        mb={3}
      >
        <Typography variant="h4">Tasks</Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setEditTask(null)
            setOpen(true)
          }}
          fullWidth={false}
        >
          Create Task
        </Button>
      </Stack>

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        mb={3}
        sx={{
          '& .MuiFormControl-root': {
            minWidth: { xs: '100%', sm: 120 }
          }
        }}
      >
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            {priorityOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {createError && <Alert severity="error" sx={{ mb: 2 }}>{createError}</Alert>}
      {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {sortedTasks.map(task => (
            <ListItem
              key={task._id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 1
              }}
              secondaryAction={
                <Stack 
                  direction="row" 
                  spacing={1}
                  sx={{
                    position: { xs: 'static', sm: 'absolute' },
                    right: { xs: 'auto', sm: 16 },
                    mt: { xs: 1, sm: 0 }
                  }}
                >
                  <IconButton edge="end" onClick={() => handleEditTask(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => setDeleteId(task._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={1} 
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    <Checkbox
                      checked={task.status === 'Completed'}
                      onChange={() => handleStatusToggle(task)}
                    />
                    <Typography
                      sx={{
                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                        color: task.status === 'Completed' ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Stack 
                      direction="row" 
                      spacing={1}
                      sx={{ 
                        flexWrap: 'wrap',
                        gap: 0.5
                      }}
                    >
                      <Chip
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === 'High' ? 'error' :
                          task.priority === 'Moderate' ? 'warning' : 'success'
                        }
                      />
                      <Chip
                        label={task.status}
                        size="small"
                        color={
                          task.status === 'Completed' ? 'success' :
                          task.status === 'In Progress' ? 'warning' : 'default'
                        }
                      />
                    </Stack>
                  </Stack>
                }
                secondary={
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={1} 
                    mt={0.5}
                    sx={{
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    {task.dueDate && (
                      <Typography variant="body2" color="text.secondary">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    )}
                    {task.description && (
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    )}
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: 'auto' },
            maxHeight: { xs: '90vh', sm: 'auto' }
          }
        }}
      >
        <DialogTitle>{editTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <TaskForm
          initial={editTask || {}}
          onSubmit={editTask ? handleUpdateTask : handleCreateTask}
          loading={createLoading}
          submitLabel={editTask ? 'Update' : 'Create'}
        />
      </Dialog>

      <Dialog 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: 'auto' }
          }
        }}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button 
            onClick={handleDeleteTask} 
            color="error" 
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Dashboard 