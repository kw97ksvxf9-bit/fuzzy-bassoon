import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssetsProvider } from './context/AssetsContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import OTP from './pages/OTP';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import About from './pages/About';

function ProtectedLayoutRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Layout />;
}

function AdminRoute() {
  const { isAuthenticated, currentUser } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Admin />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<OTP />} />
      <Route element={<ProtectedLayoutRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AssetsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AssetsProvider>
    </AuthProvider>
  );
}
