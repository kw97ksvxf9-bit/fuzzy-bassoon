export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  verified: boolean;
  suspended?: boolean;
  phone: string;
  address: string;
  idNumber: string;
  accountType: string;
}

export interface Asset {
  id: string;
  userId: string;
  type: string;
  quantity: number;
  unit: string;
  depositDate: string;
  valueUSD: number;
  location: string;
  status: 'Stored' | 'Pending Withdrawal' | 'Delivered';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'Deposit' | 'Withdrawal' | 'Fee' | 'Investment';
  assetId: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Processing';
  description: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  assetId: string;
  assetType: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  user: string;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface PlatformSettings {
  storageFeeRate: number;
  maintenanceMode: boolean;
  notificationsEnabled: boolean;
  maxDailyWithdrawal: number;
  platformName: string;
  supportEmail: string;
}
