import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VaultLogo from '../components/VaultLogo';
import { DEMO_CREDENTIALS } from '../data/mockData';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    const result = login(data.email, data.password);
    if (result.success) {
      navigate('/verify');
    } else {
      setError(result.message);
    }
  };

  const fillDemo = (type: 'admin' | 'user') => {
    const creds = DEMO_CREDENTIALS[type];
    setValue('email', creds.email);
    setValue('password', creds.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VaultLogo size={72} />
          </div>
          <h1 className="text-3xl font-bold text-white">VaultSecure SA</h1>
          <p className="text-amber-400 text-sm mt-1">Protecting Generational Wealth Since 1980</p>
          <div className="mt-2 text-slate-500 text-xs">Est. 1980 · Johannesburg, South Africa</div>
        </div>

        <div className="bg-slate-900 border border-amber-400/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Secure Client Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-slate-500 transition-colors"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-slate-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Continue to Verification
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">Demo Credentials</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="text-amber-400 font-medium">Admin:</span> admin@vaultsecure.co.za / Admin@1234
                </div>
                <button onClick={() => fillDemo('admin')} className="text-xs text-amber-400 hover:text-amber-300 underline">Fill</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="text-amber-400 font-medium">User:</span> user@vaultsecure.co.za / User@1234
                </div>
                <button onClick={() => fillDemo('user')} className="text-xs text-amber-400 hover:text-amber-300 underline">Fill</button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2024 VaultSecure SA. All rights reserved. · Regulated by FSCA
        </p>
      </div>
    </div>
  );
}
