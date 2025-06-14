import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../../types';
import { getTasks } from '../../store/slices/taskSlice';
import { AppDispatch, RootState } from '../../store';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

interface TaskListProps {
  limit?: number;
}

const TaskList: React.FC<TaskListProps> = ({ limit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState<'all' | Task['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await dispatch(getTasks()).unwrap();
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        toast.error('Failed to load tasks. Please try again.');
      }
    };
    fetchTasks();
  }, [dispatch]);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).slice(0, limit);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => dispatch(getTasks())}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Task
          </button>
        </div>
      )}

      {!limit && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'in-progress'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>
      )}

      {showTaskForm && (
        <div className="mb-4">
          <TaskForm onClose={() => setShowTaskForm(false)} />
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'No tasks match your search.' : 'No tasks found.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 