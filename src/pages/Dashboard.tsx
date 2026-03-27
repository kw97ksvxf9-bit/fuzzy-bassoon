import { useState } from 'react';
import { TrendingUp, Package, Clock, DollarSign, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { assets, transactions, portfolioHistory, assetBreakdown, USD_TO_ZAR } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-500/20 text-green-400',
  Pending: 'bg-yellow-500/20 text-yellow-400',
  Processing: 'bg-blue-500/20 text-blue-400',
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>('USD');

  const userAssets = currentUser?.role === 'admin' ? assets : assets.filter(a => a.userId === currentUser?.id);
  const totalValue = userAssets.reduce((sum, a) => sum + a.valueUSD, 0);
  const pendingWithdrawals = userAssets.filter(a => a.status === 'Pending Withdrawal').length;
  const storageFee = Math.round(totalValue * 0.005);

  const fmt = (val: number) => currency === 'USD'
    ? `$${val.toLocaleString()}`
    : `R${(val * USD_TO_ZAR).toLocaleString()}`;

  const recentTxn = transactions.slice(0, 5);

  const chartData = portfolioHistory.map(p => ({
    ...p,
    value: currency === 'USD' ? p.value : p.value * USD_TO_ZAR,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">Welcome back, <span className="text-amber-400 font-medium">{currentUser?.name}</span></p>
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
          <RefreshCw size={14} className="text-slate-500 ml-2" />
          {(['USD', 'ZAR'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${currency === c ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Portfolio Value', value: fmt(totalValue), icon: TrendingUp, change: '+12.4%', positive: true },
          { label: 'Total Assets', value: userAssets.length.toString(), icon: Package, change: `${userAssets.filter(a => a.status === 'Stored').length} active`, positive: true },
          { label: 'Pending Requests', value: pendingWithdrawals.toString(), icon: Clock, change: 'Awaiting approval', positive: false },
          { label: 'Storage Fees Due', value: fmt(storageFee), icon: DollarSign, change: 'Due in 5 days', positive: false },
        ].map((card, i) => (
          <div key={i} className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">{card.label}</p>
              <div className="p-2 bg-amber-400/10 rounded-lg">
                <card.icon size={18} className="text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className={`text-xs mt-1 ${card.positive ? 'text-green-400' : 'text-slate-500'}`}>{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Asset Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={assetBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {assetBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [fmt(Number(value ?? 0)), 'Value']}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #D4AF37', borderRadius: 8, color: 'white' }}
              />
              <Legend formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Portfolio Value (12 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => currency === 'USD' ? `$${(v/1000).toFixed(0)}k` : `R${(v/1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [fmt(Number(value ?? 0)), 'Value']}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #D4AF37', borderRadius: 8, color: 'white' }}
              />
              <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Description</th>
                <th className="text-left py-2 font-medium">Amount</th>
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTxn.map(txn => (
                <tr key={txn.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-xs">{txn.id}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${txn.type === 'Deposit' ? 'text-green-400' : txn.type === 'Withdrawal' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{txn.description}</td>
                  <td className="py-3 text-white font-medium">{fmt(txn.amount)}</td>
                  <td className="py-3 text-slate-400">{txn.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[txn.status]}`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
