import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ChartBarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import TaskList from '../tasks/TaskList';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    {
      name: 'Total Tasks',
      value: '12',
      icon: ChartBarIcon,
      color: 'bg-primary/10 text-primary',
    },
    {
      name: 'In Progress',
      value: '4',
      icon: ClockIcon,
      color: 'bg-yellow-500/10 text-yellow-500',
    },
    {
      name: 'Completed',
      value: '8',
      icon: CheckCircleIcon,
      color: 'bg-green-500/10 text-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name || 'User'} <span className="inline-block">👋</span>
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tasks today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-card rounded-lg p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Recent Tasks</h2>
      </div>
      <TaskList />
      </div>
    </div>
  );
};

export default Dashboard; 