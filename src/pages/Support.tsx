import { useState } from 'react';
import { Plus, X, MessageSquare, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useAssets } from '../context/AssetsContext';
import { useAuth } from '../context/AuthContext';
import type { SupportTicket } from '../data/mockData';

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

export default function Support() {
  const { currentUser } = useAuth();
  const { supportTickets, addSupportTicket, respondToTicket, updateTicketStatus } = useAssets();

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  const visibleTickets = isStaff ? supportTickets : supportTickets.filter(t => t.userId === currentUser?.id);

  const [showNewTicket, setShowNewTicket] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');

  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'Medium' as SupportTicket['priority'],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim() || !currentUser) return;
    addSupportTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      subject: newTicket.subject,
      message: newTicket.message,
      status: 'Open',
      priority: newTicket.priority,
    });
    setShowNewTicket(false);
    setNewTicket({ subject: '', message: '', priority: 'Medium' });
    showToast('Support ticket submitted successfully');
  };

  const handleReply = (ticketId: string) => {
    const msg = replyMsg[ticketId];
    if (!msg?.trim() || !currentUser) return;
    respondToTicket(ticketId, {
      userId: currentUser.id,
      userName: currentUser.name,
      message: msg.trim(),
      isStaff,
    });
    setReplyMsg(prev => ({ ...prev, [ticketId]: '' }));
    showToast('Reply sent');
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">
            {isStaff ? 'All Support Tickets' : 'My Support Tickets'}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {isStaff ? 'Manage and respond to client tickets' : 'View your tickets and responses from our team'}
          </p>
        </div>
        {!isStaff && (
          <button
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />New Ticket
          </button>
        )}
      </div>

      {visibleTickets.length === 0 ? (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-12 text-center">
          <MessageSquare size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No support tickets yet</p>
          {!isStaff && (
            <button
              onClick={() => setShowNewTicket(true)}
              className="mt-4 text-amber-400 hover:text-amber-300 text-sm underline"
            >
              Submit your first ticket
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visibleTickets.map(ticket => (
            <div key={ticket.id} className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500 font-mono text-xs">{ticket.id}</span>
                      {isStaff && <span className="text-slate-400 text-xs">· {ticket.userName}</span>}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>{ticket.status}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                    </div>
                    <p className="text-white font-medium mt-1">{ticket.subject}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{ticket.createdAt.split(' ')[0]} · {ticket.responses.length} response{ticket.responses.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex-shrink-0 text-slate-500">
                    {expandedTicket === ticket.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {expandedTicket === ticket.id && (
                <div className="border-t border-slate-800">
                  <div className="p-4 space-y-3">
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-slate-300 text-xs font-medium mb-1">{ticket.userName} (Client)</p>
                      <p className="text-slate-400 text-sm">{ticket.message}</p>
                    </div>
                    {ticket.responses.map(r => (
                      <div key={r.id} className={`rounded-lg p-3 ${r.isStaff ? 'bg-amber-400/10 border border-amber-400/20' : 'bg-slate-800'}`}>
                        <p className="text-slate-300 text-xs font-medium mb-1">
                          {r.userName} {r.isStaff && <span className="text-amber-400">(Support Team)</span>}
                          <span className="text-slate-600 ml-2">{r.createdAt.split(' ')[0]}</span>
                        </p>
                        <p className="text-slate-400 text-sm">{r.message}</p>
                      </div>
                    ))}

                    {isStaff && (
                      <div className="flex items-center gap-2 mt-2">
                        <select
                          value={ticket.status}
                          onChange={e => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                          className="bg-slate-800 border border-slate-700 text-white text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:border-amber-400"
                        >
                          {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <span className="text-slate-600 text-xs">Change status</span>
                      </div>
                    )}

                    {(isStaff || ticket.status === 'Open' || ticket.status === 'In Progress') && (
                      <div className="flex gap-2">
                        <input
                          value={replyMsg[ticket.id] || ''}
                          onChange={e => setReplyMsg(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && handleReply(ticket.id)}
                          placeholder="Type a reply..."
                          className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500"
                        />
                        <button
                          onClick={() => handleReply(ticket.id)}
                          disabled={!replyMsg[ticket.id]?.trim()}
                          className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          <MessageSquare size={14} />Send
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">New Support Ticket</h3>
              <button onClick={() => setShowNewTicket(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Subject</label>
                <input
                  value={newTicket.subject}
                  onChange={e => setNewTicket(t => ({ ...t, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={e => setNewTicket(t => ({ ...t, priority: e.target.value as SupportTicket['priority'] }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Message</label>
                <textarea
                  value={newTicket.message}
                  onChange={e => setNewTicket(t => ({ ...t, message: e.target.value }))}
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNewTicket(false)} className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!newTicket.subject.trim() || !newTicket.message.trim()}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg text-sm"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
