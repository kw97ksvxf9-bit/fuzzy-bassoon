import { FileText } from 'lucide-react';

const sections = [
  {
    number: '1',
    title: 'Introduction',
    content: `These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client", "you", or "your") and VaultSecure SA (Pty) Ltd, a company incorporated in the Republic of South Africa (Registration No. 2019/123456/07) ("VaultSecure SA", "we", "us", or "our"), governing your use of the InvestgoV1.001 platform and all related services (collectively, the "Platform").

By accessing or using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you must immediately discontinue use of the Platform.

These Terms were last updated on 1 March 2026 and are effective from that date.`,
  },
  {
    number: '2',
    title: 'Definitions',
    content: `"Asset" means any precious metal, gemstone, or other physical commodity stored on your behalf in a VaultSecure SA accredited facility.

"Client Portal" means the secure online platform accessed via InvestgoV1.001 through which Clients manage their stored assets.

"Custody" means the safekeeping of your physical Assets in accordance with our storage obligations.

"FSCA" means the Financial Sector Conduct Authority of South Africa, the relevant regulatory authority.

"Processing Day" means any day (excluding Saturdays, Sundays, and South African public holidays) on which VaultSecure SA conducts business operations.

"Withdrawal Request" means a formal instruction submitted via the Platform for the release or liquidation of your stored Assets.`,
  },
  {
    number: '3',
    title: 'Account Registration & Eligibility',
    content: `3.1 To access the Platform, you must be at least 18 years of age and legally capable of entering into binding contracts in your jurisdiction.

3.2 You agree to provide accurate, complete, and current information during registration and to update such information promptly if it changes.

3.3 You are responsible for maintaining the confidentiality of your login credentials, including your two-factor authentication (2FA) codes. You agree to notify us immediately at security@vaultsecure.co.za if you suspect unauthorized access.

3.4 VaultSecure SA reserves the right to suspend or terminate accounts that provide false information, engage in fraudulent activity, or violate these Terms.

3.5 Institutional clients and corporate entities must provide valid company registration documents, proof of authorized signatories, and comply with enhanced due diligence procedures.`,
  },
  {
    number: '4',
    title: 'Storage Services',
    content: `4.1 VaultSecure SA provides secured storage services for precious metals and gemstones in LBMA-accredited, Lloyd's of London insured vault facilities.

4.2 Assets stored with VaultSecure SA remain your property at all times. We hold Assets in custody only and do not take ownership of any Assets.

4.3 Assets are stored in segregated or allocated storage as agreed at the time of deposit. Storage conditions comply with all applicable South African and international standards for precious metal custody.

4.4 VaultSecure SA maintains comprehensive insurance coverage for all stored Assets up to $50,000,000 (fifty million US dollars) per vault facility through Lloyd's of London.

4.5 We reserve the right to relocate Assets between accredited facilities with 14 days' notice, maintaining equivalent security standards at all times.`,
  },
  {
    number: '5',
    title: 'Fees & Charges',
    content: `5.1 Fees applicable to your account are set out in the Fee Schedule, accessible via the Platform and on our website. The current Fee Schedule forms part of these Terms.

5.2 An annual storage fee of 0.5% of the total insured value of your stored Assets is charged, billed monthly.

5.3 A withdrawal processing fee of USD $50 (flat) plus 0.25% of the Asset value applies to each Withdrawal Request.

5.4 An insurance premium of 0.1% of the insured stored value is charged monthly.

5.5 VaultSecure SA reserves the right to amend the Fee Schedule upon 30 days' written notice to your registered email address.

5.6 All fees are exclusive of VAT. South African VAT (currently 15%) applies to services rendered to South African residents.

5.7 Unpaid fees may result in account suspension. Continued non-payment may result in the exercise of a lien over stored Assets.`,
  },
  {
    number: '6',
    title: 'Withdrawals',
    content: `6.1 Withdrawal Requests must be submitted through the Client Portal using the Withdrawal Wizard. Requests submitted via other channels may not be processed.

6.2 Bank Transfer (Cash) withdrawals are processed within 14 Processing Days of approval. Approval may require additional identity verification.

6.3 Physical Delivery withdrawals are arranged via fully insured courier within 5 to 21 Processing Days depending on destination.

6.4 VaultSecure SA reserves the right to suspend withdrawal processing pending satisfactory completion of Anti-Money Laundering (AML) checks, FICA verification, or investigation of suspicious activity.

6.5 Withdrawal Requests are irrevocable once submitted. You may contact support@vaultsecure.co.za to request cancellation, which may not always be possible depending on processing stage.

6.6 VaultSecure SA accepts no liability for delays caused by incorrect banking details, failed delivery attempts, or third-party courier delays.`,
  },
  {
    number: '7',
    title: 'Limitation of Liability',
    content: `7.1 To the maximum extent permitted by applicable law, VaultSecure SA's total liability to you for any claim arising out of or related to these Terms shall not exceed the total fees paid by you to VaultSecure SA in the 12 months preceding the claim.

7.2 VaultSecure SA shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, or loss of goodwill, even if advised of the possibility of such damages.

7.3 VaultSecure SA is not liable for losses arising from force majeure events, including natural disasters, government actions, war, civil unrest, cyberattacks by third parties, or any circumstances beyond our reasonable control.

7.4 Nothing in these Terms excludes liability for fraud, gross negligence, or intentional misconduct, or any other liability that cannot be excluded by South African law.`,
  },
  {
    number: '8',
    title: 'Governing Law & Dispute Resolution',
    content: `8.1 These Terms are governed by and construed in accordance with the laws of the Republic of South Africa, without regard to conflicts of law principles.

8.2 Any dispute arising out of or in connection with these Terms shall first be referred to mediation in accordance with the rules of the Arbitration Foundation of Southern Africa (AFSA).

8.3 If mediation is unsuccessful within 60 days, disputes shall be resolved by binding arbitration in Johannesburg, South Africa, under AFSA rules.

8.4 Each party shall bear its own legal costs unless an arbitrator or court awards costs otherwise.

8.5 Nothing in this clause prevents VaultSecure SA from seeking urgent injunctive relief in a competent South African court.`,
  },
  {
    number: '9',
    title: 'Contact Information',
    content: `For all legal notices and formal correspondence:

VaultSecure SA (Pty) Ltd
Legal Department
1 Vault Tower, Sandton
Johannesburg, 2196
South Africa

Email: legal@vaultsecure.co.za
Phone: +27 11 800 1980
Support: support@vaultsecure.co.za

VaultSecure SA is licensed and regulated by the Financial Sector Conduct Authority (FSCA), South Africa.
FSCA Registration Number: FSP 45123.`,
  },
];

export default function Terms() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-slate-900 border border-amber-400/20 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-amber-400/10 rounded-xl">
            <FileText size={28} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
            <p className="text-slate-400 text-sm mt-1">VaultSecure SA (Pty) Ltd · Last updated: 1 March 2026</p>
          </div>
        </div>
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3 text-xs text-amber-200 leading-relaxed">
          Please read these Terms carefully before using the VaultSecure SA platform. These Terms constitute a legally binding agreement. By using this Platform, you confirm your acceptance of these Terms.
        </div>
      </div>

      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.number} className="bg-slate-900 border border-amber-400/20 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700 bg-slate-800/50">
              <span className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                {section.number}
              </span>
              <h2 className="text-white font-semibold">{section.title}</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-5 text-xs text-slate-500 space-y-1">
        <p>© 2024–2026 VaultSecure SA (Pty) Ltd. All rights reserved.</p>
        <p>Registration No. 2019/123456/07 · FSCA Licensed FSP 45123 · VAT No. 4780123456</p>
      </div>
    </div>
  );
}
