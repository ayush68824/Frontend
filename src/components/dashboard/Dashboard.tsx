import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import TaskList from '../tasks/TaskList';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks.length.toString(),
      icon: ChartBarIcon,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      name: 'In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length.toString(),
      icon: ClockIcon,
      color: 'bg-yellow-500/10 text-yellow-500',
    },
    {
      name: 'Completed',
      value: tasks.filter(t => t.status === 'completed').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500/10 text-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <Link
          to="/all-tasks"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Task
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
        <TaskList limit={5} />
      </div>
    </div>
  );
};

export default Dashboard; 