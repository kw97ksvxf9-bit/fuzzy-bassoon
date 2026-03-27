import { DollarSign, Clock, Shield, Truck, Info } from 'lucide-react';

const feeSchedule = [
  {
    category: 'Storage',
    icon: Shield,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    fees: [
      { name: 'Annual Storage Fee', rate: '0.5% per annum', description: 'Charged on the total insured value of stored assets, billed monthly.' },
      { name: 'Insurance Premium', rate: '0.1% per month', description: 'Comprehensive insurance coverage via Lloyd\'s of London on stored value.' },
    ],
  },
  {
    category: 'Withdrawals',
    icon: DollarSign,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    fees: [
      { name: 'Withdrawal Processing Fee', rate: '$50 flat + 0.25% of asset value', description: 'Applied to all withdrawal requests to cover administrative and processing costs.' },
      { name: 'Express Delivery Surcharge', rate: '$200 flat', description: 'Optional surcharge for priority processing and expedited courier delivery (Physical Delivery only).' },
    ],
  },
  {
    category: 'Bank Transfer',
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    fees: [
      { name: 'International Wire Fee', rate: '$25 per transfer', description: 'Applied to international wire transfers (non-ZAR accounts).' },
      { name: 'Currency Conversion', rate: 'Mid-market rate + 0.5%', description: 'Foreign currency conversions at mid-market rate plus a 0.5% margin.' },
    ],
  },
  {
    category: 'Physical Delivery',
    icon: Truck,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    fees: [
      { name: 'Domestic Courier (South Africa)', rate: 'Included', description: 'Insured door-to-door delivery within South Africa at no extra charge.' },
      { name: 'International Courier', rate: 'From $150', description: 'Fully insured international courier, priced by destination and weight.' },
      { name: 'Re-delivery Fee', rate: '$75 per attempt', description: 'Charged if a delivery attempt fails due to recipient unavailability.' },
    ],
  },
];

const exampleFeeCalc = [
  { label: 'Asset Value', value: '$100,000' },
  { label: 'Withdrawal Processing Fee ($50 flat)', value: '$50.00' },
  { label: 'Withdrawal Processing Fee (0.25%)', value: '$250.00' },
  { label: 'Total Processing Fee', value: '$300.00' },
  { label: 'Net Amount Received', value: '$99,700.00', highlight: true },
];

export default function Fees() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Fees &amp; Charges</h1>
        <p className="text-slate-400 text-sm">
          Transparent fee schedule for all VaultSecure SA services. All fees are displayed in USD unless otherwise stated.
        </p>
      </div>

      <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-5 py-4 flex items-start gap-3">
        <Info size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-slate-300 text-sm leading-relaxed">
          All fees listed below are indicative and for display purposes. Actual fees are confirmed at time of transaction and appear in your withdrawal wizard before you submit. VaultSecure SA reserves the right to revise this schedule with 30 days' notice.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Storage Fee', value: '0.5% p.a.', sub: 'of stored asset value', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Processing Fee', value: '$50 + 0.25%', sub: 'per withdrawal request', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Insurance', value: '0.1% / month', sub: 'of insured stored value', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map(card => (
          <div key={card.label} className="bg-slate-900 border border-amber-400/20 rounded-xl p-5">
            <div className={`p-2 ${card.bg} rounded-lg w-fit mb-3`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-white font-bold text-xl">{card.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {feeSchedule.map(section => (
        <div key={section.category} className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700">
            <div className={`p-2 ${section.bg} rounded-lg`}>
              <section.icon size={18} className={section.color} />
            </div>
            <h2 className="text-white font-semibold">{section.category} Fees</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="text-left px-5 py-3 text-slate-400 font-medium">Fee Name</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium">Rate</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {section.fees.map((fee, i) => (
                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-slate-300 font-medium">{fee.name}</td>
                  <td className="px-5 py-3 text-amber-400 font-mono text-xs whitespace-nowrap">{fee.rate}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs hidden md:table-cell">{fee.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700">
          <h2 className="text-white font-semibold">Fee Calculation Example</h2>
          <p className="text-slate-500 text-xs mt-1">Bank Transfer withdrawal for a $100,000 asset</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {exampleFeeCalc.map((row, i) => (
              <tr key={i} className={`border-t border-slate-800 ${row.highlight ? 'bg-amber-400/5' : ''}`}>
                <td className={`px-5 py-3 ${row.highlight ? 'text-white font-semibold' : 'text-slate-400'}`}>{row.label}</td>
                <td className={`px-5 py-3 text-right font-mono ${row.highlight ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-5 text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-400">Notes &amp; Conditions</p>
        <ul className="list-disc list-inside space-y-1 leading-relaxed">
          <li>Fees are deducted from the asset value or billed separately based on your preference during withdrawal.</li>
          <li>Storage and insurance fees are calculated daily and billed monthly on the 1st business day of each month.</li>
          <li>All quoted fees are exclusive of VAT (15% South African VAT applies where applicable).</li>
          <li>VaultSecure SA reserves the right to amend this schedule with 30 days prior written notice.</li>
          <li>For custom fee arrangements (institutional clients), contact enterprise@vaultsecure.co.za.</li>
        </ul>
      </div>
    </div>
  );
}
