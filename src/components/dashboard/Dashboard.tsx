import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TaskList from '../tasks/TaskList';
import Navbar from '../layout/Navbar';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your tasks and stay organized.
          </p>
        </div>
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard; 