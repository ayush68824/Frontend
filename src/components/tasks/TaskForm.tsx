import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createTask, updateTask } from '../../store/slices/taskSlice';
import { AppDispatch } from '../../store';
import { Task } from '../../types';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dueDate: date.toISOString(),
      }));
    }
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
    <div className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 text-muted-foreground hover:text-foreground"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Enter task title"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[100px] resize-none"
            placeholder="Enter task description"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-1">
              Due Date
            </label>
            <DatePicker
              selected={formData.dueDate ? new Date(formData.dueDate) : null}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="Pp"
              className="input w-full"
              placeholderText="Select date and time"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select"
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select"
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {error && (
          <div className="text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 