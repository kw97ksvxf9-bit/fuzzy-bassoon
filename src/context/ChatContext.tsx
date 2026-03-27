import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isStaff: boolean;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  messages: ChatMessage[];
  status: 'active' | 'closed';
  lastUpdated: string;
}

interface ChatContextType {
  conversations: ChatConversation[];
  sendMessage: (userId: string, userName: string, message: string, isStaff?: boolean, staffName?: string) => void;
  getConversation: (userId: string) => ChatConversation | undefined;
  markAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
}

const ChatContext = createContext<ChatContextType | null>(null);

const STAFF_NAME = 'VaultSecure Support';
const STAFF_ID = 'STAFF-001';

function getAutoReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('withdraw')) {
    return "I can see your withdrawal request. Our team is reviewing it. Cash withdrawals take up to 14 business days excluding weekends and public holidays. You'll receive an email once it's processed.";
  }
  if (lower.includes('fee')) {
    return "Platform fees include a storage fee (0.5% of asset value) and a processing fee (1.5% of withdrawal value). You can choose to have fees deducted from your investment or pay upfront.";
  }
  if (lower.includes('status')) {
    return "Let me check on that for you. All pending requests are reviewed within 2-3 business days. You'll receive an email notification once processed.";
  }
  return "Thank you for reaching out. An advisor will be with you shortly. Our support hours are Mon-Fri 8am-6pm SAST.";
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  const sendMessage = useCallback((userId: string, userName: string, message: string, isStaff = false, staffName = STAFF_NAME) => {
    const now = new Date().toISOString();
    const msgId = `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newMsg: ChatMessage = {
      id: msgId,
      senderId: isStaff ? STAFF_ID : userId,
      senderName: isStaff ? staffName : userName,
      message,
      timestamp: now,
      isStaff,
      isRead: isStaff,
    };

    setConversations(prev => {
      const existing = prev.find(c => c.userId === userId);
      if (existing) {
        return prev.map(c =>
          c.userId === userId
            ? { ...c, messages: [...c.messages, newMsg], lastUpdated: now }
            : c
        );
      }
      const newConv: ChatConversation = {
        id: `CONV-${Date.now()}`,
        userId,
        userName,
        messages: [newMsg],
        status: 'active',
        lastUpdated: now,
      };
      return [...prev, newConv];
    });

    if (!isStaff) {
      const delay = 3000 + Math.random() * 2000;
      setTimeout(() => {
        const replyId = `MSG-${Date.now()}-reply`;
        const replyNow = new Date().toISOString();
        const reply: ChatMessage = {
          id: replyId,
          senderId: STAFF_ID,
          senderName: STAFF_NAME,
          message: getAutoReply(message),
          timestamp: replyNow,
          isStaff: true,
          isRead: false,
        };
        setConversations(prev =>
          prev.map(c =>
            c.userId === userId
              ? { ...c, messages: [...c.messages, reply], lastUpdated: replyNow }
              : c
          )
        );
      }, delay);
    }
  }, []);

  const getConversation = useCallback((userId: string) => {
    return conversations.find(c => c.userId === userId);
  }, [conversations]);

  const markAsRead = useCallback((userId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.userId === userId
          ? { ...c, messages: c.messages.map(m => ({ ...m, isRead: true })) }
          : c
      )
    );
  }, []);

  const getUnreadCount = useCallback((userId: string) => {
    const conv = conversations.find(c => c.userId === userId);
    if (!conv) return 0;
    return conv.messages.filter(m => m.isStaff && !m.isRead).length;
  }, [conversations]);

  return (
    <ChatContext.Provider value={{ conversations, sendMessage, getConversation, markAsRead, getUnreadCount }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
