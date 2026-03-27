import { useState } from 'react';
import { TrendingUp, Package, Clock, DollarSign, TrendingDown, RefreshCw, Plus, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import { portfolioHistory, assetBreakdown } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';
import { CURRENCIES, type Currency, getCurrencyConfig, formatCurrency } from '../data/currencies';
import { useGoldPrice, TROY_OZ_PER_BAR } from '../hooks/useGoldPrice';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-500/20 text-green-400',
  Pending: 'bg-yellow-500/20 text-yellow-400',
  Processing: 'bg-blue-500/20 text-blue-400',
};

const txnTypeColor: Record<string, string> = {
  Deposit: 'text-green-400',
  Withdrawal: 'text-red-400',
  Fee: 'text-yellow-400',
  Investment: 'text-purple-400',
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { assets, transactions, withdrawalRequests, supportTickets } = useAssets();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<Currency>('USD');
  const goldPrice = useGoldPrice();

  const cfg = getCurrencyConfig(currency);
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin' || isSuperAdmin;

  const userAssets = isAdmin ? assets : assets.filter(a => a.userId === currentUser?.id);

  /** Current USD value of an asset — gold uses live price, others use deposit value */
  function getCurrentValueUSD(asset: typeof assets[number]): number {
    if (asset.type === 'Gold' && !goldPrice.isLoading) {
      return asset.quantity * TROY_OZ_PER_BAR * goldPrice.priceUSD;
    }
    return asset.valueUSD;
  }

  const totalValue = userAssets.reduce((sum, a) => sum + getCurrentValueUSD(a), 0);
  const totalDepositValue = userAssets.reduce((sum, a) => sum + a.valueUSD, 0);
  const totalGainLoss = totalValue - totalDepositValue;
  const gainLossPercent = totalDepositValue > 0 ? (totalGainLoss / totalDepositValue) * 100 : 0;
  const pendingWithdrawals = isSuperAdmin
    ? withdrawalRequests.filter(r => r.status === 'Pending').length
    : userAssets.filter(a => a.status === 'Pending Withdrawal').length;
  const storageFee = Math.round(totalValue * 0.005);

  // Average hold duration in days
  const avgHoldDays = userAssets.length > 0
    ? Math.round(userAssets.reduce((sum, a) => {
        const depositDate = new Date(a.depositDate);
        const now = new Date();
        return sum + Math.floor((now.getTime() - depositDate.getTime()) / 86400000);
      }, 0) / userAssets.length)
    : 0;

  const fmt = (val: number) => formatCurrency(val, currency);

  const userTxns = isAdmin ? transactions : transactions.filter(t => t.userId === currentUser?.id);
  const recentTxn = userTxns.slice(0, 5);

  const chartData = portfolioHistory.map(p => ({
    ...p,
    value: p.value * cfg.rateFromUSD,
  }));

  // Asset performance bar chart data
  const barChartData = userAssets.slice(0, 6).map(a => ({
    name: `${a.type} (${a.id.split('-')[1]})`,
    'Deposit Value': Math.round(a.valueUSD * cfg.rateFromUSD),
    'Current Value': Math.round(getCurrentValueUSD(a) * cfg.rateFromUSD),
  }));

  const priceUp = goldPrice.priceUSD >= goldPrice.previousPriceUSD;
  const priceDiff = goldPrice.priceUSD - goldPrice.previousPriceUSD;
  const goldPriceInCurrency = goldPrice.priceUSD * cfg.rateFromUSD;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <p className="text-slate-400 text-sm">
          Welcome back, <span className="text-amber-400 font-medium">{currentUser?.name}</span>
          {isSuperAdmin && <span className="ml-2 text-xs bg-purple-400/20 text-purple-400 px-2 py-0.5 rounded-full">Super Admin</span>}
        </p>
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
          <RefreshCw size={14} className="text-slate-500 ml-2" />
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${currency === c.code ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Superadmin quick actions */}
      {isSuperAdmin && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate('/superadmin')}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />Add Investment
          </button>
          <button
            onClick={() => navigate('/superadmin')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Users size={16} />Manage Users
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-xs text-slate-400 bg-slate-800 px-3 py-2 rounded-lg">
              Open tickets: <span className="text-amber-400 font-medium">{supportTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Live Gold Price Ticker */}
      <div className="bg-slate-900 border border-amber-400/30 rounded-xl px-5 py-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold text-sm">GOLD SPOT</span>
          {goldPrice.isLoading ? (
            <span className="text-slate-400 text-sm animate-pulse">Loading…</span>
          ) : (
            <>
              <span className="text-white font-bold text-lg">
                {cfg.symbol}{goldPriceInCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/oz
              </span>
              <span className={`flex items-center gap-1 text-sm font-medium ${priceUp ? 'text-green-400' : 'text-red-400'}`}>
                {priceUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {priceUp ? '+' : ''}{(priceDiff * cfg.rateFromUSD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </>
          )}
        </div>
        <div className="text-slate-500 text-xs ml-auto">
          Updated: {goldPrice.lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: isSuperAdmin ? 'Platform Total Value' : 'Total Portfolio Value',
            value: fmt(totalValue),
            icon: TrendingUp,
            change: '+12.4%',
            positive: true,
          },
          {
            label: 'Total Assets',
            value: userAssets.length.toString(),
            icon: Package,
            change: `${userAssets.filter(a => a.status === 'Stored').length} active`,
            positive: true,
          },
          {
            label: isSuperAdmin ? 'Pending Withdrawals' : 'Pending Requests',
            value: pendingWithdrawals.toString(),
            icon: Clock,
            change: 'Awaiting approval',
            positive: false,
          },
          {
            label: isSuperAdmin ? 'Est. Storage Fees' : 'Storage Fees Due',
            value: fmt(storageFee),
            icon: DollarSign,
            change: isSuperAdmin ? 'Platform-wide' : 'Due in 5 days',
            positive: false,
          },
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

      {/* Enhanced portfolio stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
          <p className="text-slate-400 text-sm mb-2">Total Gain / Loss</p>
          <div className="flex items-center gap-2">
            {totalGainLoss >= 0
              ? <ArrowUp size={20} className="text-green-400" />
              : <ArrowDown size={20} className="text-red-400" />}
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{fmt(totalGainLoss)}
            </p>
          </div>
          <p className={`text-xs mt-1 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}% overall return
          </p>
        </div>
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
          <p className="text-slate-400 text-sm mb-2">Avg. Hold Duration</p>
          <p className="text-2xl font-bold text-white">{avgHoldDays} <span className="text-base font-normal text-slate-400">days</span></p>
          <p className="text-xs text-slate-500 mt-1">Across {userAssets.length} asset{userAssets.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
          <p className="text-slate-400 text-sm mb-2">Deposit vs Current</p>
          <p className="text-2xl font-bold text-white">{fmt(totalDepositValue)}</p>
          <p className="text-xs text-slate-500 mt-1">Original deposit value</p>
        </div>
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
                tickFormatter={(v) => `${cfg.symbol}${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [`${cfg.symbol}${Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Value']}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #D4AF37', borderRadius: 8, color: 'white' }}
              />
              <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Performance Bar Chart */}
      {barChartData.length > 0 && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Asset Performance — Deposit vs Current Value</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `${cfg.symbol}${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value, name) => [`${cfg.symbol}${Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, name]}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #D4AF37', borderRadius: 8, color: 'white' }}
              />
              <Legend formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>} />
              <Bar dataKey="Deposit Value" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current Value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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
                    <span className={`text-xs font-medium ${txnTypeColor[txn.type] ?? 'text-slate-400'}`}>
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
