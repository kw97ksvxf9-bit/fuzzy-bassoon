import { useState, useEffect, useRef } from 'react';
import { Bell, Menu, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

const notifTypeIcon: Record<string, string> = {
  withdrawal: '💸',
  kyc: '🪪',
  support: '💬',
  investment: '📦',
  system: '🔔',
};

export default function Header({ onMenuClick, title }: HeaderProps) {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAssets();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    if (showNotif) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotif]);

  const userNotifications = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleNotifClick = (id: string, link?: string) => {
    markNotificationRead(id);
    setShowNotif(false);
    if (link) navigate(link);
  };

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

        <div className="relative" ref={panelRef}>
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
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <>
                      <span className="text-xs text-amber-400">{unreadCount} unread</span>
                      <button
                        onClick={() => currentUser && markAllNotificationsRead(currentUser.id)}
                        className="text-xs text-slate-400 hover:text-white underline"
                      >
                        Mark all read
                      </button>
                    </>
                  )}
                  <button onClick={() => setShowNotif(false)} className="text-slate-500 hover:text-white ml-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
              {userNotifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No notifications</div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-700">
                  {userNotifications.slice(0, 8).map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n.id, n.link)}
                      className={`p-3 cursor-pointer hover:bg-slate-700/50 transition-colors group ${!n.read ? 'bg-amber-400/5' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base mt-0.5 flex-shrink-0">{notifTypeIcon[n.type] ?? '🔔'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm font-medium text-white truncate">{n.title}</p>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-slate-500">{getRelativeTime(n.createdAt)}</p>
                            {n.link && <ArrowRight size={11} className="text-slate-600 group-hover:text-amber-400 transition-colors" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
