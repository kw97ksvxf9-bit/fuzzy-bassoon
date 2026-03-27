import { useState } from 'react';
import { CheckCircle, Upload, Shield, Bell, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

interface PasswordForm { current: string; newPassword: string; confirm: string; }

export default function Profile() {
  const { currentUser } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sms: false, withdrawal: true, fees: true, security: true });
  const { register, handleSubmit, reset } = useForm<PasswordForm>();

  const onPasswordSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirm) return;
    setPwSuccess(true); reset(); setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Personal Information</h2>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full"><CheckCircle size={13} className="text-green-400" /><span className="text-green-400 text-xs font-medium">Verified</span></div>
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
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4"><Shield size={18} className="text-amber-400" /><h2 className="text-white font-semibold">Security Settings</h2></div>
        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-3"><Shield size={20} className="text-green-400" /><div><p className="text-white text-sm font-medium">Two-Factor Authentication</p><p className="text-slate-400 text-xs">OTP via email on every login</p></div></div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">Enabled</span>
        </div>
      </div>
    </div>
  );
}
