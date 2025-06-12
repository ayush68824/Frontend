import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { ClipboardDocumentListIcon, TagIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: <HomeIcon className="h-6 w-6" /> },
  { name: 'My Task', to: '/all-tasks', icon: <ClipboardDocumentListIcon className="h-6 w-6" /> },
  { name: 'Task Categories', to: '/categories', icon: <TagIcon className="h-6 w-6" /> },
  { name: 'Settings', to: '/settings', icon: <Cog6ToothIcon className="h-6 w-6" /> },
];

const Sidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <aside className="h-screen w-64 bg-[#FF5A5F] flex flex-col text-white shadow-lg">
      <div className="flex flex-col items-center py-8">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white mb-2"
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === link.to ? 'bg-white text-[#FF5A5F]' : 'hover:bg-white/20'}`}
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={() => dispatch(logout())}
        className="flex items-center gap-3 px-4 py-3 m-4 rounded-lg bg-white text-[#FF5A5F] font-semibold hover:bg-red-100 transition-colors"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar; 