import { useState } from 'react';
import { CheckCircle, Upload, Shield, Bell, Lock, ShieldCheck, ShieldOff, Smartphone, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';

interface PasswordForm { current: string; newPassword: string; confirm: string; }

const kycStatusConfig = {
  unverified: { label: 'Unverified', color: 'text-slate-400', bg: 'bg-slate-500/20 border-slate-500/30', icon: AlertTriangle },
  pending: { label: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30', icon: Clock },
  verified: { label: 'Verified', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30', icon: ShieldCheck },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', icon: XCircle },
};

export default function Profile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { allUsers } = useAssets();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sms: false, withdrawal: true, fees: true, security: true });
  const { register, handleSubmit, reset } = useForm<PasswordForm>();

  // 2FA state
  const liveUser = allUsers.find(u => u.id === currentUser?.id) ?? currentUser;
  const [twoFAStep, setTwoFAStep] = useState<'idle' | 'scan' | 'verify' | 'done'>('idle');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  const is2FAEnabled = liveUser?.twoFactorEnabled ?? currentUser?.twoFactorEnabled ?? false;

  const onPasswordSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirm) return;
    setPwSuccess(true); reset(); setTimeout(() => setPwSuccess(false), 3000);
  };

  const handle2FAEnable = () => setTwoFAStep('scan');

  const handle2FAVerify = () => {
    if (!/^\d{6}$/.test(twoFACode)) {
      setTwoFAError('Please enter a valid 6-digit code');
      return;
    }
    updateCurrentUser({ twoFactorEnabled: true, twoFactorSetupDate: new Date().toISOString() });
    setTwoFAStep('done');
    setTwoFACode('');
    setTwoFAError('');
  };

  const handle2FADisable = () => {
    updateCurrentUser({ twoFactorEnabled: false, twoFactorSetupDate: undefined });
    setTwoFAStep('idle');
  };

  const kycStatus = (liveUser?.kycStatus ?? 'unverified') as keyof typeof kycStatusConfig;
  const kycCfg = kycStatusConfig[kycStatus];
  const KycIcon = kycCfg.icon;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Personal Information</h2>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${kycCfg.bg}`}>
            <KycIcon size={13} className={kycCfg.color} />
            <span className={`text-xs font-medium ${kycCfg.color}`}>{kycCfg.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 font-bold text-2xl">{currentUser?.name?.charAt(0)}</div>
          <div><h3 className="text-white font-semibold text-xl">{currentUser?.name}</h3><p className="text-slate-400 text-sm">{currentUser?.email}</p><p className="text-amber-400 text-xs mt-0.5 capitalize">{currentUser?.role} · {currentUser?.accountType} Account</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{label:'Full Name',value:currentUser?.name||''},{label:'Email Address',value:currentUser?.email||''},{label:'Phone Number',value:currentUser?.phone||''},{label:'ID Number',value:currentUser?.idNumber||''},{label:'Address',value:currentUser?.address||'',full:true}].map(field => (
            <div key={field.label} className={field.full ? 'sm:col-span-2' : ''}><label className="block text-slate-500 text-xs font-medium mb-1 uppercase tracking-wide">{field.label}</label><div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm">{field.value}</div></div>
          ))}
        </div>
      </div>

      {/* KYC Status */}
      <div className={`bg-slate-900 border rounded-xl p-6 ${kycCfg.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <KycIcon size={20} className={kycCfg.color} />
            <h2 className="text-white font-semibold">Identity Verification (KYC)</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${kycCfg.bg} ${kycCfg.color}`}>{kycCfg.label}</span>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          {kycStatus === 'unverified' && 'Complete identity verification to unlock all platform features.'}
          {kycStatus === 'pending' && 'Your documents are under review. Typically takes 1-3 business days.'}
          {kycStatus === 'verified' && 'Your identity has been fully verified. All features are unlocked.'}
          {kycStatus === 'rejected' && `Your KYC was not approved. ${liveUser?.kycRejectionReason ? `Reason: ${liveUser.kycRejectionReason}` : 'Please resubmit.'}`}
        </p>
        {(kycStatus === 'unverified' || kycStatus === 'rejected') && (
          <button
            onClick={() => navigate('/kyc')}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <ShieldCheck size={14} />
            {kycStatus === 'rejected' ? 'Resubmit Documents' : 'Start Verification'}
          </button>
        )}
        {kycStatus === 'pending' && (
          <button
            onClick={() => navigate('/kyc')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            View Submission
          </button>
        )}
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4"><Upload size={18} className="text-amber-400" /><h2 className="text-white font-semibold">Verification Documents</h2></div>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 hover:border-amber-400 rounded-xl cursor-pointer transition-colors bg-slate-800/50">
          <Upload size={24} className="text-slate-500 mb-2" />
          <span className="text-slate-400 text-sm">{uploadedFile ? uploadedFile : 'Click or drag to upload document'}</span>
          <span className="text-slate-600 text-xs mt-1">PDF, JPG, PNG up to 10MB</span>
          <input type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setUploadedFile(f.name); }} accept=".pdf,.jpg,.jpeg,.png" />
        </label>
        {uploadedFile && <div className="mt-3 flex items-center gap-2 text-green-400 text-sm"><CheckCircle size={14} />{uploadedFile} uploaded successfully</div>}
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4"><Lock size={18} className="text-amber-400" /><h2 className="text-white font-semibold">Change Password</h2></div>
        {pwSuccess && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">Password updated successfully!</div>}
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
          {[{name:'current' as const,label:'Current Password'},{name:'newPassword' as const,label:'New Password'},{name:'confirm' as const,label:'Confirm New Password'}].map(f => (
            <div key={f.name}><label className="block text-slate-300 text-sm font-medium mb-1.5">{f.label}</label><input {...register(f.name,{required:true})} type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 text-sm" /></div>
          ))}
          <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">Update Password</button>
        </form>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4"><Bell size={18} className="text-amber-400" /><h2 className="text-white font-semibold">Notification Preferences</h2></div>
        <div className="space-y-3">
          {Object.entries(notifPrefs).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <span className="text-slate-300 text-sm capitalize">{key === 'sms' ? 'SMS Notifications' : `${key.charAt(0).toUpperCase()+key.slice(1)} Notifications`}</span>
              <button onClick={() => setNotifPrefs(p => ({...p,[key]:!p[key as keyof typeof p]}))} className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-amber-400' : 'bg-slate-700'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-5' : ''}`}/></button>
            </div>
          ))}
        </div>
      </div>

      {/* 2FA Security Section */}
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5"><Shield size={18} className="text-amber-400" /><h2 className="text-white font-semibold">Security Settings</h2></div>

        {/* Email OTP — always on */}
        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
          <div className="flex items-center gap-3"><Shield size={20} className="text-green-400" /><div><p className="text-white text-sm font-medium">Email OTP</p><p className="text-slate-400 text-xs">Verification code sent to your email on every login</p></div></div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">Always On</span>
        </div>

        {/* Authenticator App 2FA */}
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className={is2FAEnabled ? 'text-green-400' : 'text-slate-500'} />
              <div>
                <p className="text-white text-sm font-medium">Authenticator App (2FA)</p>
                <p className="text-slate-400 text-xs">TOTP-based authentication for enhanced security</p>
              </div>
            </div>
            {is2FAEnabled ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">Enabled</span>
            ) : (
              <span className="px-3 py-1 bg-slate-700 text-slate-400 text-xs font-medium rounded-full">Disabled</span>
            )}
          </div>

          {/* Not enabled, not in setup flow */}
          {!is2FAEnabled && twoFAStep === 'idle' && (
            <button
              onClick={handle2FAEnable}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <ShieldCheck size={14} />Enable 2FA
            </button>
          )}

          {/* Step 1: Scan QR */}
          {twoFAStep === 'scan' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl">
                <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center border-4 border-slate-300">
                  <div className="text-center">
                    <Smartphone size={28} className="text-slate-600 mx-auto mb-1" />
                    <p className="text-slate-700 text-xs font-semibold">QR CODE</p>
                    <p className="text-slate-500 text-xs">Scan with app</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-slate-300 text-sm font-medium">Scan with your authenticator app</p>
                <p className="text-slate-500 text-xs mt-1">Google Authenticator, Authy, or any TOTP app</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-center">
                <p className="text-slate-500 text-xs">Manual entry key:</p>
                <p className="text-amber-400 font-mono text-sm mt-1">VAULT-SECURE-DEMO-2FA-KEY</p>
              </div>
              <button
                onClick={() => setTwoFAStep('verify')}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                I've Scanned the QR Code
              </button>
              <button onClick={() => setTwoFAStep('idle')} className="w-full text-slate-400 hover:text-white text-sm py-1">Cancel</button>
            </div>
          )}

          {/* Step 2: Verify code */}
          {twoFAStep === 'verify' && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm">Enter the 6-digit code from your authenticator app to confirm setup:</p>
              {twoFAError && <p className="text-red-400 text-xs">{twoFAError}</p>}
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={twoFACode}
                onChange={e => { setTwoFACode(e.target.value.replace(/\D/g, '')); setTwoFAError(''); }}
                placeholder="000000"
                className="w-full bg-slate-900 border border-slate-600 text-white text-center text-2xl font-mono px-4 py-3 rounded-lg focus:outline-none focus:border-amber-400 placeholder-slate-600 tracking-widest"
              />
              <p className="text-slate-500 text-xs text-center">Enter any 6-digit number for this demo</p>
              <div className="flex gap-3">
                <button onClick={() => { setTwoFAStep('scan'); setTwoFACode(''); setTwoFAError(''); }} className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm">Back</button>
                <button onClick={handle2FAVerify} className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-lg text-sm">Verify & Enable</button>
              </div>
            </div>
          )}

          {/* 2FA Enabled */}
          {(is2FAEnabled || twoFAStep === 'done') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle size={16} />
                <span>2FA is active. Set up: {liveUser?.twoFactorSetupDate ? new Date(liveUser.twoFactorSetupDate).toLocaleDateString() : 'today'}</span>
              </div>
              <button
                onClick={handle2FADisable}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-400/30 hover:bg-red-400/10 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <ShieldOff size={14} />Disable 2FA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
