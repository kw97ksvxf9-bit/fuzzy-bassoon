import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  assets as initialAssets,
  transactions as initialTransactions,
  withdrawalRequests as initialWithdrawalRequests,
  supportTickets as initialSupportTickets,
  notifications as initialNotifications,
  platformSettings as initialPlatformSettings,
  users as initialUsers,
  type Asset,
  type Transaction,
  type WithdrawalRequest,
  type SupportTicket,
  type TicketResponse,
  type Notification,
  type PlatformSettings,
  type User,
} from '../data/mockData';

interface AssetsContextType {
  assets: Asset[];
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];
  supportTickets: SupportTicket[];
  notifications: Notification[];
  platformSettings: PlatformSettings;
  allUsers: User[];
  addDeposit: (asset: Asset, transaction: Transaction) => void;
  addInvestment: (asset: Asset, transaction: Transaction) => void;
  requestWithdrawal: (
    assetId: string,
    userId: string,
    userName: string,
    assetType: string,
    extras?: {
      withdrawalMethod?: 'bank_transfer' | 'physical_delivery';
      bankDetails?: { region: string; bankName: string; accountHolder: string; [key: string]: string };
      deliveryAddress?: string;
      deliveryPhone?: string;
      feeAmount?: number;
      feePaymentMethod?: 'deduct' | 'upfront';
      estimatedCompletion?: string;
    }
  ) => void;
  addFeeTransaction: (transaction: Transaction) => void;
  approveWithdrawal: (requestId: string, notes?: string) => void;
  rejectWithdrawal: (requestId: string, notes?: string) => void;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'responses' | 'createdAt' | 'updatedAt'>) => void;
  respondToTicket: (ticketId: string, response: Omit<TicketResponse, 'id' | 'ticketId' | 'createdAt'>) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  submitKyc: (userId: string, documents: { type: string; fileName: string; uploadDate: string }[]) => void;
  approveKyc: (userId: string) => void;
  rejectKyc: (userId: string, reason: string) => void;
}

const AssetsContext = createContext<AssetsContextType | null>(null);

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(initialWithdrawalRequests);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initialPlatformSettings);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);

  const addDeposit = (asset: Asset, transaction: Transaction) => {
    setAssets(prev => [...prev, asset]);
    setTransactions(prev => [...prev, transaction]);
  };

  const addInvestment = (asset: Asset, transaction: Transaction) => {
    setAssets(prev => [...prev, asset]);
    setTransactions(prev => [...prev, transaction]);
  };

  const requestWithdrawal = (
    assetId: string,
    userId: string,
    userName: string,
    assetType: string,
    extras?: {
      withdrawalMethod?: 'bank_transfer' | 'physical_delivery';
      bankDetails?: { region: string; bankName: string; accountHolder: string; [key: string]: string };
      deliveryAddress?: string;
      deliveryPhone?: string;
      feeAmount?: number;
      feePaymentMethod?: 'deduct' | 'upfront';
      estimatedCompletion?: string;
    }
  ) => {
    setWithdrawalRequests(prev => {
      const id = `WR-${String(prev.length + 1).padStart(3, '0')}`;
      const newRequest: WithdrawalRequest = {
        id,
        userId,
        userName,
        assetId,
        assetType,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        ...extras,
      };
      return [...prev, newRequest];
    });
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'Pending Withdrawal' as const } : a));
    if (extras?.feeAmount && extras.feePaymentMethod === 'deduct') {
      const feeId = `TXN-FEE-${Date.now()}`;
      const feeTxn: Transaction = {
        id: feeId,
        userId,
        type: 'Fee',
        assetId,
        amount: extras.feeAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        description: `Withdrawal fee (deducted) for ${assetType}`,
      };
      setTransactions(prev => [...prev, feeTxn]);
    }
  };

  const addFeeTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const approveWithdrawal = (requestId: string, notes?: string) => {
    setWithdrawalRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status: 'Approved' as const, notes } : req)
    );
  };

  const rejectWithdrawal = (requestId: string, notes?: string) => {
    setWithdrawalRequests(prev => {
      const req = prev.find(r => r.id === requestId);
      if (req) {
        setAssets(assets => assets.map(a => a.id === req.assetId ? { ...a, status: 'Stored' as const } : a));
      }
      return prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' as const, notes } : r);
    });
  };

  const addSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'responses' | 'createdAt' | 'updatedAt'>) => {
    setSupportTickets(prev => {
      const now = new Date().toISOString().replace('T', ' ').split('.')[0];
      const id = `TKT-${String(prev.length + 1).padStart(3, '0')}`;
      return [...prev, { ...ticket, id, responses: [], createdAt: now, updatedAt: now }];
    });
  };

  const respondToTicket = (ticketId: string, response: Omit<TicketResponse, 'id' | 'ticketId' | 'createdAt'>) => {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    const respId = `RESP-${Date.now()}`;
    setSupportTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? {
              ...ticket,
              updatedAt: now,
              responses: [...ticket.responses, { ...response, id: respId, ticketId, createdAt: now }],
            }
          : ticket
      )
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    setSupportTickets(prev =>
      prev.map(ticket => ticket.id === ticketId ? { ...ticket, status, updatedAt: now } : ticket)
    );
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsRead = (userId: string) => {
    setNotifications(prev =>
      prev.map(n => n.userId === userId ? { ...n, read: true } : n)
    );
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({ ...prev, ...settings }));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const submitKyc = (userId: string, documents: { type: string; fileName: string; uploadDate: string }[]) => {
    const now = new Date().toISOString();
    setAllUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      kycStatus: 'pending' as const,
      kycDocuments: documents,
      kycSubmittedAt: now,
    } : u));
    setNotifications(prev => {
      const user = allUsers.find(u => u.id === userId);
      const id = `NOTIF-KYC-${Date.now()}`;
      const adminNotifs: Notification[] = allUsers
        .filter(u => u.role === 'superadmin' || u.role === 'admin')
        .map(admin => ({
          id: `${id}-${admin.id}`,
          userId: admin.id,
          type: 'kyc' as const,
          title: 'KYC Submission',
          message: `${user?.name ?? 'A user'} has submitted KYC documents for review`,
          read: false,
          createdAt: now,
          link: '/superadmin',
        }));
      const userNotif: Notification = {
        id,
        userId,
        type: 'kyc',
        title: 'KYC Submitted',
        message: 'Your KYC documents have been submitted and are under review',
        read: false,
        createdAt: now,
        link: '/kyc',
      };
      return [...prev, userNotif, ...adminNotifs];
    });
  };

  const approveKyc = (userId: string) => {
    const now = new Date().toISOString();
    setAllUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      kycStatus: 'verified' as const,
      verified: true,
      kycReviewedAt: now,
      kycRejectionReason: undefined,
    } : u));
    setNotifications(prev => [...prev, {
      id: `NOTIF-KYC-APPROVED-${Date.now()}`,
      userId,
      type: 'kyc' as const,
      title: 'KYC Approved',
      message: 'Your identity has been verified. Your account is now fully verified.',
      read: false,
      createdAt: now,
      link: '/profile',
    }]);
  };

  const rejectKyc = (userId: string, reason: string) => {
    const now = new Date().toISOString();
    setAllUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      kycStatus: 'rejected' as const,
      kycReviewedAt: now,
      kycRejectionReason: reason,
    } : u));
    setNotifications(prev => [...prev, {
      id: `NOTIF-KYC-REJECTED-${Date.now()}`,
      userId,
      type: 'kyc' as const,
      title: 'KYC Rejected',
      message: `Your KYC submission was not approved. Reason: ${reason}`,
      read: false,
      createdAt: now,
      link: '/kyc',
    }]);
  };

  return (
    <AssetsContext.Provider value={{
      assets,
      transactions,
      withdrawalRequests,
      supportTickets,
      notifications,
      platformSettings,
      allUsers,
      addDeposit,
      addInvestment,
      requestWithdrawal,
      approveWithdrawal,
      rejectWithdrawal,
      addFeeTransaction,
      addSupportTicket,
      respondToTicket,
      updateTicketStatus,
      markNotificationRead,
      markAllNotificationsRead,
      updatePlatformSettings,
      updateUser,
      submitKyc,
      approveKyc,
      rejectKyc,
    }}>
      {children}
    </AssetsContext.Provider>
  );
}

export function useAssets(): AssetsContextType {
  const ctx = useContext(AssetsContext);
  if (!ctx) throw new Error('useAssets must be used within AssetsProvider');
  return ctx;
}
