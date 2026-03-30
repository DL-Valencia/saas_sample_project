import { useEffect, useState, useMemo } from 'react';
import { 
  Users, UserPlus, Mail, ShieldCheck, MoreVertical, 
  X, Loader2, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

// ─── Invite User Modal ─────────────────────────────────────────────────────
const InviteUserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/users', formData, getAuthHeaders());
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Invite New User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1 block">Full Name</label>
            <input name="name" required value={formData.name} onChange={onChange}
              className="bg-slate-900 border border-slate-700 text-white w-full rounded-xl py-3 px-4
                         focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
              placeholder="John Doe" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="email" type="email" required value={formData.email} onChange={onChange}
                className="bg-slate-900 border border-slate-700 text-white w-full rounded-xl py-3 pl-10 pr-4
                           focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                placeholder="user@company.com" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1 block">Password</label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} required minLength={6}
                value={formData.password} onChange={onChange}
                className="bg-slate-900 border border-slate-700 text-white w-full rounded-xl py-3 px-4 pr-12
                           focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                placeholder="Min. 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1 block">Role</label>
            <select name="role" value={formData.role} onChange={onChange}
              className="bg-slate-900 border border-slate-700 text-white w-full rounded-xl py-3 px-4
                         focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">Super Admin</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 btn btn-primary py-3 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <UserPlus className="mr-2" size={20} />}
              {isLoading ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', getAuthHeaders());
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Realistic stats ───────────────────────────────────────────────────────
  const totalUsers = users.length;

  const activeNow = useMemo(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return users.filter(u => u.lastLogin && new Date(u.lastLogin) > oneDayAgo).length;
  }, [users]);

  const roleCounts = useMemo(() => {
    const counts = { SuperAdmin: 0, Admin: 0, User: 0 };
    users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });
    return counts;
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 mt-1">Manage system access and permissions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary shadow-lg shadow-primary-500/20 flex items-center">
          <UserPlus size={20} className="mr-2" />
          Invite User
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <InviteUserModal onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />
        )}
      </AnimatePresence>

      {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-primary-600/5 border-primary-500/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-400 text-sm font-medium">Total Users</h4>
            <Users size={20} className="text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-white">{totalUsers}</p>
          <p className="text-xs text-slate-500 mt-1">Registered accounts</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-6 border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-400 text-sm font-medium">Active (24h)</h4>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{activeNow}</p>
          <p className="text-xs text-slate-500 mt-1">Logged in the last 24 hours</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card p-6 border-slate-700/50">
          <h4 className="text-slate-400 text-sm font-medium mb-3">Role Distribution</h4>
          <div className="space-y-2">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between text-sm">
                <span className={`font-medium ${
                  role === 'SuperAdmin' ? 'text-purple-400' : role === 'Admin' ? 'text-primary-400' : 'text-slate-300'
                }`}>{role}</span>
                <span className="text-white font-bold">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── User Table ───────────────────────────────────────────────────────── */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Login</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading users…</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No users found.</td>
                </tr>
              ) : users.map((user) => {
                const loggedInRecently = user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                return (
                  <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold mr-3">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-slate-500 flex items-center">
                            <Mail size={12} className="mr-1" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center text-xs font-semibold ${
                        user.role === 'SuperAdmin' ? 'text-purple-400' :
                        user.role === 'Admin' ? 'text-primary-400' : 'text-slate-400'
                      }`}>
                        <ShieldCheck size={14} className="mr-1" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center text-xs font-medium ${
                        loggedInRecently ? 'text-emerald-500' : 'text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          loggedInRecently ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}></span>
                        {loggedInRecently ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
