import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import useIdleTimeout from '../hooks/useIdleTimeout';

    const DashboardLayout = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      
      // Auto logout if idle for 1.5 minutes
      useIdleTimeout(90000);

      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar setIsSidebarOpen={setIsSidebarOpen} />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-900/50">
              <div className="max-w-7xl mx-auto space-y-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      );
    };

    export default DashboardLayout;
