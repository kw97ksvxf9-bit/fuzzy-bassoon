import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VaultLogo from '../components/VaultLogo';

export default function OTP() {
  const { verifyOTP, pendingUser, logout } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!pendingUser) {
      navigate('/');
    }
  }, [pendingUser, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }
    const success = verifyOTP(code);
    if (success) {
      const user = pendingUser;
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError('Invalid OTP. Demo code: 123456');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
  };

  const handleBack = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VaultLogo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-white">Two-Factor Verification</h1>
          <p className="text-slate-400 text-sm mt-2">VaultSecure SA Security Protocol</p>
        </div>

        <div className="bg-slate-900 border border-amber-400/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-400/10 rounded-lg">
              <ShieldCheck size={22} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Enter Verification Code</h2>
              <p className="text-slate-400 text-xs mt-0.5">Sent to {pendingUser?.email}</p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-amber-400/10 border border-amber-400/30 rounded-lg">
            <p className="text-amber-400 text-xs text-center">Demo OTP code: <strong>123456</strong></p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              ))}
            </div>

            <div className="text-center mb-4">
              {canResend ? (
                <button type="button" onClick={handleResend} className="text-amber-400 text-sm hover:underline">
                  Resend OTP
                </button>
              ) : (
                <p className="text-slate-500 text-sm">
                  Resend in <span className="text-amber-400 font-mono">{countdown}s</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 rounded-lg transition-colors"
            >
              Verify & Access Portal
            </button>
          </form>

          <button
            onClick={handleBack}
            className="mt-4 flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors mx-auto"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
