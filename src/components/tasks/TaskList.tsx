import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tasksAPI } from '../../services/api';
import { setTasks } from '../../store/slices/taskSlice';
import { RootState } from '../../store';
import TaskItem from './TaskItem';
import { toast } from 'react-toastify';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksAPI.getTasks();
        dispatch(setTasks(data));
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList; 