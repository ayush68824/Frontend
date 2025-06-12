import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Navbar from '../layout/Navbar';
import TaskItem from './TaskItem';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AllTasks: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  // Group tasks by status for chart
  const statusCounts = useMemo(() => {
    return {
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
    };
  }, [tasks]);

  const chartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [statusCounts.completed, statusCounts.inProgress, statusCounts.pending],
        backgroundColor: [
          '#22c55e', // green
          '#3b82f6', // blue
          '#facc15', // yellow
        ],
        borderWidth: 1,
      },
    ],
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 hidden md:block bg-white border-r">
        <Navbar />
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">All Tasks</h1>
            <p className="text-gray-500">Overview of all your tasks and their status</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as typeof filter)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        {/* Chart */}
        <div className="max-w-xs mx-auto mb-10">
          <Doughnut data={chartData} />
        </div>
        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No tasks found. Create a new task to get started!
            </div>
          ) : (
            filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasks; 