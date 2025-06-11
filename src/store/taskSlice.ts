import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from '../types';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
  },
  sortBy: 'dueDate',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<{ key: keyof TaskState['filters']; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilter,
  setSortBy,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer; 