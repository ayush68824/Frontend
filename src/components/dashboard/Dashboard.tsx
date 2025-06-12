import React, { useEffect } from 'react';
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
  InputLabel
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { RootState } from '../../store';
import { setTasks, setFilter, setSortBy } from '../../store/taskSlice';
import { tasksAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items: tasks, filters, sortBy } = useSelector((state: RootState) => state.tasks);

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
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search Tasks"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
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
        <Grid item xs={12} sm={4}>
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

      <Grid container spacing={3}>
        {sortedTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Paper>
              <Typography variant="h6" component="h2" sx={{ p: 2 }}>
                {task.title}
              </Typography>
              <Typography color="text.secondary" sx={{ p: 2 }}>
                {task.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mt: 4, ml: 4 }}
      >
        Add Task
      </Button>
    </Container>
  );
};

export default Dashboard; 