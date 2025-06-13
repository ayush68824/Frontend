import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Task } from '../../types';
import { updateTask, deleteTask } from '../../store/slices/taskSlice';
import { AppDispatch } from '../../store';
import { toast } from 'react-toastify';
import TaskForm from './TaskForm';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await dispatch(updateTask({ id: task.id, status: newStatus })).unwrap();
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTask(task.id)).unwrap();
        toast.success('Task deleted successfully');
      } catch (error) {
        console.error('Failed to delete task:', error);
        toast.error('Failed to delete task');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isEditing) {
    return (
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <TaskForm task={task} onClose={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{task.title}</h3>
          <p className="text-muted-foreground mb-4">{task.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`status-badge status-${task.status}`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
            <span className={`priority-badge priority-${task.priority}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            {task.dueDate && (
              <span className="text-sm text-muted-foreground">
                Due: {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className="select text-sm"
              disabled={isDeleting}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isDeleting}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Edit task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-error hover:text-error/80 transition-colors"
            title="Delete task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 