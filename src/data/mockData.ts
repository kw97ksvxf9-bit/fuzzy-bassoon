export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  verified: boolean;
  phone: string;
  address: string;
  idNumber: string;
  accountType: string;
  suspended?: boolean;
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
  notes?: string;
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
  createdAt: string;
  isStaff: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  time: string;
  unread: boolean;
  type: 'withdrawal' | 'fee' | 'deposit' | 'support' | 'system';
}

export interface PlatformSettings {
  storageFeeRate: number;
  maintenanceMode: boolean;
  notificationsEnabled: boolean;
  maxWithdrawalPerDay: number;
}

export const users: User[] = [
  { id: 'USR000', name: 'Director Supreme', email: 'superadmin@vaultsecure.co.za', role: 'superadmin', verified: true, phone: '+27 10 999 0000', address: '1 Gold Reef Road, Johannesburg, 2001', idNumber: '7501015800080', accountType: 'Director' },
  { id: 'USR001', name: 'James Whitfield', email: 'admin@vaultsecure.co.za', role: 'admin', verified: true, phone: '+27 11 234 5678', address: '45 Sandton Drive, Johannesburg, 2196', idNumber: '8001015800080', accountType: 'Premium' },
  { id: 'USR002', name: 'Sarah Dlamini', email: 'user@vaultsecure.co.za', role: 'user', verified: true, phone: '+27 21 456 7890', address: '12 Buitenkant Street, Cape Town, 8001', idNumber: '9205165234087', accountType: 'Standard' },
  { id: 'USR003', name: 'Marcus van der Berg', email: 'marcus@example.com', role: 'user', verified: false, phone: '+27 31 678 9012', address: '78 Musgrave Road, Durban, 4001', idNumber: '8712085432019', accountType: 'Standard' },
];

export const assets: Asset[] = [
  { id: 'AST-001', userId: 'USR002', type: 'Gold', quantity: 5, unit: 'bars', depositDate: '2023-01-15', valueUSD: 500000, location: 'VAULT-A-12', status: 'Stored' },
  { id: 'AST-002', userId: 'USR002', type: 'Diamond', quantity: 12, unit: 'carats', depositDate: '2023-03-22', valueUSD: 240000, location: 'VAULT-B-03', status: 'Stored' },
  { id: 'AST-003', userId: 'USR002', type: 'Platinum', quantity: 2, unit: 'kg', depositDate: '2023-06-10', valueUSD: 62000, location: 'VAULT-A-07', status: 'Pending Withdrawal' },
  { id: 'AST-004', userId: 'USR002', type: 'Gold', quantity: 3, unit: 'bars', depositDate: '2022-11-05', valueUSD: 300000, location: 'VAULT-C-01', status: 'Stored' },
  { id: 'AST-005', userId: 'USR002', type: 'Diamond', quantity: 8, unit: 'carats', depositDate: '2024-01-20', valueUSD: 160000, location: 'VAULT-B-11', status: 'Stored' },
  { id: 'AST-006', userId: 'USR001', type: 'Gold', quantity: 10, unit: 'bars', depositDate: '2022-05-20', valueUSD: 1000000, location: 'VAULT-A-01', status: 'Stored' },
  { id: 'AST-007', userId: 'USR003', type: 'Silver', quantity: 50, unit: 'kg', depositDate: '2023-08-14', valueUSD: 35000, location: 'VAULT-C-08', status: 'Stored' },
];

export const transactions: Transaction[] = [
  { id: 'TXN-001', userId: 'USR002', type: 'Deposit', assetId: 'AST-001', amount: 500000, date: '2023-01-15', status: 'Completed', description: 'Gold bars deposit - 5 bars' },
  { id: 'TXN-002', userId: 'USR002', type: 'Fee', assetId: 'AST-001', amount: 2500, date: '2023-02-01', status: 'Completed', description: 'Monthly storage fee - January' },
  { id: 'TXN-003', userId: 'USR002', type: 'Deposit', assetId: 'AST-002', amount: 240000, date: '2023-03-22', status: 'Completed', description: 'Diamond deposit - 12 carats' },
  { id: 'TXN-004', userId: 'USR002', type: 'Fee', assetId: 'AST-002', amount: 1200, date: '2023-04-01', status: 'Completed', description: 'Monthly storage fee - March' },
  { id: 'TXN-005', userId: 'USR002', type: 'Deposit', assetId: 'AST-003', amount: 62000, date: '2023-06-10', status: 'Completed', description: 'Platinum deposit - 2kg' },
  { id: 'TXN-006', userId: 'USR002', type: 'Withdrawal', assetId: 'AST-003', amount: 62000, date: '2024-02-15', status: 'Pending', description: 'Platinum withdrawal request - 2kg' },
  { id: 'TXN-007', userId: 'USR002', type: 'Fee', assetId: 'AST-004', amount: 1500, date: '2024-01-01', status: 'Completed', description: 'Annual storage fee' },
  { id: 'TXN-008', userId: 'USR002', type: 'Deposit', assetId: 'AST-005', amount: 160000, date: '2024-01-20', status: 'Completed', description: 'Diamond deposit - 8 carats' },
  { id: 'TXN-009', userId: 'USR001', type: 'Investment', assetId: 'AST-006', amount: 1000000, date: '2022-05-20', status: 'Completed', description: 'Gold bars investment - 10 bars (backdated)' },
];

export const withdrawalRequests: WithdrawalRequest[] = [
  { id: 'WR-001', userId: 'USR002', userName: 'Sarah Dlamini', assetId: 'AST-003', assetType: 'Platinum', requestDate: '2024-02-15', status: 'Pending' },
  { id: 'WR-002', userId: 'USR003', userName: 'Marcus van der Berg', assetId: 'AST-007', assetType: 'Silver', requestDate: '2024-02-10', status: 'Approved' },
];

export const systemLogs: SystemLog[] = [
  { id: 'LOG-001', timestamp: '2024-02-15 09:23:45', level: 'INFO', message: 'User USR002 logged in successfully', user: 'user@vaultsecure.co.za' },
  { id: 'LOG-002', timestamp: '2024-02-15 09:45:12', level: 'INFO', message: 'Withdrawal request WR-001 created for AST-003', user: 'user@vaultsecure.co.za' },
  { id: 'LOG-003', timestamp: '2024-02-15 10:02:33', level: 'WARNING', message: 'Failed login attempt for admin@vaultsecure.co.za', user: 'system' },
  { id: 'LOG-004', timestamp: '2024-02-14 14:30:00', level: 'INFO', message: 'Asset AST-005 deposit completed', user: 'admin@vaultsecure.co.za' },
  { id: 'LOG-005', timestamp: '2024-02-14 11:15:22', level: 'INFO', message: 'System backup completed successfully', user: 'system' },
  { id: 'LOG-006', timestamp: '2024-02-13 16:44:08', level: 'ERROR', message: 'Certificate generation failed for AST-004 - retrying', user: 'system' },
  { id: 'LOG-007', timestamp: '2024-02-13 16:45:10', level: 'INFO', message: 'Certificate generation retry successful for AST-004', user: 'system' },
  { id: 'LOG-008', timestamp: '2024-02-12 08:00:00', level: 'INFO', message: 'Superadmin login: Director Supreme', user: 'superadmin@vaultsecure.co.za' },
  { id: 'LOG-009', timestamp: '2024-02-12 08:05:33', level: 'INFO', message: 'Investment TXN-009 recorded for USR001 (backdated 2022-05-20)', user: 'superadmin@vaultsecure.co.za' },
  { id: 'LOG-010', timestamp: '2024-02-11 17:22:01', level: 'WARNING', message: 'Storage fee overdue for AST-007', user: 'system' },
];

export const supportTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    userId: 'USR002',
    userName: 'Sarah Dlamini',
    subject: 'Withdrawal request status inquiry',
    message: 'I submitted a withdrawal request for my Platinum assets (WR-001) on 2024-02-15. Can you please provide an update on when this will be processed?',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2024-02-16 10:30:00',
    updatedAt: '2024-02-16 14:22:00',
    responses: [
      {
        id: 'RESP-001',
        ticketId: 'TKT-001',
        userId: 'USR001',
        userName: 'James Whitfield',
        message: 'Thank you for reaching out. We have received your withdrawal request and it is currently under review. We aim to process all requests within 3-5 business days. You will be notified once a decision is made.',
        createdAt: '2024-02-16 14:22:00',
        isStaff: true,
      },
    ],
  },
  {
    id: 'TKT-002',
    userId: 'USR003',
    userName: 'Marcus van der Berg',
    subject: 'Account verification documents',
    message: 'My account shows as unverified. I submitted my ID documents last week. How long does the verification process take?',
    status: 'Open',
    priority: 'Medium',
    createdAt: '2024-02-14 09:15:00',
    updatedAt: '2024-02-14 09:15:00',
    responses: [],
  },
  {
    id: 'TKT-003',
    userId: 'USR002',
    userName: 'Sarah Dlamini',
    subject: 'Storage fee query',
    message: 'I noticed a storage fee was charged on 2024-01-01. Could you provide a breakdown of how the annual fee is calculated?',
    status: 'Resolved',
    priority: 'Low',
    createdAt: '2024-02-01 11:00:00',
    updatedAt: '2024-02-02 09:30:00',
    responses: [
      {
        id: 'RESP-002',
        ticketId: 'TKT-003',
        userId: 'USR001',
        userName: 'James Whitfield',
        message: 'The annual storage fee is calculated at 0.5% of the total value of assets stored. For your Gold assets (AST-004) valued at $300,000, the fee is $1,500. This covers insurance, security, and facility maintenance for 12 months.',
        createdAt: '2024-02-02 09:30:00',
        isStaff: true,
      },
    ],
  },
];

export const notifications: Notification[] = [
  { id: 'NOTIF-001', userId: 'USR002', text: 'Withdrawal request WR-001 is pending approval', time: '2h ago', unread: true, type: 'withdrawal' },
  { id: 'NOTIF-002', userId: 'USR002', text: 'Storage fee due in 5 days for AST-001', time: '1d ago', unread: true, type: 'fee' },
  { id: 'NOTIF-003', userId: 'USR002', text: 'New certificate available for AST-005', time: '2d ago', unread: false, type: 'deposit' },
  { id: 'NOTIF-004', userId: 'USR001', text: 'New withdrawal request WR-001 requires approval', time: '2h ago', unread: true, type: 'withdrawal' },
  { id: 'NOTIF-005', userId: 'USR001', text: 'Support ticket TKT-002 opened by Marcus van der Berg', time: '3d ago', unread: true, type: 'support' },
  { id: 'NOTIF-006', userId: 'USR000', text: 'Platform: 2 pending withdrawal requests', time: '2h ago', unread: true, type: 'system' },
  { id: 'NOTIF-007', userId: 'USR000', text: 'New user registered: Marcus van der Berg (pending verification)', time: '1w ago', unread: false, type: 'system' },
];

export const platformSettings: PlatformSettings = {
  storageFeeRate: 0.5,
  maintenanceMode: false,
  notificationsEnabled: true,
  maxWithdrawalPerDay: 500000,
};

export const portfolioHistory = [
  { month: 'Mar 2023', value: 740000 },
  { month: 'Apr 2023', value: 755000 },
  { month: 'May 2023', value: 748000 },
  { month: 'Jun 2023', value: 802000 },
  { month: 'Jul 2023', value: 825000 },
  { month: 'Aug 2023', value: 810000 },
  { month: 'Sep 2023', value: 840000 },
  { month: 'Oct 2023', value: 855000 },
  { month: 'Nov 2023', value: 870000 },
  { month: 'Dec 2023', value: 890000 },
  { month: 'Jan 2024', value: 1050000 },
  { month: 'Feb 2024', value: 1262000 },
];

export const assetBreakdown = [
  { name: 'Gold', value: 800000, color: '#D4AF37' },
  { name: 'Diamond', value: 400000, color: '#a78bfa' },
  { name: 'Platinum', value: 62000, color: '#94a3b8' },
];

export const DEMO_CREDENTIALS = {
  superadmin: { email: 'superadmin@vaultsecure.co.za', password: 'Super@1234' },
  admin: { email: 'admin@vaultsecure.co.za', password: 'Admin@1234' },
  user: { email: 'user@vaultsecure.co.za', password: 'User@1234' },
};
