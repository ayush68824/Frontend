import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask } from '../utils/api'
import { CircularProgress, Box, Alert, Button, Snackbar, Grid, Avatar, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm'
import AddIcon from '@mui/icons-material/Add'
import type { Task } from '../types'
import TaskCard from '../components/TaskCard'

const Dashboard: React.FC = () => {
  const { token, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
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

  if (!user) return null

  return (
    <Box sx={{ p: 4, background: '#f8f6fa', minHeight: '100vh' }}>
      <Paper elevation={2} sx={{ borderRadius: 4, p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar src={user.photo} alt={user.name} sx={{ width: 64, height: 64 }} />
        <Box>
          <Typography variant="h5" fontWeight={700} color="#333">Hi, {user.name}</Typography>
          <Typography variant="body1" color="#888">Welcome back! Here are your tasks.</Typography>
        </Box>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedTask(null)
            setOpenTaskForm(true)
          }}
          sx={{ fontWeight: 600, fontSize: 16, px: 4, py: 1.5, borderRadius: 3 }}
        >
          Add Task
        </Button>
      </Paper>

      <Paper elevation={1} sx={{ borderRadius: 4, p: 3, background: '#fff' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }} color="#7b2ff2">Your Tasks</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : tasks.length === 0 ? (
          <Typography variant="body1" textAlign="center" color="text.secondary">
            No tasks found
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {tasks.map(task => (
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