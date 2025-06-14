import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { ClipboardDocumentListIcon, TagIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import { AppDispatch } from '../../store/store';

const navLinks = [
  { name: 'Dashboard', to: '/', icon: <HomeIcon className="h-6 w-6" /> },
  { name: 'My Tasks', to: '/all-tasks', icon: <ClipboardDocumentListIcon className="h-6 w-6" /> },
  { name: 'Task Categories', to: '/categories', icon: <TagIcon className="h-6 w-6" /> },
  { name: 'Settings', to: '/settings', icon: <Cog6ToothIcon className="h-6 w-6" /> },
];

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold">
        TaskMaster
      </div>
      <div className="flex flex-col items-center py-4">
        <img
          src={user?.avatar ? `${import.meta.env.VITE_API_URL}${user.avatar}` : 'https://via.placeholder.com/150'}
          alt="avatar"
          className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover"
        />
        <div className="mt-2 font-semibold text-lg">{user?.name || 'User Name'}</div>
        <div className="text-sm text-gray-400">{user?.email || 'user@email.com'}</div>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive(link.to)
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {React.cloneElement(link.icon, { className: 'mr-3 h-6 w-6' })}
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 