import { useState, useEffect } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead } = useAssets();
  const [now, setNow] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => n.unread).length;

  return (
    <header className="bg-slate-900 border-b border-amber-400/20 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white">
          <Menu size={22} />
        </button>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-slate-400 text-sm">
          {now.toLocaleDateString('en-ZA', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          {' · '}
          {now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-amber-400/20 rounded-xl shadow-2xl z-50">
              <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-amber-400">{unreadCount} unread</span>
                )}
              </div>
              {userNotifications.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
              ) : (
                userNotifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 border-b border-slate-700 last:border-0 cursor-pointer hover:bg-slate-700/50 transition-colors ${n.unread ? 'bg-amber-400/5' : ''}`}
                  >
                    <p className="text-sm text-slate-200">{n.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 font-bold text-sm">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <span className="hidden sm:block text-white text-sm font-medium">{currentUser?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}
