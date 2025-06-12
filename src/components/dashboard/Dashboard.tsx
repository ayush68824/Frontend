import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { RootState } from '../../store';
import { setTasks, setFilter, setSortBy } from '../../store/taskSlice';
import { tasksAPI } from '../../services/api';
import TaskForm from './TaskForm';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items: tasks, filters, sortBy } = useSelector((state: RootState) => state.tasks);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await tasksAPI.getTasks();
        dispatch(setTasks(response));
      } catch (error) {
        toast.error('Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, [dispatch]);

  const handleFilterChange = (key: 'status' | 'priority' | 'search', value: string) => {
    dispatch(setFilter({ key, value }));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesSearch = !filters.search || 
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Tasks"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by title or description..."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {sortedTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {task.title}
              </Typography>
              <Typography color="text.secondary" paragraph>
                {task.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Priority: {task.priority}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {task.status}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsTaskFormOpen(true)}
        sx={{ mt: 4, position: 'fixed', bottom: 20, right: 20 }}
      >
        Add Task
      </Button>

      <TaskForm
        open={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
      />
    </Container>
  );
};

export default Dashboard; 