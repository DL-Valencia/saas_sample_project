import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApplications } from '../../store/slices/applicationSlice';
import ApplicationForm from './ApplicationForm';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Applications = () => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getApplications());
  }, [dispatch]);

  const handleSave = () => {
    dispatch(getApplications());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Submitted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Reviewed': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Applications</h1>
          <p className="text-slate-400 mt-1">Manage and track all system applications.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary shadow-lg shadow-primary-500/20 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          New Application
        </button>
      </div>

      {isFormOpen && (
        <ApplicationForm 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSave} 
        />
      )}

      <div className="card overflow-visible">
        <div className="p-4 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or user..." 
              className="bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
              <Filter size={16} className="text-slate-500 mr-2" />
              <select 
                className="bg-transparent text-sm text-slate-300 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Application</th>
                <th className="px-6 py-4 font-semibold">Submitted By</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {applications.length > 0 ? applications.map((app, index) => (
                <motion.tr 
                  key={app._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{app.title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{app.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 mr-3">
                        {app.user?.name?.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-300">{app.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><Eye size={18} /></button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><Edit size={18} /></button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    {isLoading ? 'Loading applications...' : 'No applications found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing 1 to {applications.length} of {applications.length} results</p>
          <div className="flex items-center space-x-2">
            <button className="p-2 border border-slate-700 rounded-lg text-slate-500 hover:bg-slate-800 disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
            <button className="p-2 border border-slate-700 rounded-lg text-white bg-primary-600 px-4 text-xs font-bold">1</button>
            <button className="p-2 border border-slate-700 rounded-lg text-slate-500 hover:bg-slate-800 disabled:opacity-50" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
