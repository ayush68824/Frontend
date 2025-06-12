import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from '../types';

const initialState: TaskState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    status: '',
    priority: '',
    search: ''
  },
  sortBy: 'dueDate'
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<{ key: 'status' | 'priority' | 'search'; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    }
  }
});

export const { setTasks, addTask, updateTask, deleteTask, setFilter, setSortBy } = taskSlice.actions;
export default taskSlice.reducer; 