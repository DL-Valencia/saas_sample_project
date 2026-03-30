import { useSelector, useDispatch } from 'react-redux';
import { Bell, Search, Menu, LogOut, User } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const Navbar = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 md:px-8 z-20">
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-md text-slate-400 hover:bg-slate-700/50"
        >
          <Menu size={24} />
        </button>

        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search applications..." 
            className="bg-slate-900 border border-slate-700 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-800"></span>
        </button>

        <div className="h-8 w-px bg-slate-700 mx-2"></div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors group"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
