import { Shield, Lock, CheckCircle, Globe, FileText, Key } from 'lucide-react';

const badges = [
  { icon: Lock, label: '256-bit SSL Encryption' },
  { icon: Shield, label: 'Insured Vault Storage' },
  { icon: CheckCircle, label: 'KYC/AML Compliant' },
  { icon: Globe, label: 'GDPR & POPIA Compliant' },
  { icon: FileText, label: 'ISO 27001 Certified' },
  { icon: Key, label: 'Two-Factor Authentication' },
];

export default function SecurityBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
          <Icon size={14} className="text-amber-400 flex-shrink-0" />
          <span className="text-slate-400 text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
