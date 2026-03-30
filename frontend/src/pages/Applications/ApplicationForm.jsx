import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { X, Save, Send, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ApplicationForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('/api/applications', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
          <h3 className="text-xl font-bold text-white">New Application</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Title</label>
              <input
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={onChange}
                className="bg-slate-900 border-slate-700 text-white w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. Q1 Budget Approval Request"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={onChange}
                className="bg-slate-900 border-slate-700 text-white w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
              >
                <option value="General">General</option>
                <option value="Financial">Financial</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={onChange}
                className="bg-slate-900 border-slate-700 text-white w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="Describe the purpose of this application..."
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary py-3 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-primary-500/20"
            >
              {isLoading ? 'Saving...' : 'Submit Draft'}
              {!isLoading && <Send size={18} className="ml-2" />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ApplicationForm;
