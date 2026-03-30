import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../store/slices/applicationSlice';
import KPICards from '../components/KPICards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-primary-500">{user?.name}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's a summary of your application metrics.</p>
        </motion.div>
        
        <button className="btn btn-primary shadow-lg shadow-primary-500/20">
          + Create New Application
        </button>
      </div>

      <KPICards stats={stats} />

      <AnalyticsCharts stats={stats} />

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 text-white">Recent Activity</h3>
        <p className="text-slate-500 text-sm">Real-time activity logs will appear here...</p>
      </div>
    </div>
  );
};

export default Dashboard;
