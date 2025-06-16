import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask, deleteTask } from '../utils/api'
import { CircularProgress, Box, Alert, Button, FormControl, InputLabel, TextField, Stack, Snackbar, Select, MenuItem, Grid, Avatar, Card, CardContent, Typography, Divider, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm'
import AddIcon from '@mui/icons-material/Add'
import type { Task } from '../types'
import TaskCard from '../components/TaskCard'
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DesignServicesIcon from '@mui/icons-material/DesignServices';

const statusOptions = ['All', 'Not Started', 'In Progress', 'Completed'] as const;
const priorityOptions = ['All', 'High', 'Moderate', 'Low'] as const;

const categoryData = [
  { label: 'Design', icon: <DesignServicesIcon />, color: '#ffb74d' },
  { label: 'Meeting', icon: <MeetingRoomIcon />, color: '#64b5f6' },
  { label: 'Learning', icon: <SchoolIcon />, color: '#81c784' },
  { label: 'Work', icon: <WorkIcon />, color: '#e57373' },
];

const Dashboard: React.FC = () => {
  const { token, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<typeof statusOptions[number]>('All')
  const [priorityFilter, setPriorityFilter] = useState<typeof priorityOptions[number]>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchTasks()
    // eslint-disable-next-line
  }, [token, navigate])

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

  const handleCreateTask = async (formData: FormData) => {
    if (!token) return
    try {
      const response = await createTask(formData)
      if (response.data.task) {
        setOpenTaskForm(false)
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
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create task',
        severity: 'error'
      })
    }
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setOpenTaskForm(true)
  }

  const handleUpdateTask = async (formData: FormData) => {
    if (!token || !selectedTask) return
    try {
      const response = await updateTask(selectedTask._id, formData)
      if (response.data.task) {
        setOpenTaskForm(false)
        setSelectedTask(null)
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
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update task',
        severity: 'error'
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
    <Box sx={{ p: 4, background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Grid container spacing={4} alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={user.photo} alt={user.name} sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography variant="h5" color="#fff">Hello!</Typography>
              <Typography variant="h4" fontWeight={700} color="#fff">{user.name}</Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedTask(null)
              setOpenTaskForm(true)
            }}
            sx={{ fontWeight: 600, fontSize: 18, px: 4, py: 1.5, borderRadius: 3, background: '#fff', color: '#7b2ff2', boxShadow: 2 }}
          >
            Add Task
          </Button>
        </Grid>
      </Grid>

      {/* Category Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categoryData.map((cat) => (
          <Grid item xs={12} sm={6} md={3} key={cat.label}>
            <Card sx={{ background: cat.color, color: '#fff', borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {cat.icon}
                  <Typography variant="h6" fontWeight={600}>{cat.label}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Today's Tasks */}
      <Paper elevation={3} sx={{ borderRadius: 4, p: 3, mb: 4, background: '#fff' }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }} color="#7b2ff2">Today's Tasks</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredTasks.length === 0 ? (
          <Typography variant="body1" textAlign="center" color="text.secondary">
            No tasks found
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredTasks.map(task => (
              <Grid item xs={12} md={6} lg={4} key={task._id}>
                <TaskCard
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => {}}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Progress/Graph Section Placeholder */}
      <Paper elevation={3} sx={{ borderRadius: 4, p: 3, background: '#fff' }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }} color="#7b2ff2">Progress Overview</Typography>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
          {/* You can integrate a chart library here, e.g., recharts, chart.js, etc. */}
          <Typography variant="body1">[Graph/Progress Visualization Placeholder]</Typography>
        </Box>
      </Paper>

      <TaskForm
        open={openTaskForm}
        onClose={() => {
          setOpenTaskForm(false)
          setSelectedTask(null)
        }}
        initial={selectedTask || undefined}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        submitLabel={selectedTask ? 'Update' : 'Create'}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Dashboard 