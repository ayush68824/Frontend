import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Task } from '../../types';
import { updateTask, deleteTask } from '../../store/slices/taskSlice';
import { AppDispatch } from '../../store/store';
import { toast } from 'react-toastify';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      setLoading(true);
      await dispatch(updateTask({ id: task.id, status: newStatus })).unwrap();
      toast.success('Task status updated successfully');
    } catch (err) {
      console.error('Failed to update task status:', err);
      toast.error('Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await dispatch(deleteTask(task.id)).unwrap();
        toast.success('Task deleted successfully');
      } catch (err) {
        console.error('Failed to delete task:', err);
        toast.error('Failed to delete task. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4">
        <TaskForm task={task} onClose={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-text">{task.title}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>
      
      <p className="text-text/80 mb-4">{task.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-text/60">
          Due: {formatDate(task.dueDate)}
        </div>
        
        <div className="flex gap-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            disabled={loading}
            className="px-2 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-2 py-1 text-sm text-error hover:text-error/80 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 