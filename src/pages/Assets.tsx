import { useState, useEffect } from 'react';
import { Download, ArrowUpRight, Filter, X, Banknote, Package, ChevronRight, ChevronLeft, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';
import { CURRENCIES, type Currency, formatCurrency } from '../data/currencies';
import { useGoldPrice, TROY_OZ_PER_BAR } from '../hooks/useGoldPrice';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<string, string> = {
  'Stored': 'bg-green-500/20 text-green-400 border border-green-500/30',
  'Pending Withdrawal': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'Delivered': 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

function downloadCertificate(id: string) {
  const content = `VAULTSECURE SA - ASSET CERTIFICATE\n\nAsset ID: ${id}\nDate: ${new Date().toLocaleDateString()}\nCertified by VaultSecure SA`;
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `certificate-${id}.pdf`; a.click();
  URL.revokeObjectURL(url);
}

function getDuration(depositDate: string): string {
  const deposit = new Date(depositDate);
  const now = new Date();
  const months = (now.getFullYear() - deposit.getFullYear()) * 12 + now.getMonth() - deposit.getMonth();
  if (months < 1) return '< 1 month';
  if (months < 12) return `${months} months`;
  return `${Math.floor(months / 12)}y ${months % 12}m`;
}

function addBusinessDays(date: Date, days: number): string {
  let count = 0;
  const d = new Date(date);
  while (count < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) count++;
  }
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

const REGIONS = ['United Kingdom', 'United States', 'Canada', 'European Union', 'South Africa', 'Other'];

const STEP_LABELS = ['Method', 'Details', 'Fees', 'Confirm'];

export default function Assets() {
  const { currentUser } = useAuth();
  const { assets: allAssets, requestWithdrawal, platformSettings, allUsers } = useAssets();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const goldPrice = useGoldPrice();

  // Get live user data (reflects admin changes like withdrawalBlocked)
  const liveCurrentUser = allUsers.find(u => u.id === currentUser?.id) ?? currentUser;

  // Withdrawal block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Wizard state
  const [wizardAsset, setWizardAsset] = useState<typeof allAssets[number] | null>(null);
  const [step, setStep] = useState(1);
  const [withdrawalType, setWithdrawalType] = useState<'bank_transfer' | 'physical_delivery' | null>(null);
  const [bankRegion, setBankRegion] = useState('United Kingdom');
  const [bankDetails, setBankDetails] = useState({
    accountHolder: currentUser?.name || '',
    bankName: '',
    sortCode: '',
    accountNumber: '',
    routingNumber: '',
    institutionNumber: '',
    transitNumber: '',
    iban: '',
    bic: '',
    branchCode: '',
    swift: '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');
  const [deliveryPhone, setDeliveryPhone] = useState(currentUser?.phone || '');
  const [feePaymentMethod, setFeePaymentMethod] = useState<'deduct' | 'upfront' | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [toast, setToast] = useState('');

  const fmt = (val: number) => formatCurrency(val, currency);

  const userAssets = currentUser?.role === 'admin' ? allAssets : allAssets.filter(a => a.userId === currentUser?.id);
  const types = ['All', ...Array.from(new Set(userAssets.map(a => a.type)))];
  const statuses = ['All', 'Stored', 'Pending Withdrawal', 'Delivered'];
  const filtered = userAssets.filter(a =>
    (filterType === 'All' || a.type === filterType) &&
    (filterStatus === 'All' || a.status === filterStatus)
  );

  function getCurrentValueUSD(asset: typeof allAssets[number]): number {
    if (asset.type === 'Gold' && !goldPrice.isLoading) {
      return asset.quantity * TROY_OZ_PER_BAR * goldPrice.priceUSD;
    }
    return asset.valueUSD;
  }

  // Fee calculations
  const storageFee = wizardAsset ? wizardAsset.valueUSD * platformSettings.storageFeeRate / 100 : 0;
  const processingFee = wizardAsset ? wizardAsset.valueUSD * 0.015 : 0;
  const totalFees = storageFee + processingFee;
  const netAmount = wizardAsset ? wizardAsset.valueUSD - totalFees : 0;

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function openWizard(asset: typeof allAssets[number]) {
    if (liveCurrentUser?.withdrawalBlocked) {
      setShowBlockModal(true);
      return;
    }
    setWizardAsset(asset);
    setStep(1);
    setWithdrawalType(null);
    setFeePaymentMethod(null);
    setConfirmed(false);
    setBankRegion('United Kingdom');
    setBankDetails({ accountHolder: currentUser?.name || '', bankName: '', sortCode: '', accountNumber: '', routingNumber: '', institutionNumber: '', transitNumber: '', iban: '', bic: '', branchCode: '', swift: '' });
    setDeliveryAddress(currentUser?.address || '');
    setDeliveryPhone(currentUser?.phone || '');
  }

  function validateStep2(): boolean {
    if (withdrawalType === 'bank_transfer') {
      if (!bankDetails.accountHolder || !bankDetails.bankName) return false;
      if (bankRegion === 'United Kingdom') return !!(bankDetails.sortCode && bankDetails.accountNumber);
      if (bankRegion === 'United States') return !!(bankDetails.routingNumber && bankDetails.accountNumber);
      if (bankRegion === 'Canada') return !!(bankDetails.institutionNumber && bankDetails.transitNumber && bankDetails.accountNumber);
      if (bankRegion === 'European Union') return !!(bankDetails.iban && bankDetails.bic);
      if (bankRegion === 'South Africa') return !!(bankDetails.branchCode && bankDetails.accountNumber);
      return !!(bankDetails.swift && bankDetails.accountNumber);
    }
    if (withdrawalType === 'physical_delivery') {
      return !!(deliveryAddress && deliveryPhone);
    }
    return false;
  }

  function handleSubmit() {
    if (!wizardAsset || !currentUser || !withdrawalType || !feePaymentMethod) return;
    const ref = `WR-${Date.now().toString().slice(-6)}`;
    requestWithdrawal(wizardAsset.id, currentUser.id, currentUser.name, wizardAsset.type, {
      withdrawalMethod: withdrawalType,
      bankDetails: withdrawalType === 'bank_transfer'
        ? { region: bankRegion, bankName: bankDetails.bankName, accountHolder: bankDetails.accountHolder, ...bankDetails }
        : undefined,
      deliveryAddress: withdrawalType === 'physical_delivery' ? deliveryAddress : undefined,
      deliveryPhone: withdrawalType === 'physical_delivery' ? deliveryPhone : undefined,
      feeAmount: totalFees,
      feePaymentMethod,
      estimatedCompletion: addBusinessDays(new Date(), withdrawalType === 'bank_transfer' ? 14 : 21),
    });
    setToast(`Withdrawal request submitted! Reference: ${ref}`);
    setWizardAsset(null);
  }

  const inputCls = "w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-400 placeholder-slate-500 transition-colors";
  const labelCls = "block text-xs text-slate-400 mb-1";

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-2xl text-sm">
          {toast}
        </div>
      )}

      {/* Warning banner for flagged accounts */}
      {liveCurrentUser?.withdrawalBlocked && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">
            ⚠ Your account has a restriction. Some actions may be limited. Contact support for assistance.
          </p>
        </div>
      )}

      {/* Withdrawal Blocked Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <h2 className="text-white font-semibold text-base">Withdrawal Temporarily Unavailable</h2>
              </div>
              <button onClick={() => setShowBlockModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                There is an issue with your account that requires attention before withdrawals can be processed. Please contact our support team for assistance.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-xs font-mono">
                  ⚠ Account flagged — withdrawal access restricted. Reference: ACC-{liveCurrentUser?.id}
                </p>
              </div>
              <div className="text-slate-400 text-xs space-y-1">
                <p>📧 support@vaultsecure.co.za</p>
                <p>📞 +27 10 999 0000</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setShowBlockModal(false); navigate('/support'); }}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={16} className="text-slate-500" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400">
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg flex-wrap">
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => setCurrency(c.code)} className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${currency === c.code ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}>{c.code}</button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                {['Asset ID', 'Type', 'Quantity', 'Deposit Date', 'Duration', `Deposit Value (${currency})`, `Current Value (${currency})`, 'Location', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => {
                const currentValueUSD = getCurrentValueUSD(asset);
                const isGold = asset.type === 'Gold';
                return (
                  <tr key={asset.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-amber-400 font-mono text-xs font-medium">{asset.id}</td>
                    <td className="px-4 py-3 text-white font-medium">{asset.type}</td>
                    <td className="px-4 py-3 text-slate-300">{asset.quantity} {asset.unit}</td>
                    <td className="px-4 py-3 text-slate-400">{asset.depositDate}</td>
                    <td className="px-4 py-3 text-slate-400">{getDuration(asset.depositDate)}</td>
                    <td className="px-4 py-3 text-slate-400">{fmt(asset.valueUSD)}</td>
                    <td className="px-4 py-3 font-medium">
                      {isGold && !goldPrice.isLoading ? (
                        <span className={currentValueUSD > asset.valueUSD ? 'text-green-400' : 'text-red-400'}>
                          {fmt(currentValueUSD)}
                        </span>
                      ) : (
                        <span className="text-white">{fmt(currentValueUSD)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.location}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[asset.status]}`}>{asset.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => downloadCertificate(asset.id)} className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
                          <Download size={12} />Certificate
                        </button>
                        {asset.status === 'Stored' && (
                          <button onClick={() => openWizard(asset)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
                            <ArrowUpRight size={12} />Withdraw
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-slate-500">No assets found matching filters</div>}
        </div>
      </div>

      {/* Withdrawal Wizard Modal */}
      {wizardAsset && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-400/20 rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <div>
                <h2 className="text-white font-semibold text-lg">Withdrawal Request</h2>
                <p className="text-slate-500 text-xs mt-0.5">{wizardAsset.id} · {wizardAsset.type} · {wizardAsset.location}</p>
              </div>
              <button onClick={() => setWizardAsset(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center px-5 py-4 border-b border-slate-800">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const active = step === n;
                const done = step > n;
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${done ? 'bg-amber-400 border-amber-400 text-slate-900' : active ? 'border-amber-400 text-amber-400' : 'border-slate-600 text-slate-500'}`}>
                        {done ? <Check size={14} /> : n}
                      </div>
                      <span className={`text-xs hidden sm:block ${active ? 'text-white' : done ? 'text-amber-400' : 'text-slate-500'}`}>{label}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-px mx-2 ${done ? 'bg-amber-400' : 'bg-slate-700'}`} />}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="p-5 min-h-[280px]">
              {/* Step 1: Choose withdrawal type */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm">Select how you would like to receive your assets:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setWithdrawalType('bank_transfer')}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${withdrawalType === 'bank_transfer' ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}`}
                    >
                      <Banknote size={28} className={`mb-3 ${withdrawalType === 'bank_transfer' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <div className="font-semibold text-white text-sm mb-1">Bank Transfer (Cash)</div>
                      <div className="text-slate-400 text-xs leading-relaxed">Funds will be transferred to your nominated bank account. Processing time: up to 14 business days.</div>
                    </button>
                    <button
                      onClick={() => setWithdrawalType('physical_delivery')}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${withdrawalType === 'physical_delivery' ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}`}
                    >
                      <Package size={28} className={`mb-3 ${withdrawalType === 'physical_delivery' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <div className="font-semibold text-white text-sm mb-1">Raw Mineral / Physical Delivery</div>
                      <div className="text-slate-400 text-xs leading-relaxed">Receive the physical asset via insured courier. Delivery time: 5-21 business days.</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2A: Bank Transfer Details */}
              {step === 2 && withdrawalType === 'bank_transfer' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Region / Country</label>
                    <select value={bankRegion} onChange={e => setBankRegion(e.target.value)} className={inputCls}>
                      {REGIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Account Holder Name</label>
                      <input value={bankDetails.accountHolder} onChange={e => setBankDetails(p => ({ ...p, accountHolder: e.target.value }))} className={inputCls} placeholder="Full legal name" />
                    </div>
                    <div>
                      <label className={labelCls}>Bank Name</label>
                      <input value={bankDetails.bankName} onChange={e => setBankDetails(p => ({ ...p, bankName: e.target.value }))} className={inputCls} placeholder="e.g. Barclays" />
                    </div>
                  </div>
                  {bankRegion === 'United Kingdom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Sort Code</label>
                        <input value={bankDetails.sortCode} onChange={e => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 6);
                          if (v.length > 4) v = v.slice(0, 2) + '-' + v.slice(2, 4) + '-' + v.slice(4);
                          else if (v.length > 2) v = v.slice(0, 2) + '-' + v.slice(2);
                          setBankDetails(p => ({ ...p, sortCode: v }));
                        }} className={inputCls} placeholder="XX-XX-XX" maxLength={8} />
                      </div>
                      <div>
                        <label className={labelCls}>Account Number</label>
                        <input value={bankDetails.accountNumber} onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 8) }))} className={inputCls} placeholder="8 digits" maxLength={8} />
                      </div>
                    </div>
                  )}
                  {bankRegion === 'United States' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Routing Number</label>
                        <input value={bankDetails.routingNumber} onChange={e => setBankDetails(p => ({ ...p, routingNumber: e.target.value.replace(/\D/g, '').slice(0, 9) }))} className={inputCls} placeholder="9 digits" maxLength={9} />
                      </div>
                      <div>
                        <label className={labelCls}>Account Number</label>
                        <input value={bankDetails.accountNumber} onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '') }))} className={inputCls} placeholder="Account number" />
                      </div>
                    </div>
                  )}
                  {bankRegion === 'Canada' && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Institution #</label>
                        <input value={bankDetails.institutionNumber} onChange={e => setBankDetails(p => ({ ...p, institutionNumber: e.target.value.replace(/\D/g, '').slice(0, 3) }))} className={inputCls} placeholder="3 digits" maxLength={3} />
                      </div>
                      <div>
                        <label className={labelCls}>Transit #</label>
                        <input value={bankDetails.transitNumber} onChange={e => setBankDetails(p => ({ ...p, transitNumber: e.target.value.replace(/\D/g, '').slice(0, 5) }))} className={inputCls} placeholder="5 digits" maxLength={5} />
                      </div>
                      <div>
                        <label className={labelCls}>Account Number</label>
                        <input value={bankDetails.accountNumber} onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '') }))} className={inputCls} placeholder="Account #" />
                      </div>
                    </div>
                  )}
                  {bankRegion === 'European Union' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>IBAN</label>
                        <input value={bankDetails.iban} onChange={e => setBankDetails(p => ({ ...p, iban: e.target.value.toUpperCase() }))} className={inputCls} placeholder="DE89 3704 0044..." />
                      </div>
                      <div>
                        <label className={labelCls}>BIC / SWIFT</label>
                        <input value={bankDetails.bic} onChange={e => setBankDetails(p => ({ ...p, bic: e.target.value.toUpperCase() }))} className={inputCls} placeholder="COBADEFFXXX" />
                      </div>
                    </div>
                  )}
                  {bankRegion === 'South Africa' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Branch Code</label>
                        <input value={bankDetails.branchCode} onChange={e => setBankDetails(p => ({ ...p, branchCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} className={inputCls} placeholder="6 digits" maxLength={6} />
                      </div>
                      <div>
                        <label className={labelCls}>Account Number</label>
                        <input value={bankDetails.accountNumber} onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '') }))} className={inputCls} placeholder="Account number" />
                      </div>
                    </div>
                  )}
                  {bankRegion === 'Other' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>SWIFT / BIC Code</label>
                        <input value={bankDetails.swift} onChange={e => setBankDetails(p => ({ ...p, swift: e.target.value.toUpperCase() }))} className={inputCls} placeholder="SWIFT code" />
                      </div>
                      <div>
                        <label className={labelCls}>Account Number</label>
                        <input value={bankDetails.accountNumber} onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value }))} className={inputCls} placeholder="Account number" />
                      </div>
                    </div>
                  )}
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-400">
                    ⏱ Cash withdrawals take up to 14 business days to process (excluding weekends and public holidays). You will receive a confirmation email once the transfer has been initiated.
                  </div>
                </div>
              )}

              {/* Step 2B: Physical Delivery */}
              {step === 2 && withdrawalType === 'physical_delivery' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Delivery Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      rows={3}
                      className={inputCls + ' resize-none'}
                      placeholder="Full delivery address"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Phone</label>
                    <input value={deliveryPhone} onChange={e => setDeliveryPhone(e.target.value)} className={inputCls} placeholder="+27 xx xxx xxxx" />
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-400">
                    Physical delivery is arranged via insured courier. Delivery timelines vary by location (5-21 business days). You will be contacted to arrange a delivery window.
                  </div>
                </div>
              )}

              {/* Step 3: Fees */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-slate-700">
                          <td className="px-4 py-3 text-slate-400">Storage Fee ({platformSettings.storageFeeRate}%)</td>
                          <td className="px-4 py-3 text-right text-slate-300">${storageFee.toFixed(2)}</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="px-4 py-3 text-slate-400">Processing Fee (1.5%)</td>
                          <td className="px-4 py-3 text-right text-slate-300">${processingFee.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-white font-semibold">Total Fees</td>
                          <td className="px-4 py-3 text-right text-amber-400 font-bold">${totalFees.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">How would you like to pay the fees?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setFeePaymentMethod('deduct')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${feePaymentMethod === 'deduct' ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}`}
                    >
                      <div className="font-semibold text-white text-sm mb-1">Deduct from Investment</div>
                      <div className="text-slate-400 text-xs leading-relaxed">The fee will be deducted from your investment value. You will receive <span className="text-green-400 font-medium">${netAmount.toFixed(2)}</span>.</div>
                    </button>
                    <div className={`p-4 rounded-xl border-2 transition-all ${feePaymentMethod === 'upfront' ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700 bg-slate-800/50'}`}>
                      <button onClick={() => setFeePaymentMethod('upfront')} className="w-full text-left">
                        <div className="font-semibold text-white text-sm mb-1">Pay Upfront</div>
                        <div className="text-slate-400 text-xs leading-relaxed mb-3">You will be invoiced <span className="text-amber-400 font-medium">${totalFees.toFixed(2)}</span>. Your withdrawal will be processed once payment is confirmed. Payment methods: bank transfer or card.</div>
                      </button>
                      {feePaymentMethod === 'upfront' && (
                        <button
                          onClick={() => setToast('Payment link sent to your email')}
                          className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-semibold py-2 rounded-lg transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-xl border border-slate-700 divide-y divide-slate-700">
                    <div className="px-4 py-3 flex justify-between text-sm">
                      <span className="text-slate-400">Asset</span>
                      <span className="text-white font-medium">{wizardAsset.type} ({wizardAsset.id})</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between text-sm">
                      <span className="text-slate-400">Method</span>
                      <span className="text-white font-medium">{withdrawalType === 'bank_transfer' ? 'Bank Transfer' : 'Physical Delivery'}</span>
                    </div>
                    {withdrawalType === 'bank_transfer' && (
                      <>
                        <div className="px-4 py-3 flex justify-between text-sm">
                          <span className="text-slate-400">Region</span>
                          <span className="text-white">{bankRegion}</span>
                        </div>
                        <div className="px-4 py-3 flex justify-between text-sm">
                          <span className="text-slate-400">Bank</span>
                          <span className="text-white">{bankDetails.bankName}</span>
                        </div>
                        <div className="px-4 py-3 flex justify-between text-sm">
                          <span className="text-slate-400">Account Holder</span>
                          <span className="text-white">{bankDetails.accountHolder}</span>
                        </div>
                      </>
                    )}
                    {withdrawalType === 'physical_delivery' && (
                      <>
                        <div className="px-4 py-3 flex justify-between text-sm">
                          <span className="text-slate-400">Delivery Address</span>
                          <span className="text-white text-right max-w-[60%]">{deliveryAddress}</span>
                        </div>
                        <div className="px-4 py-3 flex justify-between text-sm">
                          <span className="text-slate-400">Contact Phone</span>
                          <span className="text-white">{deliveryPhone}</span>
                        </div>
                      </>
                    )}
                    <div className="px-4 py-3 flex justify-between text-sm">
                      <span className="text-slate-400">Total Fees</span>
                      <span className="text-amber-400 font-medium">${totalFees.toFixed(2)}</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between text-sm">
                      <span className="text-slate-400">Fee Payment</span>
                      <span className="text-white">{feePaymentMethod === 'deduct' ? 'Deducted from investment' : 'Pay upfront'}</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between text-sm">
                      <span className="text-slate-400">Est. Completion</span>
                      <span className="text-white">{addBusinessDays(new Date(), withdrawalType === 'bank_transfer' ? 14 : 21)}</span>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={e => setConfirmed(e.target.checked)}
                      className="mt-0.5 accent-amber-400 w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-slate-400 text-xs leading-relaxed">
                      I confirm this withdrawal request and agree to the <span className="text-amber-400">Terms of Service</span> and <span className="text-amber-400">Fee Schedule</span>.
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-5 border-t border-slate-700">
              <button
                onClick={() => step > 1 ? setStep(s => s - 1) : setWizardAsset(null)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm transition-colors"
              >
                <ChevronLeft size={16} />
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              {step < 4 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={
                    (step === 1 && !withdrawalType) ||
                    (step === 2 && !validateStep2()) ||
                    (step === 3 && !feePaymentMethod)
                  }
                  className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg text-sm transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!confirmed || !feePaymentMethod}
                  className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg text-sm transition-colors"
                >
                  <Check size={16} /> Submit Withdrawal Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
