import { useState } from 'react';
import { Upload, CheckCircle, Clock, XCircle, FileText, Camera, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';

interface DocUpload {
  type: string;
  icon: React.ElementType;
  label: string;
  description: string;
  fileName: string | null;
}

const kycStatusConfig = {
  unverified: { label: 'Unverified', color: 'text-slate-400', bg: 'bg-slate-500/20 border-slate-500/30', icon: AlertTriangle },
  pending: { label: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30', icon: Clock },
  verified: { label: 'Verified', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30', icon: ShieldCheck },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', icon: XCircle },
};

export default function KYC() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { submitKyc, allUsers } = useAssets();

  const liveUser = allUsers.find(u => u.id === currentUser?.id) ?? currentUser;
  const kycStatus = (liveUser?.kycStatus ?? 'unverified') as keyof typeof kycStatusConfig;
  const cfg = kycStatusConfig[kycStatus];
  const StatusIcon = cfg.icon;

  const [docs, setDocs] = useState<DocUpload[]>([
    { type: 'Government ID', icon: FileText, label: 'Government ID', description: 'Passport or National ID card (both sides)', fileName: null },
    { type: 'Proof of Address', icon: MapPin, label: 'Proof of Address', description: 'Utility bill or bank statement (not older than 3 months)', fileName: null },
    { type: 'Selfie', icon: Camera, label: 'Selfie Verification', description: 'Clear photo of your face holding your ID document', fileName: null },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const handleFileSelect = (index: number, file: File | null) => {
    if (!file) return;
    setDocs(prev => prev.map((d, i) => i === index ? { ...d, fileName: file.name } : d));
  };

  const allUploaded = docs.every(d => d.fileName !== null);

  const handleSubmit = () => {
    if (!currentUser || !allUploaded) return;
    const today = new Date().toISOString().split('T')[0];
    const documents = docs.map(d => ({
      type: d.type,
      fileName: d.fileName!,
      uploadDate: today,
    }));
    submitKyc(currentUser.id, documents);
    updateCurrentUser({ kycStatus: 'pending', kycSubmittedAt: new Date().toISOString() });
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Status Card */}
      <div className={`bg-slate-900 border rounded-xl p-6 ${cfg.bg}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${cfg.bg}`}>
            <StatusIcon size={24} className={cfg.color} />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">KYC Verification Status</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
              {liveUser?.kycSubmittedAt && (
                <span className="text-slate-500 text-xs">
                  Submitted: {new Date(liveUser.kycSubmittedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {kycStatus === 'unverified' && (
          <p className="text-slate-400 text-sm mt-4">
            Complete identity verification to unlock all platform features. Upload the required documents below.
          </p>
        )}
        {kycStatus === 'pending' && (
          <p className="text-slate-400 text-sm mt-4">
            Your documents are under review. This typically takes 1-3 business days. You will be notified once reviewed.
          </p>
        )}
        {kycStatus === 'verified' && (
          <p className="text-green-400 text-sm mt-4">
            ✓ Your identity has been fully verified. You have access to all platform features.
          </p>
        )}
        {kycStatus === 'rejected' && (
          <div className="mt-4">
            <p className="text-red-400 text-sm">
              Your KYC submission was not approved. Please review the reason below and resubmit.
            </p>
            {liveUser?.kycRejectionReason && (
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-xs font-medium">Rejection reason:</p>
                <p className="text-slate-300 text-sm mt-1">{liveUser.kycRejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Existing Documents */}
      {liveUser?.kycDocuments && liveUser.kycDocuments.length > 0 && kycStatus !== 'unverified' && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Submitted Documents</h3>
          <div className="space-y-3">
            {liveUser.kycDocuments.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{doc.type}</p>
                  <p className="text-slate-500 text-xs truncate">{doc.fileName}</p>
                </div>
                <span className="text-slate-500 text-xs flex-shrink-0">{doc.uploadDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Form — show when unverified or rejected */}
      {(kycStatus === 'unverified' || kycStatus === 'rejected') && !submitted && (
        <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-6 space-y-5">
          <h3 className="text-white font-semibold">Upload Verification Documents</h3>
          <p className="text-slate-400 text-sm">All documents must be clear, legible, and valid. Accepted formats: PDF, JPG, PNG (max 10MB each).</p>

          <div className="space-y-4">
            {docs.map((doc, i) => {
              const Icon = doc.icon;
              return (
                <div key={doc.type}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className="text-amber-400" />
                    <span className="text-white text-sm font-medium">{doc.label}</span>
                    {doc.fileName && <CheckCircle size={14} className="text-green-400" />}
                  </div>
                  <p className="text-slate-500 text-xs mb-2">{doc.description}</p>
                  <label className={`flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${doc.fileName ? 'border-green-500/50 bg-green-500/5' : 'border-slate-600 hover:border-amber-400 bg-slate-800/50'}`}>
                    <Upload size={18} className={doc.fileName ? 'text-green-400' : 'text-slate-500'} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${doc.fileName ? 'text-green-400' : 'text-slate-400'}`}>
                        {doc.fileName ? doc.fileName : 'Click to select file'}
                      </p>
                      {!doc.fileName && <p className="text-xs text-slate-600">PDF, JPG, PNG up to 10MB</p>}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => handleFileSelect(i, e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allUploaded}
            className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-lg text-sm transition-colors"
          >
            Submit for Verification
          </button>

          {!allUploaded && (
            <p className="text-center text-slate-500 text-xs">Please upload all 3 documents before submitting</p>
          )}
        </div>
      )}

      {/* Success message after submission */}
      {submitted && (
        <div className="bg-slate-900 border border-green-500/30 rounded-xl p-6 text-center">
          <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg mb-2">Documents Submitted</h3>
          <p className="text-slate-400 text-sm">
            Your KYC documents have been submitted for review. You will be notified within 1-3 business days.
          </p>
        </div>
      )}

      {/* Info box */}
      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
        <h4 className="text-amber-400 font-medium text-sm mb-3">Why do we need this?</h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Required by FSCA and FICA regulations for financial compliance</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Protects your assets from unauthorised access</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Required to unlock withdrawals above the standard threshold</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Your documents are encrypted and stored securely</li>
        </ul>
      </div>
    </div>
  );
}
