import { createContext, useContext, useState, type ReactNode } from 'react';
import { type User, users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  pendingUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  verifyOTP: (otp: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
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
    if (otp === '123456' && pendingUser) {
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

  return (
    <AuthContext.Provider value={{
      currentUser,
      pendingUser,
      login,
      verifyOTP,
      logout,
      isAuthenticated: !!currentUser,
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
