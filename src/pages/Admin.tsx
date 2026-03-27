import { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, X } from 'lucide-react';
import { systemLogs, type SupportTicket } from '../data/mockData';
import { useAssets } from '../context/AssetsContext';
import { useAuth } from '../context/AuthContext';

const TABS = ['Requests', 'Support Tickets', 'Users', 'System Logs'] as const;
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

export default function Admin() {
  const { currentUser } = useAuth();
  const { withdrawalRequests, approveWithdrawal, rejectWithdrawal, supportTickets, respondToTicket, updateTicketStatus, allUsers } = useAssets();
  const [activeTab, setActiveTab] = useState<Tab>('Requests');
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ERROR'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState('');

  const filteredLogs = logFilter === 'ALL' ? systemLogs : systemLogs.filter(l => l.level === logFilter);
  const ticket = supportTickets.find(t => t.id === selectedTicket);

  const handleRespond = () => {
    if (!replyMsg.trim() || !selectedTicket || !currentUser) return;
    respondToTicket(selectedTicket, {
      userId: currentUser.id,
      userName: currentUser.name,
      message: replyMsg.trim(),
      isStaff: true,
    });
    setReplyMsg('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-slate-800 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Requests' && (
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
                          <button onClick={() => approveWithdrawal(req.id)} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                            <CheckCircle size={12} />Approve
                          </button>
                          <button onClick={() => rejectWithdrawal(req.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
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
                    <MessageSquare size={14} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Users' && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">All Users ({allUsers.length}) <span className="text-slate-500 text-xs font-normal ml-2">Read-only view</span></h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  {['ID', 'Name', 'Email', 'Role', 'Verified', 'Account Type'].map(h => (
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
                        ? <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} />Verified</span>
                        : <span className="text-yellow-400 text-xs flex items-center gap-1"><XCircle size={12} />Pending</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{user.accountType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <h3 className="text-white font-semibold">System Logs <span className="text-slate-500 text-xs font-normal ml-2">Read-only view</span></h3>
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
    </div>
  );
}

