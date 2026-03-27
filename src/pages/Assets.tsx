import { useState } from 'react';
import { Download, ArrowUpRight, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';
import { CURRENCIES, type Currency, formatCurrency } from '../data/currencies';
import { useGoldPrice, TROY_OZ_PER_BAR } from '../hooks/useGoldPrice';

const statusColors: Record<string, string> = {
  'Stored': 'bg-green-500/20 text-green-400 border border-green-500/30',
  'Pending Withdrawal': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'Delivered': 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

function downloadCertificate(id: string) {
  const content = `VAULTSECURE SA - ASSET CERTIFICATE\n\nAsset ID: ${id}\nDate: ${new Date().toLocaleDateString()}\nCertified by VaultSecure SA`;
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `certificate-${id}.pdf`; a.click();
  URL.revokeObjectURL(url);
}

function getDuration(depositDate: string): string {
  const deposit = new Date(depositDate);
  const now = new Date();
  const months = (now.getFullYear() - deposit.getFullYear()) * 12 + now.getMonth() - deposit.getMonth();
  if (months < 1) return '< 1 month';
  if (months < 12) return `${months} months`;
  return `${Math.floor(months / 12)}y ${months % 12}m`;
}

export default function Assets() {
  const { currentUser } = useAuth();
  const { assets: allAssets } = useAssets();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [withdrawModal, setWithdrawModal] = useState<string | null>(null);
  const [withdrawn, setWithdrawn] = useState<string[]>([]);
  const goldPrice = useGoldPrice();

  const fmt = (val: number) => formatCurrency(val, currency);

  const userAssets = currentUser?.role === 'admin' ? allAssets : allAssets.filter(a => a.userId === currentUser?.id);
  const types = ['All', ...Array.from(new Set(userAssets.map(a => a.type)))];
  const statuses = ['All', 'Stored', 'Pending Withdrawal', 'Delivered'];
  const filtered = userAssets.filter(a => (filterType === 'All' || a.type === filterType) && (filterStatus === 'All' || a.status === filterStatus));

  function getCurrentValueUSD(asset: typeof allAssets[number]): number {
    if (asset.type === 'Gold' && !goldPrice.isLoading) {
      return asset.quantity * TROY_OZ_PER_BAR * goldPrice.priceUSD;
    }
    return asset.valueUSD;
  }

  const confirmWithdraw = (id: string) => { setWithdrawn(w => [...w, id]); setWithdrawModal(null); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={16} className="text-slate-500" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400">{types.map(t => <option key={t}>{t}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400">{statuses.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg flex-wrap">
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => setCurrency(c.code)} className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${currency === c.code ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}>{c.code}</button>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700 bg-slate-800/50">{['Asset ID','Type','Quantity','Deposit Date','Duration',`Deposit Value (${currency})`,`Current Value (${currency})`,'Location','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(asset => {
                const currentStatus = withdrawn.includes(asset.id) ? 'Pending Withdrawal' : asset.status;
                const currentValueUSD = getCurrentValueUSD(asset);
                const isGold = asset.type === 'Gold';
                return (
                  <tr key={asset.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-amber-400 font-mono text-xs font-medium">{asset.id}</td>
                    <td className="px-4 py-3 text-white font-medium">{asset.type}</td>
                    <td className="px-4 py-3 text-slate-300">{asset.quantity} {asset.unit}</td>
                    <td className="px-4 py-3 text-slate-400">{asset.depositDate}</td>
                    <td className="px-4 py-3 text-slate-400">{getDuration(asset.depositDate)}</td>
                    <td className="px-4 py-3 text-slate-400">{fmt(asset.valueUSD)}</td>
                    <td className="px-4 py-3 font-medium">
                      {isGold && !goldPrice.isLoading ? (
                        <span className={currentValueUSD > asset.valueUSD ? 'text-green-400' : 'text-red-400'}>
                          {fmt(currentValueUSD)}
                        </span>
                      ) : (
                        <span className="text-white">{fmt(currentValueUSD)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.location}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[currentStatus]}`}>{currentStatus}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => downloadCertificate(asset.id)} className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"><Download size={12} />Certificate</button>
                        {currentStatus === 'Stored' && <button onClick={() => setWithdrawModal(asset.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><ArrowUpRight size={12} />Withdraw</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-slate-500">No assets found matching filters</div>}
        </div>
      </div>
      {withdrawModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4"><h3 className="text-white font-semibold text-lg">Confirm Withdrawal Request</h3><button onClick={() => setWithdrawModal(null)} className="text-slate-500 hover:text-white"><X size={20} /></button></div>
            <p className="text-slate-400 text-sm mb-2">You are requesting withdrawal for asset:</p>
            <div className="bg-slate-800 rounded-lg p-3 mb-5"><p className="text-amber-400 font-mono font-medium">{withdrawModal}</p><p className="text-slate-400 text-sm mt-1">{allAssets.find(a => a.id === withdrawModal)?.type} · {allAssets.find(a => a.id === withdrawModal)?.location}</p></div>
            <p className="text-slate-500 text-xs mb-5">This request will be reviewed within 2-3 business days.</p>
            <div className="flex gap-3">
              <button onClick={() => setWithdrawModal(null)} className="flex-1 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm">Cancel</button>
              <button onClick={() => confirmWithdraw(withdrawModal)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">Confirm Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

