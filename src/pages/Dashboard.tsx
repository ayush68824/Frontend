import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask, deleteTask, getCategories } from '../utils/api'
import { CircularProgress, Typography, Box, List, ListItem, ListItemText, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Checkbox, MenuItem, Select, FormControl, InputLabel, TextField, Stack, Chip } from '@mui/material'
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
  category?: string
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
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([])
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
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('dueDate')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchTasks = () => {
    if (!token) return
    setLoading(true)
    getTasks()
      .then(data => setTasks(data.tasks || data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false))
  }

  const fetchCategories = () => {
    if (!token) return
    getCategories()
      .then(data => setCategories(data.categories || data))
      .catch(() => setCategories([]))
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchTasks()
    fetchCategories()
    // eslint-disable-next-line
  }, [token, navigate])

  const handleCreateTask = async (formData: FormData) => {
    if (!token) return
    setCreateLoading(true)
    setCreateError(null)
    try {
      const response = await createTask(formData)
      if (response.task) {
        setOpen(false)
        fetchTasks()
      } else {
        setCreateError('Failed to create task: Invalid response from server')
      }
    } catch (e: any) {
      setCreateError(e.message || 'Failed to create task')
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
      if (response.task) {
        setOpen(false)
        setEditTask(null)
        fetchTasks()
      } else {
        setCreateError('Failed to update task: Invalid response from server')
      }
    } catch (e: any) {
      setCreateError(e.message || 'Failed to update task')
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
    } catch (e: any) {
      setDeleteError(e.message || 'Failed to delete task')
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
    } catch {}
  }

  const filteredSortedTasks = useMemo(() => {
    let filtered = tasks
    if (statusFilter !== 'All') filtered = filtered.filter(t => t.status === statusFilter)
    if (priorityFilter !== 'All') filtered = filtered.filter(t => t.priority === priorityFilter)
    if (categoryFilter !== 'All') filtered = filtered.filter(t => t.category === categoryFilter)
    if (search.trim()) {
      const s = search.trim().toLowerCase()
      filtered = filtered.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s))
    }
    if (sortBy === 'dueDate') {
      filtered = [...filtered].sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    } else if (sortBy === 'priority') {
      const order: Record<string, number> = { High: 1, Moderate: 2, Low: 3 }
      filtered = [...filtered].sort((a, b) => (order[a.priority] || 4) - (order[b.priority] || 4))
    } else if (sortBy === 'title') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    }
    return filtered
  }, [tasks, statusFilter, priorityFilter, categoryFilter, sortBy, search])

  const categoryMap = useMemo(() => Object.fromEntries(categories.map(c => [c._id, c.name])), [categories])

  if (!user) return null

  return (
    <Box maxWidth={800} mx="auto" mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Welcome, {user.name}</Typography>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
            {statusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select value={priorityFilter} label="Priority" onChange={e => setPriorityFilter(e.target.value)}>
            {priorityOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={e => setCategoryFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={e => setSortBy(e.target.value)}>
            {sortOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} fullWidth />
      </Stack>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setOpen(true)} 
        sx={{ mb: 2 }}
      >
        Add Task
      </Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <List>
        {filteredSortedTasks.map(task => (
          <ListItem key={task._id} divider secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditTask(task)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => setDeleteId(task._id)}><DeleteIcon /></IconButton>
            </>
          } alignItems="flex-start">
            <Checkbox
              edge="start"
              checked={task.status === 'Completed'}
              onChange={() => handleStatusToggle(task)}
              tabIndex={-1}
              disableRipple
              sx={{ mt: 1 }}
            />
            <ListItemText
              primary={
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>{task.title}</Typography>
                  <Chip label={task.status} color={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'warning' : 'default'} size="small" sx={{ ml: 1 }} />
                  <Chip label={task.priority} color={task.priority === 'High' ? 'error' : task.priority === 'Moderate' ? 'warning' : 'info'} size="small" sx={{ ml: 1 }} />
                  {task.category && <Chip label={categoryMap[task.category] || ''} color="primary" size="small" sx={{ ml: 1 }} />}
                </Stack>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                    {task.dueDate && <Chip label={`Due: ${task.dueDate}`} size="small" />}
                    {task.image && <img src={task.image} alt="task" style={{ width: 32, height: 32, borderRadius: 4, marginLeft: 8 }} />}
                  </Stack>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => { setOpen(false); setEditTask(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TaskForm
            onSubmit={editTask ? handleUpdateTask : handleCreateTask}
            loading={createLoading}
            submitLabel={editTask ? 'Update Task' : 'Create Task'}
            initial={editTask ? {
              title: editTask.title,
              description: editTask.description,
              dueDate: editTask.dueDate,
              priority: editTask.priority,
              status: editTask.status,
            } : {}}
            token={token}
          />
          {createError && <Alert severity="error" sx={{ mt: 2 }}>{createError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setEditTask(null); }} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Dashboard 