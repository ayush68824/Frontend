import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskFormData, TaskState } from '../../types';

const initialState: TaskState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    status: 'all',
    priority: 'all'
  },
  sortBy: 'dueDate'
};

export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetchTasks',
  async () => {
    // In a real app, this would be an API call
    return [] as Task[];
  }
);

export const createTask = createAsyncThunk<Task, TaskFormData>(
  'tasks/createTask',
  async (taskData) => {
    // In a real app, this would be an API call
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      userId: '1', // In a real app, this would come from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newTask;
  }
);

export const updateTask = createAsyncThunk<Task, Task>(
  'tasks/updateTask',
  async (task) => {
    // In a real app, this would be an API call
    return {
      ...task,
      updatedAt: new Date().toISOString()
    };
  }
);

export const deleteTask = createAsyncThunk<string, string>(
  'tasks/deleteTask',
  async (taskId) => {
    // In a real app, this would be an API call
    return taskId;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<TaskState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      });
  }
});

export const { setFilter, setSortBy } = taskSlice.actions;
export default taskSlice.reducer; 