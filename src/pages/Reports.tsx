import { useState } from 'react';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';
import type { Transaction } from '../data/mockData';

function downloadMockPDF(filename: string, title: string) {
  const content = `VAULTSECURE SA\n${title}\nGenerated: ${new Date().toLocaleString()}\n\nDemo report from VaultSecure SA.`;
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

function exportCSV(data: Transaction[], label: string) {
  const headers = 'ID,Type,Asset,Amount (USD),Date,Status,Description\n';
  const rows = data.map(t => `${t.id},${t.type},${t.assetId},${t.amount},${t.date},${t.status},"${t.description}"`).join('\n');
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `vaultsecure-${label}.csv`; a.click(); URL.revokeObjectURL(url);
}

const statusColors: Record<string, string> = { Completed: 'bg-green-500/20 text-green-400', Pending: 'bg-yellow-500/20 text-yellow-400', Processing: 'bg-blue-500/20 text-blue-400' };

type StatementType = 'All Transactions' | 'Investments Only' | 'Withdrawals Only' | 'Fees Only';

export default function Reports() {
  const { currentUser } = useAuth();
  const { transactions } = useAssets();
  const [fromDate, setFromDate] = useState('2023-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [statementType, setStatementType] = useState<StatementType>('All Transactions');

  const userTxns = currentUser?.role === 'admin' ? transactions : transactions.filter(t => t.userId === currentUser?.id);
  const dateFiltered = userTxns.filter(t => t.date >= fromDate && t.date <= toDate);

  const filtered = dateFiltered.filter(t => {
    if (statementType === 'All Transactions') return true;
    if (statementType === 'Investments Only') return t.type === 'Investment' || t.type === 'Deposit';
    if (statementType === 'Withdrawals Only') return t.type === 'Withdrawal';
    if (statementType === 'Fees Only') return t.type === 'Fee';
    return true;
  });

  const totalInvested = filtered.filter(t => t.type === 'Deposit' || t.type === 'Investment').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawn = filtered.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + t.amount, 0);
  const totalFees = filtered.filter(t => t.type === 'Fee').reduce((sum, t) => sum + t.amount, 0);
  const netPosition = totalInvested - totalWithdrawn - totalFees;

  const statementTypes: StatementType[] = ['All Transactions', 'Investments Only', 'Withdrawals Only', 'Fees Only'];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[{title:'Account Statement',desc:'Full transaction history',icon:FileText,file:'account-statement.pdf',label:'ACCOUNT STATEMENT'},{title:'Asset Valuation Report',desc:'Current valuation of all stored assets',icon:BarChart3,file:'asset-valuation.pdf',label:'ASSET VALUATION REPORT'}].map(r => (
          <div key={r.title} className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-400/10 rounded-xl"><r.icon size={22} className="text-amber-400" /></div>
              <div className="flex-1"><h3 className="text-white font-semibold mb-1">{r.title}</h3><p className="text-slate-400 text-sm mb-4">{r.desc}</p>
                <button onClick={() => downloadMockPDF(r.file, r.label)} className="flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Download size={14} />Download PDF</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h3 className="text-white font-semibold">Transaction History</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-xs">Type:</label>
              <select
                value={statementType}
                onChange={e => setStatementType(e.target.value as StatementType)}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
              >
                {statementTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2"><label className="text-slate-400 text-xs">From:</label><input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400" /></div>
            <div className="flex items-center gap-2"><label className="text-slate-400 text-xs">To:</label><input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400" /></div>
            <button onClick={() => exportCSV(filtered, statementType.toLowerCase().replace(/ /g,'-'))} className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-lg text-sm transition-colors"><Download size={14} />Download Statement</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700">{['ID','Type','Asset','Amount','Date','Status','Description'].map(h => <th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(txn => (
                <tr key={txn.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-2 text-slate-500 font-mono text-xs">{txn.id}</td>
                  <td className="py-3 px-2"><span className={`text-xs font-medium ${txn.type==='Deposit'||txn.type==='Investment'?'text-green-400':txn.type==='Withdrawal'?'text-red-400':'text-yellow-400'}`}>{txn.type}</span></td>
                  <td className="py-3 px-2 text-slate-400 font-mono text-xs">{txn.assetId}</td>
                  <td className="py-3 px-2 text-white font-medium">${txn.amount.toLocaleString()}</td>
                  <td className="py-3 px-2 text-slate-400">{txn.date}</td>
                  <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[txn.status]}`}>{txn.status}</span></td>
                  <td className="py-3 px-2 text-slate-300 max-w-xs truncate">{txn.description}</td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={7} className="text-center py-8 text-slate-500">No transactions in selected range</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Summary Row */}
        {filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1">Total Invested</p>
              <p className="text-green-400 font-semibold">${totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1">Total Withdrawn</p>
              <p className="text-red-400 font-semibold">${totalWithdrawn.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1">Total Fees</p>
              <p className="text-yellow-400 font-semibold">${totalFees.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1">Net Position</p>
              <p className={`font-semibold ${netPosition >= 0 ? 'text-green-400' : 'text-red-400'}`}>${netPosition.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
