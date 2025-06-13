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
    <aside className="h-screen w-64 bg-primary flex flex-col text-primary-foreground shadow-lg">
      <div className="flex flex-col items-center py-8">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-primary-foreground/20 mb-2"
          />
        )}
        <div className="font-bold text-lg">{user?.name || 'User Name'}</div>
        <div className="text-xs opacity-80">{user?.email || 'user@email.com'}</div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map(link => (
          <Link
            key={link.name}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(link.to)
                ? 'bg-primary-foreground text-primary'
                : 'hover:bg-primary-foreground/20'
            }`}
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 m-4 rounded-lg bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-colors"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar; 