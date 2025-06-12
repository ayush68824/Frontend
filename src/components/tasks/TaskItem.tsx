import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Task } from '../../types';
import { deleteTask, updateTask } from '../../store/slices/taskSlice';
import { AppDispatch } from '../../store';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task.id)).unwrap();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await dispatch(updateTask({ id: task.id, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Error updating task status:', error);
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
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-green-100 text-green-800';
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => handleStatusChange('pending')}
          className={`px-3 py-1 text-sm rounded-md ${
            task.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusChange('in-progress')}
          className={`px-3 py-1 text-sm rounded-md ${
            task.status === 'in-progress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => handleStatusChange('completed')}
          className={`px-3 py-1 text-sm rounded-md ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800 hover:bg-green-50'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default TaskItem; 