import { Shield, Lock, FileCheck, Building2, Award, Globe, CheckCircle, Server, Eye, Zap } from 'lucide-react';

const securityBadges = [
  {
    icon: Lock,
    title: '256-bit AES Encryption',
    description: 'All data at rest and in transit is encrypted using AES-256, the same standard used by global financial institutions and government agencies.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  {
    icon: Shield,
    title: 'Multi-layer Vault Security',
    description: 'Physical vault facilities employ multiple independent security layers: biometric access, 24/7 armed guarding, seismic sensors, and dual-key controls.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: Award,
    title: 'LBMA Accredited Storage',
    description: 'Our primary vault facility is accredited by the London Bullion Market Association (LBMA), the global standard for precious metal custody.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
  {
    icon: Building2,
    title: "Lloyd's of London Insured",
    description: "All stored assets are insured up to $50M per facility through Lloyd's of London — one of the world's oldest and most reputable insurance markets.",
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
  {
    icon: FileCheck,
    title: 'SOC 2 Type II Compliant',
    description: 'Our digital infrastructure and operational processes are independently audited and certified SOC 2 Type II compliant, covering security, availability, and confidentiality.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
  {
    icon: Globe,
    title: 'FSCA Registered',
    description: 'VaultSecure SA is registered and regulated by the Financial Sector Conduct Authority (FSCA) of South Africa (FSP Licence No. 45123).',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
];

const auditFeatures = [
  { icon: Eye, label: 'Comprehensive Audit Logs', description: 'Every platform action is logged with timestamp, user identity, IP address, and device fingerprint.' },
  { icon: Server, label: 'Immutable Transaction Records', description: 'All asset transactions are recorded in append-only logs that cannot be altered or deleted.' },
  { icon: Zap, label: 'Real-time Anomaly Detection', description: 'Automated systems monitor for unusual activity patterns, triggering immediate security alerts.' },
  { icon: CheckCircle, label: 'Third-party Independent Audits', description: 'Annual audits by independent, internationally accredited firms. Last audit: Q1 2026.' },
];

const complianceItems = [
  { label: 'POPIA', description: 'Protection of Personal Information Act (South Africa)', status: 'Compliant' },
  { label: 'FICA', description: 'Financial Intelligence Centre Act (South Africa)', status: 'Compliant' },
  { label: 'GDPR', description: 'General Data Protection Regulation (EU)', status: 'Compliant' },
  { label: 'CCPA', description: 'California Consumer Privacy Act (USA)', status: 'Compliant' },
  { label: 'ISO 27001', description: 'International Information Security Management Standard', status: 'Certified' },
  { label: 'PCI DSS', description: 'Payment Card Industry Data Security Standard', status: 'Level 1' },
];

export default function Security() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-400/20 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-amber-400/10 rounded-2xl">
            <Shield size={48} className="text-amber-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Trust &amp; Security</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          VaultSecure SA is built on a foundation of bank-grade security, regulatory compliance, and transparent operations. Your assets and data are protected by multiple independent layers of security.
        </p>
      </div>

      <div>
        <h2 className="text-white font-semibold text-lg mb-4">Security Certifications &amp; Credentials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityBadges.map(badge => (
            <div key={badge.title} className={`bg-slate-900 border ${badge.border} rounded-xl p-5`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 ${badge.bg} rounded-xl flex-shrink-0`}>
                  <badge.icon size={22} className={badge.color} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{badge.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-white font-semibold">Insurance Coverage</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 rounded-xl p-5">
            <div className="p-3 bg-green-500/10 rounded-xl flex-shrink-0">
              <Building2 size={28} className="text-green-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">$50,000,000 per facility</p>
              <p className="text-green-400 text-sm font-medium">Lloyd's of London All-Risk Coverage</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Insurer', value: "Lloyd's of London Syndicates" },
              { label: 'Policy Type', value: 'All-Risk Blanket Coverage' },
              { label: 'Coverage Limit', value: 'USD $50M per vault facility' },
              { label: 'Covered Perils', value: 'Theft, Fire, Flood, Natural Disaster, Accidental Damage' },
              { label: 'Renewal', value: 'Annual — last renewed Q1 2026' },
              { label: 'Certificate', value: 'Available on request via Support' },
            ].map(item => (
              <div key={item.label} className="bg-slate-800 rounded-lg px-4 py-3">
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-slate-300 text-xs font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-white font-semibold">Audit Trail &amp; Transparency</h2>
          <p className="text-slate-500 text-xs mt-1">All transactions are recorded and independently auditable</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {auditFeatures.map(feature => (
            <div key={feature.label} className="flex items-start gap-3">
              <div className="p-2 bg-amber-400/10 rounded-lg flex-shrink-0 mt-0.5">
                <feature.icon size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium mb-1">{feature.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-white font-semibold">Regulatory Compliance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="text-left px-6 py-3 text-slate-400 font-medium">Standard / Regulation</th>
                <th className="text-left px-6 py-3 text-slate-400 font-medium hidden sm:table-cell">Description</th>
                <th className="text-left px-6 py-3 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {complianceItems.map(item => (
                <tr key={item.label} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3 text-amber-400 font-bold font-mono text-xs">{item.label}</td>
                  <td className="px-6 py-3 text-slate-400 text-xs hidden sm:table-cell">{item.description}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full border border-green-500/30">
                      <CheckCircle size={10} />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6 text-center">
        <p className="text-slate-400 text-sm leading-relaxed mb-2">
          VaultSecure SA is independently audited on a quarterly basis. Security certifications and compliance reports are available to institutional clients upon request.
        </p>
        <p className="text-slate-500 text-xs">Last security audit: Q1 2026 · Next scheduled: Q2 2026</p>
      </div>
    </div>
  );
}
