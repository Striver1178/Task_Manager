import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { notificationsAPI } from '../api/notifications';
import NotificationPanel from './NotificationPanel';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'My Tasks',
  '/team': 'Team',
  '/profile': 'Profile',
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'TeamFlow';

  useEffect(() => {
    notificationsAPI.getAll()
      .then(({ data }) => setUnreadCount(data.unreadCount))
      .catch(() => {});
  }, [location.pathname]);

  return (
    <header className="h-16 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-dark-400 hover:text-white transition-colors p-1"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <NotificationPanel
              onClose={() => setNotifOpen(false)}
              onRead={() => setUnreadCount(0)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
