import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['User', 'Admin', 'SuperAdmin'] },
    { name: 'Applications', path: '/applications', icon: FileText, roles: ['User', 'Admin', 'SuperAdmin'] },
    { name: 'User Management', path: '/users', icon: Users, roles: ['Admin', 'SuperAdmin'] },
    { name: 'System Logs', path: '/logs', icon: ShieldCheck, roles: ['SuperAdmin'] },
    { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['User', 'Admin', 'SuperAdmin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className={twMerge(
      "relative bg-slate-800 border-r border-slate-700/50 transition-all duration-300 ease-in-out z-30",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="h-full flex flex-col">
        {/* Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-10 bg-primary-600 rounded-full p-1 text-white shadow-lg z-50 hover:bg-primary-700 transition-colors"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <div className="bg-primary-600 p-2 rounded-lg">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          {isOpen && <span className="ml-3 font-bold text-xl tracking-tight">SaaS<span className="text-primary-500">Dash</span></span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={twMerge(
                "flex items-center px-3 py-3 rounded-lg transition-colors group",
                location.pathname === item.path 
                  ? "bg-primary-600 text-white" 
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <item.icon size={20} className={clsx(isOpen ? "mr-4" : "mx-auto")} />
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center p-2 rounded-lg bg-slate-700/30">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {isOpen && (
              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.role || 'Visitor'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
