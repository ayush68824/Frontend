import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../../store/slices/taskSlice';
import { AppDispatch } from '../../store/store';
import { Task } from '../../types';

interface TaskFormProps {
  task?: Task;
  onClose?: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Task['priority'];
  status: Task['status'];
}

const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate || '',
        priority: task.priority,
        status: task.status,
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      if (!formData.dueDate) {
        throw new Error('Due date is required');
      }

      if (task) {
        await dispatch(updateTask({
          id: task.id,
          ...formData,
        })).unwrap();
      } else {
        await dispatch(createTask({
          title: formData.title.trim(),
          description: formData.description.trim(),
          dueDate: formData.dueDate,
          priority: formData.priority,
          status: formData.status,
        })).unwrap();
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
      });

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task. Please try again.');
      console.error('Task save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter task title"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter task description"
          rows={3}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-text mb-1">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-text mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-text mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && (
        <div className="text-error text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-text bg-background border border-border rounded-md hover:bg-background/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium text-white bg-primary ${
            loading
              ? 'bg-primary/70 cursor-not-allowed'
              : 'hover:bg-primary/90'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        >
          {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 