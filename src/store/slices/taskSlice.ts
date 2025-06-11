import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, TaskFormData } from '../../types';

interface TaskState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  // In a real app, this would be an API call
  return [] as Task[];
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: TaskFormData) => {
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

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: Task) => {
    // In a real app, this would be an API call
    return {
      ...task,
      updatedAt: new Date().toISOString()
    };
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    // In a real app, this would be an API call
    return taskId;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
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

export default taskSlice.reducer; 