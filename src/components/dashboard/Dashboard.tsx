import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';

const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Here's an overview of your tasks
            </p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TaskList />
        </div>

        {showTaskForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <TaskForm onClose={() => setShowTaskForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 