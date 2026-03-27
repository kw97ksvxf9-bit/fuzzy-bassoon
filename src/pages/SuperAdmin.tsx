import { useState } from 'react';
import { CheckCircle, XCircle, Plus, X, Edit, Ban, CheckSquare, MessageSquare, Users, Package, FileText, Settings, BarChart3, Calendar } from 'lucide-react';
import { systemLogs, type User, type Asset, type Transaction, type SupportTicket } from '../data/mockData';
import { useAssets } from '../context/AssetsContext';
import { useAuth } from '../context/AuthContext';

const TABS = ['Overview', 'User Management', 'Investments & Assets', 'Withdrawal Requests', 'Support Tickets', 'System Logs', 'Platform Settings'] as const;
type Tab = typeof TABS[number];

const logColors: Record<string, string> = { INFO: 'text-blue-400', WARNING: 'text-yellow-400', ERROR: 'text-red-400' };
const statusColors: Record<string, string> = {
  Open: 'bg-blue-500/20 text-blue-400',
  'In Progress': 'bg-yellow-500/20 text-yellow-400',
  Resolved: 'bg-green-500/20 text-green-400',
  Closed: 'bg-slate-500/20 text-slate-400',
};
const priorityColors: Record<string, string> = {
  Low: 'bg-slate-500/20 text-slate-400',
  Medium: 'bg-blue-500/20 text-blue-400',
  High: 'bg-orange-500/20 text-orange-400',
  Urgent: 'bg-red-500/20 text-red-400',
};
const ASSET_TYPES = ['Gold', 'Diamond', 'Platinum', 'Silver', 'Palladium', 'Ruby', 'Emerald'];

const today = new Date().toISOString().split('T')[0];

export default function SuperAdmin() {
  const { currentUser } = useAuth();
  const {
    assets, transactions, withdrawalRequests, supportTickets, platformSettings,
    allUsers, addInvestment, approveWithdrawal, rejectWithdrawal,
    respondToTicket, updateTicketStatus, updatePlatformSettings, updateUser,
  } = useAssets();

  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ERROR'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [toast, setToast] = useState('');

  // Investment modal state
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    userId: allUsers.find(u => u.role === 'user')?.id || allUsers[0]?.id || '',
    type: 'Gold',
    quantity: '',
    unit: 'bars',
    location: '',
    valueUSD: '',
    depositDate: today,
  });

  // User edit modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userEdits, setUserEdits] = useState<Partial<User>>({});

  // Platform settings local state
  const [settingsForm, setSettingsForm] = useState(platformSettings);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredLogs = logFilter === 'ALL' ? systemLogs : systemLogs.filter(l => l.level === logFilter);
  const ticket = supportTickets.find(t => t.id === selectedTicket);
  const isBackdated = newInvestment.depositDate && newInvestment.depositDate < today;

  const handleAddInvestment = () => {
    if (!newInvestment.quantity || !newInvestment.location || !newInvestment.valueUSD) return;
    const assetId = `AST-${String(assets.length + 1).padStart(3, '0')}`;
    const txnId = `TXN-${String(assets.length + transactions.length + 1).padStart(3, '0')}`;
    const asset: Asset = {
      id: assetId,
      userId: newInvestment.userId,
      type: newInvestment.type,
      quantity: Number(newInvestment.quantity),
      unit: newInvestment.unit,
      depositDate: newInvestment.depositDate,
      valueUSD: Number(newInvestment.valueUSD),
      location: newInvestment.location,
      status: 'Stored',
    };
    const transaction: Transaction = {
      id: txnId,
      userId: newInvestment.userId,
      type: 'Investment',
      assetId,
      amount: Number(newInvestment.valueUSD),
      date: newInvestment.depositDate,
      status: 'Completed',
      description: `${newInvestment.type} investment - ${newInvestment.quantity} ${newInvestment.unit}${isBackdated ? ' (backdated)' : ''}`,
    };
    addInvestment(asset, transaction);
    setShowAddInvestment(false);
    setNewInvestment({ userId: newInvestment.userId, type: 'Gold', quantity: '', unit: 'bars', location: '', valueUSD: '', depositDate: today });
    showToast('Investment added successfully');
  };

  const handleRespond = () => {
    if (!replyMsg.trim() || !selectedTicket || !currentUser) return;
    respondToTicket(selectedTicket, {
      userId: currentUser.id,
      userName: currentUser.name,
      message: replyMsg.trim(),
      isStaff: true,
    });
    setReplyMsg('');
    showToast('Reply sent');
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    updateUser(editingUser.id, userEdits);
    setEditingUser(null);
    setUserEdits({});
    showToast('User updated successfully');
  };

  const handleSaveSettings = () => {
    updatePlatformSettings(settingsForm);
    showToast('Platform settings saved');
  };

  const totalAssetValue = assets.reduce((sum, a) => sum + a.valueUSD, 0);
  const pendingRequests = withdrawalRequests.filter(r => r.status === 'Pending').length;
  const openTickets = supportTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  const tabIcons: Record<Tab, React.ElementType> = {
    'Overview': BarChart3,
    'User Management': Users,
    'Investments & Assets': Package,
    'Withdrawal Requests': CheckSquare,
    'Support Tickets': MessageSquare,
    'System Logs': FileText,
    'Platform Settings': Settings,
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}

      <div className="flex gap-1 bg-slate-800 p-1 rounded-xl flex-wrap">
        {TABS.map(tab => {
          const Icon = tabIcons[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === tab ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              <Icon size={13} />
              {tab}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: allUsers.length, color: 'text-blue-400' },
              { label: 'Total Assets', value: assets.length, color: 'text-amber-400' },
              { label: 'Platform Value', value: `$${totalAssetValue.toLocaleString()}`, color: 'text-green-400' },
              { label: 'Pending Requests', value: pendingRequests, color: 'text-yellow-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-900 border border-amber-400/20 rounded-xl p-4">
                <p className="text-slate-500 text-xs">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-4">
              <p className="text-slate-500 text-xs">Open Support Tickets</p>
              <p className="text-2xl font-bold mt-1 text-purple-400">{openTickets}</p>
            </div>
            <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-4">
              <p className="text-slate-500 text-xs">Total Transactions</p>
              <p className="text-2xl font-bold mt-1 text-cyan-400">{transactions.length}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setActiveTab('Investments & Assets'); setShowAddInvestment(true); }}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />Add Investment
            </button>
            <button
              onClick={() => setActiveTab('User Management')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              <Users size={16} />Manage Users
            </button>
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'User Management' && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">All Users ({allUsers.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  {['ID', 'Name', 'Email', 'Role', 'Verified', 'Suspended', 'Account Type', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{user.id}</td>
                    <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-slate-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ${user.role === 'superadmin' ? 'bg-purple-400/20 text-purple-400' : user.role === 'admin' ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.verified
                        ? <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} />Yes</span>
                        : <span className="text-yellow-400 text-xs flex items-center gap-1"><XCircle size={12} />No</span>}
                    </td>
                    <td className="px-4 py-3">
                      {user.suspended
                        ? <span className="text-red-400 text-xs">Yes</span>
                        : <span className="text-slate-500 text-xs">No</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{user.accountType}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingUser(user); setUserEdits({ name: user.name, role: user.role, accountType: user.accountType, verified: user.verified }); }}
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                        >
                          <Edit size={12} />Edit
                        </button>
                        <button
                          onClick={() => { updateUser(user.id, { suspended: !user.suspended }); showToast(user.suspended ? 'User activated' : 'User suspended'); }}
                          className={`flex items-center gap-1 text-xs ${user.suspended ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                        >
                          <Ban size={12} />{user.suspended ? 'Activate' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Investments & Assets */}
      {activeTab === 'Investments & Assets' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold">All Assets ({assets.length})</h3>
            <button
              onClick={() => setShowAddInvestment(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />Add Investment
            </button>
          </div>
          <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    {['Asset ID', 'Owner', 'Type', 'Quantity', 'Date', 'Value (USD)', 'Location', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-amber-400 font-mono text-xs font-medium">{asset.id}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.userId}</td>
                      <td className="px-4 py-3 text-white">{asset.type}</td>
                      <td className="px-4 py-3 text-slate-300">{asset.quantity} {asset.unit}</td>
                      <td className="px-4 py-3 text-slate-400">{asset.depositDate}</td>
                      <td className="px-4 py-3 text-white">${asset.valueUSD.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.location}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${asset.status === 'Stored' ? 'bg-green-500/20 text-green-400' : asset.status === 'Pending Withdrawal' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Requests */}
      {activeTab === 'Withdrawal Requests' && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Withdrawal Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  {['Request ID', 'Client', 'Asset', 'Type', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawalRequests.map(req => (
                  <tr key={req.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{req.id}</td>
                    <td className="px-4 py-3 text-white">{req.userName}</td>
                    <td className="px-4 py-3 text-amber-400 font-mono text-xs">{req.assetId}</td>
                    <td className="px-4 py-3 text-slate-300">{req.assetType}</td>
                    <td className="px-4 py-3 text-slate-400">{req.requestDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : req.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {req.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => { approveWithdrawal(req.id); showToast('Request approved'); }} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                            <CheckCircle size={12} />Approve
                          </button>
                          <button onClick={() => { rejectWithdrawal(req.id); showToast('Request rejected'); }} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
                            <XCircle size={12} />Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Tickets */}
      {activeTab === 'Support Tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">All Tickets ({supportTickets.length})</h3>
            </div>
            <div className="divide-y divide-slate-800">
              {supportTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t.id)}
                  className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${selectedTicket === t.id ? 'bg-slate-800/50 border-l-2 border-amber-400' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{t.subject}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{t.userName} · {t.createdAt.split(' ')[0]}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {ticket && (
            <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-sm">{ticket.subject}</h3>
                  <p className="text-slate-500 text-xs">{ticket.id} · {ticket.userName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={ticket.status}
                    onChange={e => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                    className="bg-slate-800 border border-slate-700 text-white text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-amber-400"
                  >
                    {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-300 text-xs font-medium mb-1">{ticket.userName} (Client)</p>
                  <p className="text-slate-400 text-sm">{ticket.message}</p>
                </div>
                {ticket.responses.map(r => (
                  <div key={r.id} className={`rounded-lg p-3 ${r.isStaff ? 'bg-amber-400/10 border border-amber-400/20' : 'bg-slate-800'}`}>
                    <p className="text-slate-300 text-xs font-medium mb-1">
                      {r.userName} {r.isStaff && <span className="text-amber-400">(Staff)</span>}
                    </p>
                    <p className="text-slate-400 text-sm">{r.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <input
                    value={replyMsg}
                    onChange={e => setReplyMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRespond()}
                    placeholder="Type a reply..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500"
                  />
                  <button
                    onClick={handleRespond}
                    disabled={!replyMsg.trim()}
                    className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <MessageSquare size={14} />Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* System Logs */}
      {activeTab === 'System Logs' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {(['ALL', 'INFO', 'WARNING', 'ERROR'] as const).map(level => (
              <button
                key={level}
                onClick={() => setLogFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${logFilter === level ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">System Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    {['Timestamp', 'Level', 'Message', 'User'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs font-bold ${logColors[log.level]}`}>{log.level}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-sm">{log.message}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Platform Settings */}
      {activeTab === 'Platform Settings' && (
        <div className="max-w-lg space-y-4">
          <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6 space-y-5">
            <h3 className="text-white font-semibold">Platform Configuration</h3>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Storage Fee Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={settingsForm.storageFeeRate}
                onChange={e => setSettingsForm(s => ({ ...s, storageFeeRate: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Max Withdrawal Per Day (USD)</label>
              <input
                type="number"
                min="0"
                value={settingsForm.maxWithdrawalPerDay}
                onChange={e => setSettingsForm(s => ({ ...s, maxWithdrawalPerDay: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">Maintenance Mode</p>
                <p className="text-slate-500 text-xs">Disable platform access for non-admin users</p>
              </div>
              <button
                onClick={() => setSettingsForm(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                className={`w-12 h-6 rounded-full transition-colors ${settingsForm.maintenanceMode ? 'bg-amber-400' : 'bg-slate-600'}`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${settingsForm.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">Notifications Enabled</p>
                <p className="text-slate-500 text-xs">Send notifications to users</p>
              </div>
              <button
                onClick={() => setSettingsForm(s => ({ ...s, notificationsEnabled: !s.notificationsEnabled }))}
                className={`w-12 h-6 rounded-full transition-colors ${settingsForm.notificationsEnabled ? 'bg-amber-400' : 'bg-slate-600'}`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${settingsForm.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <button
              onClick={handleSaveSettings}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Add Investment Modal */}
      {showAddInvestment && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add Investment</h3>
              <button onClick={() => setShowAddInvestment(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Client</label>
                <select
                  value={newInvestment.userId}
                  onChange={e => setNewInvestment(a => ({ ...a, userId: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
                >
                  {allUsers.filter(u => u.role === 'user').map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-2">
                  <Calendar size={14} />
                  Investment Date
                  {isBackdated && (
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                      Backdated
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  value={newInvestment.depositDate}
                  onChange={e => setNewInvestment(a => ({ ...a, depositDate: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
                />
                <p className="text-slate-500 text-xs mt-1">Select any past date to backdate this investment</p>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Asset Type</label>
                <select
                  value={newInvestment.type}
                  onChange={e => setNewInvestment(a => ({ ...a, type: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
                >
                  {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Quantity</label>
                  <input
                    value={newInvestment.quantity}
                    onChange={e => setNewInvestment(a => ({ ...a, quantity: e.target.value }))}
                    placeholder="e.g. 5"
                    type="number"
                    min="0"
                    className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Unit</label>
                  <input
                    value={newInvestment.unit}
                    onChange={e => setNewInvestment(a => ({ ...a, unit: e.target.value }))}
                    placeholder="e.g. bars, carats, kg"
                    className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Value (USD)</label>
                <input
                  value={newInvestment.valueUSD}
                  onChange={e => setNewInvestment(a => ({ ...a, valueUSD: e.target.value }))}
                  placeholder="e.g. 500000"
                  type="number"
                  min="0"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Vault Location</label>
                <input
                  value={newInvestment.location}
                  onChange={e => setNewInvestment(a => ({ ...a, location: e.target.value }))}
                  placeholder="e.g. VAULT-A-12"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddInvestment(false)} className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm">Cancel</button>
              <button
                onClick={handleAddInvestment}
                disabled={!newInvestment.quantity || !newInvestment.location || !newInvestment.valueUSD}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg text-sm"
              >
                Add Investment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-400/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Name</label>
                <input
                  value={userEdits.name ?? ''}
                  onChange={e => setUserEdits(u => ({ ...u, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Role</label>
                <select
                  value={userEdits.role ?? editingUser.role}
                  onChange={e => setUserEdits(u => ({ ...u, role: e.target.value as User['role'] }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Account Type</label>
                <select
                  value={userEdits.accountType ?? editingUser.accountType}
                  onChange={e => setUserEdits(u => ({ ...u, accountType: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
                >
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Director</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="verified"
                  checked={userEdits.verified ?? editingUser.verified}
                  onChange={e => setUserEdits(u => ({ ...u, verified: e.target.checked }))}
                  className="w-4 h-4 accent-amber-400"
                />
                <label htmlFor="verified" className="text-slate-300 text-sm">Verified</label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm">Cancel</button>
              <button onClick={handleSaveUser} className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-lg text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
