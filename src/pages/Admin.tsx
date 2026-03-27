import { useState } from 'react';
import { CheckCircle, XCircle, Edit, Ban, Plus, X } from 'lucide-react';
import { users, withdrawalRequests as initialRequests, systemLogs } from '../data/mockData';
import { useAssets } from '../context/AssetsContext';
import type { Asset, Transaction } from '../data/mockData';

const TABS = ['Users', 'Assets', 'Requests', 'System Logs'] as const;
type Tab = typeof TABS[number];
const logColors: Record<string, string> = { INFO: 'text-blue-400', WARNING: 'text-yellow-400', ERROR: 'text-red-400' };

const ASSET_TYPES = ['Gold', 'Diamond', 'Platinum', 'Silver', 'Palladium', 'Ruby', 'Emerald'];

export default function Admin() {
  const { assets: allAssets, transactions, addDeposit } = useAssets();
  const [activeTab, setActiveTab] = useState<Tab>('Users');
  const [requests, setRequests] = useState(initialRequests);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    userId: users[0].id,
    type: 'Gold',
    quantity: '',
    unit: 'bars',
    location: '',
    valueUSD: '',
    depositDate: new Date().toISOString().split('T')[0],
  });

  const approveRequest = (id: string) => setRequests(r => r.map(req => req.id === id ? { ...req, status: 'Approved' as const } : req));
  const rejectRequest = (id: string) => setRequests(r => r.map(req => req.id === id ? { ...req, status: 'Rejected' as const } : req));

  const handleAddDeposit = () => {
    if (!newAsset.quantity || !newAsset.location || !newAsset.valueUSD) return;
    const assetId = `AST-${String(allAssets.length + 1).padStart(3, '0')}`;
    const txnId = `TXN-${String(allAssets.length + transactions.length + 1).padStart(3, '0')}`;
    const asset: Asset = {
      id: assetId,
      userId: newAsset.userId,
      type: newAsset.type,
      quantity: Number(newAsset.quantity),
      unit: newAsset.unit,
      depositDate: newAsset.depositDate,
      valueUSD: Number(newAsset.valueUSD),
      location: newAsset.location,
      status: 'Stored',
    };
    const transaction: Transaction = {
      id: txnId,
      userId: newAsset.userId,
      type: 'Deposit',
      assetId,
      amount: Number(newAsset.valueUSD),
      date: newAsset.depositDate,
      status: 'Completed',
      description: `${newAsset.type} deposit - ${newAsset.quantity} ${newAsset.unit}`,
    };
    addDeposit(asset, transaction);
    setShowAddAsset(false);
    setNewAsset({ userId: users[0].id, type: 'Gold', quantity: '', unit: 'bars', location: '', valueUSD: '', depositDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-slate-800 p-1 rounded-xl w-fit">
        {TABS.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab===tab?'bg-amber-400 text-slate-900':'text-slate-400 hover:text-white'}`}>{tab}</button>)}
      </div>

      {activeTab === 'Users' && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700"><h3 className="text-white font-semibold">All Users ({users.length})</h3></div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700 bg-slate-800/50">{['ID','Name','Email','Verification','Account Type','Role','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>{users.map(user => (
              <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{user.id}</td>
                <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3">{user.verified?<span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12}/>Verified</span>:<span className="flex items-center gap-1 text-yellow-400 text-xs"><XCircle size={12}/>Pending</span>}</td>
                <td className="px-4 py-3 text-slate-300">{user.accountType}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ${user.role==='admin'?'bg-amber-400/20 text-amber-400':'bg-slate-700 text-slate-300'}`}>{user.role}</span></td>
                <td className="px-4 py-3"><div className="flex gap-2"><button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Edit size={12}/>Edit</button><button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><Ban size={12}/>Suspend</button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'Assets' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold">All Assets ({allAssets.length})</h3>
            <button onClick={() => setShowAddAsset(true)} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"><Plus size={16}/>Add Deposit</button>
          </div>
          <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700 bg-slate-800/50">{['Asset ID','Owner','Type','Quantity','Deposit Date','Value (USD)','Location','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>{allAssets.map(asset => (
              <tr key={asset.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="px-4 py-3 text-amber-400 font-mono text-xs font-medium">{asset.id}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.userId}</td>
                <td className="px-4 py-3 text-white">{asset.type}</td>
                <td className="px-4 py-3 text-slate-300">{asset.quantity} {asset.unit}</td>
                <td className="px-4 py-3 text-slate-400">{asset.depositDate}</td>
                <td className="px-4 py-3 text-white">${asset.valueUSD.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.location}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${asset.status==='Stored'?'bg-green-500/20 text-green-400':asset.status==='Pending Withdrawal'?'bg-yellow-500/20 text-yellow-400':'bg-slate-500/20 text-slate-400'}`}>{asset.status}</span></td>
              </tr>
            ))}</tbody>
          </table></div></div>
        </div>
      )}

      {activeTab === 'Requests' && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700"><h3 className="text-white font-semibold">Withdrawal Requests</h3></div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700 bg-slate-800/50">{['Request ID','Client','Asset','Type','Date','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>{requests.map(req => (
              <tr key={req.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{req.id}</td>
                <td className="px-4 py-3 text-white">{req.userName}</td>
                <td className="px-4 py-3 text-amber-400 font-mono text-xs">{req.assetId}</td>
                <td className="px-4 py-3 text-slate-300">{req.assetType}</td>
                <td className="px-4 py-3 text-slate-400">{req.requestDate}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.status==='Pending'?'bg-yellow-500/20 text-yellow-400':req.status==='Approved'?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>{req.status}</span></td>
                <td className="px-4 py-3">{req.status==='Pending'&&<div className="flex gap-2"><button onClick={()=>approveRequest(req.id)} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"><CheckCircle size={12}/>Approve</button><button onClick={()=>rejectRequest(req.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><XCircle size={12}/>Reject</button></div>}</td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'System Logs' && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700"><h3 className="text-white font-semibold">System Logs</h3></div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700 bg-slate-800/50">{['Timestamp','Level','Message','User'].map(h=><th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>{systemLogs.map(log => (
              <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{log.timestamp}</td>
                <td className="px-4 py-3"><span className={`font-mono text-xs font-bold ${logColors[log.level]}`}>{log.level}</span></td>
                <td className="px-4 py-3 text-slate-300 max-w-sm">{log.message}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{log.user}</td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}

      {showAddAsset && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add Deposit</h3>
              <button onClick={() => setShowAddAsset(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Client</label>
                <select value={newAsset.userId} onChange={e => setNewAsset(a => ({ ...a, userId: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm">
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.id})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Deposit Date</label>
                <input type="date" value={newAsset.depositDate} onChange={e => setNewAsset(a => ({ ...a, depositDate: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"/>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Asset Type</label>
                <select value={newAsset.type} onChange={e => setNewAsset(a => ({ ...a, type: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm">
                  {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Quantity</label>
                  <input value={newAsset.quantity} onChange={e => setNewAsset(a => ({ ...a, quantity: e.target.value }))} placeholder="e.g. 5" type="number" min="0" className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"/>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Unit</label>
                  <input value={newAsset.unit} onChange={e => setNewAsset(a => ({ ...a, unit: e.target.value }))} placeholder="e.g. bars, carats, kg" className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"/>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Value (USD)</label>
                <input value={newAsset.valueUSD} onChange={e => setNewAsset(a => ({ ...a, valueUSD: e.target.value }))} placeholder="e.g. 500000" type="number" min="0" className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"/>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Vault Location</label>
                <input value={newAsset.location} onChange={e => setNewAsset(a => ({ ...a, location: e.target.value }))} placeholder="e.g. VAULT-A-12" className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddAsset(false)} className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm">Cancel</button>
              <button onClick={handleAddDeposit} disabled={!newAsset.quantity || !newAsset.location || !newAsset.valueUSD} className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg text-sm">Add Deposit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
