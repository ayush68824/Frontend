import { useSelector } from 'react-redux';
import TaskList from '../tasks/TaskList';
import Navbar from '../layout/Navbar';
import { RootState } from '../../types';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">Manage your tasks and stay organized.</p>
          </div>
          <TaskList />
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 