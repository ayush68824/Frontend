import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tasksAPI } from '../../services/api';
import { setTasks, setStatus, setError, setFilters, setSortBy } from '../../store/slices/taskSlice';
import { Task } from '../../types';
import { toast } from 'react-toastify';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const { items: tasks, status, filters, sortBy } = useSelector((state: any) => state.tasks);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        dispatch(setStatus('loading'));
        const data = await tasksAPI.getTasks();
        dispatch(setTasks(data));
      } catch (error: any) {
        dispatch(setError(error.message));
        toast.error('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleFilterChange = (type: 'status' | 'priority', value: string) => {
    dispatch(setFilters({ [type]: value }));
  };

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleSort = (value: string) => {
    dispatch(setSortBy(value));
  };

  const filteredTasks = tasks
    .filter((task: Task) => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a: Task, b: Task) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });

  if (status === 'loading') {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task: Task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <TaskForm onClose={() => setShowTaskForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 