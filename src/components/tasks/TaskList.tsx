import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../../types';
import { getTasks } from '../../store/slices/taskSlice';
import { AppDispatch, RootState } from '../../store';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const TaskList: React.FC = () => {
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
  });

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
    <div className="divide-y divide-border">
      <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-card">
            <TaskForm onClose={() => setShowTaskForm(false)} />
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {filteredTasks.length === 0 ? (
          <div className="text-center p-8">
            {tasks.length === 0 ? (
              <div>
                <p className="text-muted-foreground mb-4">No tasks found. Create a new task to get started!</p>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn btn-primary"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <p className="text-muted-foreground">No tasks match your current filter or search.</p>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList; 