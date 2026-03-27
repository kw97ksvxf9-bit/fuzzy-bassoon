import type {
  User,
  Asset,
  Transaction,
  WithdrawalRequest,
  SystemLog,
  SupportTicket,
  Notification,
  PlatformSettings,
} from '../types.js';

// ── Users ──────────────────────────────────────────────────────────────────
export const users: User[] = [
  {
    id: 'USR000',
    name: 'Victor Superadmin',
    email: 'superadmin@vaultsecure.co.za',
    role: 'superadmin',
    verified: true,
    phone: '+27 11 000 0000',
    address: '1 Vault Tower, Sandton, 2196',
    idNumber: '7001015800080',
    accountType: 'Superadmin',
  },
  {
    id: 'USR001',
    name: 'James Whitfield',
    email: 'admin@vaultsecure.co.za',
    role: 'admin',
    verified: true,
    phone: '+27 11 234 5678',
    address: '45 Sandton Drive, Johannesburg, 2196',
    idNumber: '8001015800080',
    accountType: 'Premium',
  },
  {
    id: 'USR002',
    name: 'Sarah Dlamini',
    email: 'user@vaultsecure.co.za',
    role: 'user',
    verified: true,
    phone: '+27 21 456 7890',
    address: '12 Buitenkant Street, Cape Town, 8001',
    idNumber: '9205165234087',
    accountType: 'Standard',
  },
  {
    id: 'USR003',
    name: 'Marcus van der Berg',
    email: 'marcus@example.com',
    role: 'user',
    verified: false,
    phone: '+27 31 678 9012',
    address: '78 Musgrave Road, Durban, 4001',
    idNumber: '8712085432019',
    accountType: 'Standard',
  },
];

// ── Credentials ────────────────────────────────────────────────────────────
export const CREDENTIALS: Record<string, string> = {
  'superadmin@vaultsecure.co.za': 'Super@1234',
  'admin@vaultsecure.co.za': 'Admin@1234',
  'user@vaultsecure.co.za': 'User@1234',
};

// ── Assets ─────────────────────────────────────────────────────────────────
export const assets: Asset[] = [
  { id: 'AST-001', userId: 'USR002', type: 'Gold', quantity: 5, unit: 'bars', depositDate: '2023-01-15', valueUSD: 500000, location: 'VAULT-A-12', status: 'Stored' },
  { id: 'AST-002', userId: 'USR002', type: 'Diamond', quantity: 12, unit: 'carats', depositDate: '2023-03-22', valueUSD: 240000, location: 'VAULT-B-03', status: 'Stored' },
  { id: 'AST-003', userId: 'USR002', type: 'Platinum', quantity: 2, unit: 'kg', depositDate: '2023-06-10', valueUSD: 62000, location: 'VAULT-A-07', status: 'Pending Withdrawal' },
  { id: 'AST-004', userId: 'USR002', type: 'Gold', quantity: 3, unit: 'bars', depositDate: '2022-11-05', valueUSD: 300000, location: 'VAULT-C-01', status: 'Stored' },
  { id: 'AST-005', userId: 'USR002', type: 'Diamond', quantity: 8, unit: 'carats', depositDate: '2024-01-20', valueUSD: 160000, location: 'VAULT-B-11', status: 'Stored' },
  { id: 'AST-006', userId: 'USR001', type: 'Gold', quantity: 10, unit: 'bars', depositDate: '2022-05-20', valueUSD: 1000000, location: 'VAULT-A-01', status: 'Stored' },
  { id: 'AST-007', userId: 'USR003', type: 'Silver', quantity: 50, unit: 'kg', depositDate: '2023-08-14', valueUSD: 35000, location: 'VAULT-C-08', status: 'Stored' },
];

// ── Transactions ───────────────────────────────────────────────────────────
export const transactions: Transaction[] = [
  { id: 'TXN-001', userId: 'USR002', type: 'Deposit', assetId: 'AST-001', amount: 500000, date: '2023-01-15', status: 'Completed', description: 'Gold bars deposit - 5 bars' },
  { id: 'TXN-002', userId: 'USR002', type: 'Fee', assetId: 'AST-001', amount: 2500, date: '2023-02-01', status: 'Completed', description: 'Monthly storage fee - January' },
  { id: 'TXN-003', userId: 'USR002', type: 'Deposit', assetId: 'AST-002', amount: 240000, date: '2023-03-22', status: 'Completed', description: 'Diamond deposit - 12 carats' },
  { id: 'TXN-004', userId: 'USR002', type: 'Fee', assetId: 'AST-002', amount: 1200, date: '2023-04-01', status: 'Completed', description: 'Monthly storage fee - March' },
  { id: 'TXN-005', userId: 'USR002', type: 'Deposit', assetId: 'AST-003', amount: 62000, date: '2023-06-10', status: 'Completed', description: 'Platinum deposit - 2kg' },
  { id: 'TXN-006', userId: 'USR002', type: 'Withdrawal', assetId: 'AST-003', amount: 62000, date: '2024-02-15', status: 'Pending', description: 'Platinum withdrawal request - 2kg' },
  { id: 'TXN-007', userId: 'USR002', type: 'Fee', assetId: 'AST-004', amount: 1500, date: '2024-01-01', status: 'Completed', description: 'Annual storage fee' },
  { id: 'TXN-008', userId: 'USR002', type: 'Deposit', assetId: 'AST-005', amount: 160000, date: '2024-01-20', status: 'Completed', description: 'Diamond deposit - 8 carats' },
];

// ── Withdrawal Requests ────────────────────────────────────────────────────
export const withdrawalRequests: WithdrawalRequest[] = [
  { id: 'WR-001', userId: 'USR002', userName: 'Sarah Dlamini', assetId: 'AST-003', assetType: 'Platinum', requestDate: '2024-02-15', status: 'Pending' },
  { id: 'WR-002', userId: 'USR003', userName: 'Marcus van der Berg', assetId: 'AST-007', assetType: 'Silver', requestDate: '2024-02-10', status: 'Approved' },
];

// ── System Logs ────────────────────────────────────────────────────────────
export const systemLogs: SystemLog[] = [
  { id: 'LOG-001', timestamp: '2024-02-15 09:23:45', level: 'INFO', message: 'User USR002 logged in successfully', user: 'user@vaultsecure.co.za' },
  { id: 'LOG-002', timestamp: '2024-02-15 09:45:12', level: 'INFO', message: 'Withdrawal request WR-001 created for AST-003', user: 'user@vaultsecure.co.za' },
  { id: 'LOG-003', timestamp: '2024-02-15 10:02:33', level: 'WARNING', message: 'Failed login attempt for admin@vaultsecure.co.za', user: 'system' },
  { id: 'LOG-004', timestamp: '2024-02-14 14:30:00', level: 'INFO', message: 'Asset AST-005 deposit completed', user: 'admin@vaultsecure.co.za' },
  { id: 'LOG-005', timestamp: '2024-02-14 11:15:22', level: 'INFO', message: 'System backup completed successfully', user: 'system' },
  { id: 'LOG-006', timestamp: '2024-02-13 16:44:08', level: 'ERROR', message: 'Certificate generation failed for AST-004 - retrying', user: 'system' },
  { id: 'LOG-007', timestamp: '2024-02-13 16:45:10', level: 'INFO', message: 'Certificate generation retry successful for AST-004', user: 'system' },
];

// ── Support Tickets ────────────────────────────────────────────────────────
export const supportTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    userId: 'USR002',
    userName: 'Sarah Dlamini',
    subject: 'Withdrawal delay',
    message: 'My platinum withdrawal (WR-001) has been pending for 3 weeks. Can you provide an update?',
    priority: 'High',
    status: 'Open',
    createdAt: '2024-02-20 10:00:00',
    updatedAt: '2024-02-20 10:00:00',
    responses: [],
  },
];

// ── Notifications ──────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'NOT-001', userId: 'USR002', text: 'Your withdrawal request WR-001 is pending review.', type: 'info', read: false, createdAt: '2024-02-15 09:45:12' },
  { id: 'NOT-002', userId: 'USR002', text: 'Storage fee of $1,500 has been applied to your account.', type: 'warning', read: true, createdAt: '2024-01-01 08:00:00' },
];

// ── Platform Settings ──────────────────────────────────────────────────────
export const platformSettings: PlatformSettings = {
  storageFeeRate: 0.005,
  maintenanceMode: false,
  notificationsEnabled: true,
  maxDailyWithdrawal: 1000000,
  platformName: 'InvestgoV1.001 — VaultSecure SA',
  supportEmail: 'support@vaultsecure.co.za',
};

// ── Counter state ──────────────────────────────────────────────────────────
const _counters: Record<string, number> = {
  USR: 3,
  AST: 7,
  TXN: 8,
  WR: 2,
  LOG: 7,
  TKT: 1,
  NOT: 2,
};

export function generateId(prefix: string): string {
  _counters[prefix] = (_counters[prefix] ?? 0) + 1;
  return `${prefix}-${String(_counters[prefix]).padStart(3, '0')}`;
}

export function addLog(message: string, level: SystemLog['level'] = 'INFO', user = 'system'): void {
  systemLogs.push({
    id: generateId('LOG'),
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    level,
    message,
    user,
  });
}

export function addNotification(userId: string, text: string, type: Notification['type'] = 'info'): void {
  notifications.push({
    id: generateId('NOT'),
    userId,
    text,
    type,
    read: false,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  });
}
