import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import MainLayout from '../layout/MainLayout';

const TaskCategories: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const pending = tasks.filter(t => t.status === 'pending');
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">Task Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <div className="text-3xl font-bold text-yellow-500 mb-2">{pending.length}</div>
          {pending.length > 0 ? (
            <ul className="w-full mt-4 space-y-2">
              {pending.map(task => (
                <li key={task.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{task.title}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                     task.priority === 'high' ? 'bg-red-200 text-red-800' :
                     task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                     'bg-green-200 text-green-800'
                   }`}>{task.priority}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-400">No tasks</div>}
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">In Progress</h3>
          <div className="text-3xl font-bold text-blue-500 mb-2">{inProgress.length}</div>
          {inProgress.length > 0 ? (
            <ul className="w-full mt-4 space-y-2">
              {inProgress.map(task => (
                <li key={task.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{task.title}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                     task.priority === 'high' ? 'bg-red-200 text-red-800' :
                     task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                     'bg-green-200 text-green-800'
                   }`}>{task.priority}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-400">No tasks</div>}
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <div className="text-3xl font-bold text-green-500 mb-2">{completed.length}</div>
          {completed.length > 0 ? (
            <ul className="w-full mt-4 space-y-2">
              {completed.map(task => (
                <li key={task.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{task.title}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                     task.priority === 'high' ? 'bg-red-200 text-red-800' :
                     task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                     'bg-green-200 text-green-800'
                   }`}>{task.priority}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-400">No tasks</div>}
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskCategories; 