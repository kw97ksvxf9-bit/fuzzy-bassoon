const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('investgo_token', token);
    } else {
      localStorage.removeItem('investgo_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('investgo_token');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options?.headers as Record<string, string> | undefined) },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
      throw new Error(error.message || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  // Auth
  login(email: string, password: string) {
    return this.request<{ success: boolean; message: string; pendingUserId?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  verifyOTP(otp: string, pendingUserId: string) {
    return this.request<{ success: boolean; token: string; user: Record<string, unknown> }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp, pendingUserId }),
    });
  }

  logout() {
    return this.request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' });
  }

  // Users
  getUsers() { return this.request<Record<string, unknown>[]>('/users'); }
  getUser(id: string) { return this.request<Record<string, unknown>>(`/users/${id}`); }
  createUser(data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/users', { method: 'POST', body: JSON.stringify(data) });
  }
  updateUser(id: string, data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  // Assets
  getAssets() { return this.request<Record<string, unknown>[]>('/assets'); }
  createAsset(data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/assets', { method: 'POST', body: JSON.stringify(data) });
  }
  updateAsset(id: string, data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  // Transactions
  getTransactions() { return this.request<Record<string, unknown>[]>('/transactions'); }
  createTransaction(data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/transactions', { method: 'POST', body: JSON.stringify(data) });
  }

  // Withdrawals
  getWithdrawals() { return this.request<Record<string, unknown>[]>('/withdrawals'); }
  createWithdrawal(data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/withdrawals', { method: 'POST', body: JSON.stringify(data) });
  }
  approveWithdrawal(id: string) {
    return this.request<Record<string, unknown>>(`/withdrawals/${id}/approve`, { method: 'PUT' });
  }
  rejectWithdrawal(id: string) {
    return this.request<Record<string, unknown>>(`/withdrawals/${id}/reject`, { method: 'PUT' });
  }

  // Support
  getTickets() { return this.request<Record<string, unknown>[]>('/support/tickets'); }
  createTicket(data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/support/tickets', { method: 'POST', body: JSON.stringify(data) });
  }
  respondToTicket(id: string, message: string) {
    return this.request<Record<string, unknown>>(`/support/tickets/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
  updateTicketStatus(id: string, status: string) {
    return this.request<Record<string, unknown>>(`/support/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Notifications
  getNotifications() { return this.request<Record<string, unknown>[]>('/notifications'); }
  markNotificationRead(id: string) {
    return this.request<Record<string, unknown>>(`/notifications/${id}/read`, { method: 'PUT' });
  }
  markAllNotificationsRead() {
    return this.request<{ success: boolean; message: string }>('/notifications/read-all', { method: 'PUT' });
  }

  // Settings
  getSettings() { return this.request<Record<string, unknown>>('/settings'); }
  updateSettings(data: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/settings', { method: 'PUT', body: JSON.stringify(data) });
  }

  // Logs
  getLogs(level?: string) {
    return this.request<Record<string, unknown>[]>(`/logs${level ? `?level=${level}` : ''}`);
  }

  // Health
  health() { return this.request<{ status: string; version: string; uptime: number }>('/health'); }
}

export const api = new ApiService();
export default api;
