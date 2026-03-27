import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, User, ShieldCheck, Info, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VaultLogo from './VaultLogo';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assets', label: 'Assets', icon: Package },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/about', label: 'About', icon: Info },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = currentUser?.role === 'admin'
    ? [...navLinks, { to: '/admin', label: 'Admin', icon: ShieldCheck }]
    : navLinks;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-amber-400/20 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <VaultLogo size={36} />
            <div>
              <div className="text-amber-400 font-bold text-sm leading-tight">VaultSecure SA</div>
              <div className="text-slate-400 text-xs">Est. 1980</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-400/20 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 font-bold text-sm">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-white text-sm font-medium truncate w-32">{currentUser?.name}</div>
              <div className="text-slate-400 text-xs capitalize">{currentUser?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg text-sm transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
