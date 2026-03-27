import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

function isBusinessHours(): boolean {
  const now = new Date();
  const sastHour = (now.getUTCHours() + 2) % 24;
  const day = now.getUTCDay();
  return day >= 1 && day <= 5 && sastHour >= 8 && sastHour < 18;
}

export default function ChatWidget() {
  const { currentUser } = useAuth();
  const { sendMessage, getConversation, markAsRead, getUnreadCount } = useChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const online = isBusinessHours();

  if (!currentUser) return null;

  const userId = currentUser.id;
  const conversation = getConversation(userId);
  const messages = conversation?.messages || [];
  const unread = getUnreadCount(userId);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (open) {
      markAsRead(userId);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages.length, userId, markAsRead]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    sendMessage(userId, currentUser.name, msg);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 5500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 w-80 sm:w-96 bg-slate-900 border border-amber-400/20 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <MessageCircle size={18} className="text-amber-400" />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${online ? 'bg-green-400' : 'bg-slate-500'}`} />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">Live Chat — VaultSecure Support</div>
                <div className="text-xs text-slate-400">{online ? 'Online · Typically replies within minutes' : "Offline · Leave a message, we'll reply within 24h"}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px' }}>
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm py-8">
                <MessageCircle size={32} className="mx-auto mb-3 text-slate-600" />
                <p>Start a conversation with our support team.</p>
                {!online && <p className="mt-2 text-xs">We're currently offline. Leave a message and we'll respond within 24 hours.</p>}
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isStaff ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.isStaff ? 'bg-slate-700 text-slate-200 rounded-tl-sm' : 'bg-amber-500/30 text-amber-100 border border-amber-500/30 rounded-tr-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-60">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400 placeholder-slate-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl p-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110"
        aria-label="Open live chat"
      >
        {open ? <Minus size={22} /> : <MessageCircle size={22} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </>
  );
}
