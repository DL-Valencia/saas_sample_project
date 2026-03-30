import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AnalyticsCharts = ({ stats }) => {
  const barData = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 30 },
    { name: 'Mar', value: 60 },
    { name: 'Apr', value: 80 },
    { name: 'May', value: 50 },
    { name: 'Jun', value: 90 },
  ];

  const pieData = Object.entries(stats || {}).map(([name, value]) => ({ name, value }));
  const COLORS = ['#94a3b8', '#3b82f6', '#eab308', '#10b981', '#f43f5e'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-6 text-white">Submission Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={barData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#0ea5e9' }}
              />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-6 text-white">Status Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData.length ? pieData : [{name: 'Empty', value: 1}]}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-white">
              {Object.values(stats || {}).reduce((a, b) => a + b, 0)}
            </span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
