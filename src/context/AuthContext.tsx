import { createContext, useContext, useState, type ReactNode } from 'react';
import { type User, users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  pendingUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  verifyOTP: (otp: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_CREDENTIALS: Record<string, string> = {
  'superadmin@vaultsecure.co.za': 'Super@1234',
  'admin@vaultsecure.co.za': 'Admin@1234',
  'user@vaultsecure.co.za': 'User@1234',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('vaultsecure_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    const validPassword = VALID_CREDENTIALS[email];
    if (!validPassword || validPassword !== password) {
      return { success: false, message: 'Invalid email or password' };
    }
    const user = users.find(u => u.email === email);
    if (!user) return { success: false, message: 'User not found' };
    setPendingUser(user);
    return { success: true, message: 'OTP sent' };
  };

  const verifyOTP = (otp: string) => {
    if (!pendingUser) return false;
    // If user has 2FA enabled via authenticator app, accept any valid 6-digit number
    if (pendingUser.twoFactorEnabled && /^\d{6}$/.test(otp)) {
      setCurrentUser(pendingUser);
      localStorage.setItem('vaultsecure_user', JSON.stringify(pendingUser));
      setPendingUser(null);
      return true;
    }
    // Standard email OTP verification (demo code: 123456)
    if (otp === '123456') {
      setCurrentUser(pendingUser);
      localStorage.setItem('vaultsecure_user', JSON.stringify(pendingUser));
      setPendingUser(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setPendingUser(null);
    localStorage.removeItem('vaultsecure_user');
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('vaultsecure_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      pendingUser,
      login,
      verifyOTP,
      logout,
      isAuthenticated: !!currentUser,
      updateCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
