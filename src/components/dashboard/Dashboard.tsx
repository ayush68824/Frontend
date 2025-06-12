import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import MainLayout from '../layout/MainLayout';
import TaskList from '../tasks/TaskList';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'} <span className="inline-block">👋</span>
        </h1>
        <p className="text-gray-600">
          Manage your tasks and stay organized.
        </p>
      </div>
      <TaskList />
    </MainLayout>
  );
};

export default Dashboard; 