import { 
  FileEdit, 
  Send, 
  Search, 
  CheckCircle, 
  XCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const KPICards = ({ stats }) => {
  const cards = [
    { name: 'Draft', count: stats?.Draft || 0, icon: FileEdit, color: 'text-slate-400', bg: 'bg-slate-400/10' },
    { name: 'Submitted', count: stats?.Submitted || 0, icon: Send, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Reviewed', count: stats?.Reviewed || 0, icon: Search, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Approved', count: stats?.Approved || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Rejected', count: stats?.Rejected || 0, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6 flex flex-col justify-between group cursor-pointer hover:border-primary-500/30 transition-all active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={card.color} size={24} />
            </div>
            <div className="flex items-center text-xs text-slate-400 font-medium bg-slate-700/30 px-2 py-1 rounded-full">
              <TrendingUp size={12} className="mr-1 text-emerald-500" />
              +12%
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{card.name}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{card.count}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KPICards;
