import { Lock } from 'lucide-react';

const sections = [
  {
    number: '1',
    title: 'Introduction & Data Controller',
    content: `VaultSecure SA (Pty) Ltd ("VaultSecure SA", "we", "us") is committed to protecting your personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and all applicable South African data protection laws.

This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use the InvestgoV1.001 platform and related services.

Data Controller: VaultSecure SA (Pty) Ltd, 1 Vault Tower, Sandton, Johannesburg 2196.
Data Protection Officer (DPO): dpo@vaultsecure.co.za

By using our Platform, you acknowledge that you have read and understood this Privacy Policy.`,
  },
  {
    number: '2',
    title: 'Information We Collect',
    content: `2.1 Identity Information: Full name, date of birth, gender, nationality, and government-issued identity number (South African ID, passport, or equivalent).

2.2 Contact Information: Email address, phone number, and residential/postal address.

2.3 Financial Information: Bank account details (provided during withdrawal requests), asset valuation data, transaction history, and fee records.

2.4 KYC/AML Documentation: Certified copies of identity documents, proof of address, source of funds declarations, and biometric selfies (where required for verification).

2.5 Technical Data: IP address, browser type, device identifiers, login timestamps, session data, and platform usage logs.

2.6 Communication Records: Support ticket correspondence, chat transcripts, and email communications with our team.`,
  },
  {
    number: '3',
    title: 'How We Use Your Information',
    content: `3.1 Service Delivery: To establish and maintain your account, process deposits and withdrawals, and manage your stored assets.

3.2 Regulatory Compliance: To verify your identity (KYC), conduct anti-money laundering (AML) screening, comply with FICA (Financial Intelligence Centre Act), and meet FSCA reporting obligations.

3.3 Security & Fraud Prevention: To detect, prevent, and investigate fraud, unauthorized access, and suspicious activity on the Platform.

3.4 Communication: To send account statements, transaction confirmations, fee notices, security alerts, and service updates.

3.5 Legal Obligations: To respond to court orders, regulatory requests, or lawful instructions from authorities.

3.6 Platform Improvement: To analyze usage patterns (in anonymized or aggregated form) and improve our services, user interface, and security.`,
  },
  {
    number: '4',
    title: 'Legal Basis for Processing (POPIA)',
    content: `Under POPIA, we process your personal information on the following grounds:

4.1 Contractual Necessity: Processing is required to fulfill our obligations under our Terms of Service (e.g., account management, withdrawals).

4.2 Legal Obligation: Processing is necessary to comply with FICA, POPIA, FSCA regulations, SARS reporting, and other applicable laws.

4.3 Legitimate Interests: Processing for fraud detection, platform security, and service improvement, where our interests are balanced against your rights.

4.4 Consent: Where you have given explicit consent (e.g., marketing communications), which you may withdraw at any time.`,
  },
  {
    number: '5',
    title: 'Data Storage & Security',
    content: `5.1 All personal information is stored on secure servers located in South Africa, complying with POPIA's data residency requirements.

5.2 We implement industry-standard technical security measures including 256-bit AES encryption at rest, TLS 1.3 encryption in transit, multi-factor authentication, and regular security audits.

5.3 Access to personal information is restricted to authorized VaultSecure SA employees and contractors on a need-to-know basis, subject to confidentiality obligations.

5.4 We maintain a comprehensive data breach response plan. In the event of a breach likely to affect your rights, we will notify you and the Information Regulator within 72 hours as required by POPIA.`,
  },
  {
    number: '6',
    title: 'Sharing with Third Parties',
    content: `6.1 We do not sell your personal information to third parties for marketing purposes.

6.2 We may share your information with:
• Regulatory Authorities: FSCA, FIC, SARS, and other government bodies as required by law.
• Service Providers: KYC/AML screening providers, cloud infrastructure partners, payment processors, and auditors — all bound by data processing agreements.
• Insurance Providers: Lloyd's of London syndicates (anonymized or aggregate data only for insurance policy maintenance).
• Legal & Professional Advisors: Attorneys, auditors, and compliance consultants under strict confidentiality.
• Courier & Logistics Partners: Limited information (name, address, contact) for Physical Delivery requests only.

6.3 We ensure all third-party recipients maintain adequate data protection standards consistent with POPIA.`,
  },
  {
    number: '7',
    title: 'Your Rights Under POPIA',
    content: `As a data subject under POPIA, you have the following rights:

7.1 Right of Access: You may request a copy of the personal information we hold about you.

7.2 Right to Correction: You may request correction of inaccurate or incomplete personal information.

7.3 Right to Deletion: You may request deletion of your personal information, subject to our legal retention obligations.

7.4 Right to Object: You may object to the processing of your personal information in certain circumstances.

7.5 Right to Data Portability: You may request your data in a structured, machine-readable format.

7.6 Right to Withdraw Consent: Where processing is based on consent, you may withdraw it at any time without affecting prior processing.

To exercise any of these rights, email our DPO at dpo@vaultsecure.co.za. We will respond within 30 days. You also have the right to lodge a complaint with the Information Regulator of South Africa at inforeg.org.za.`,
  },
  {
    number: '8',
    title: 'Data Retention',
    content: `8.1 We retain personal information for as long as necessary to fulfill the purposes described in this Policy and to comply with applicable laws.

8.2 Account data and transaction records are retained for a minimum of 5 years after account closure as required by FICA and tax regulations.

8.3 KYC documentation is retained for a minimum of 5 years following the termination of the business relationship.

8.4 Technical logs (IP addresses, session logs) are retained for up to 12 months for security monitoring purposes.

8.5 Upon expiry of the applicable retention period, data is securely deleted or anonymized.`,
  },
  {
    number: '9',
    title: 'Contact the Data Protection Officer',
    content: `For all privacy-related enquiries, requests, or complaints:

Data Protection Officer
VaultSecure SA (Pty) Ltd
1 Vault Tower, Sandton
Johannesburg, 2196

Email: dpo@vaultsecure.co.za
Phone: +27 11 800 1980

Information Regulator of South Africa (external complaints):
Website: www.inforeg.org.za
Email: inforeg@justice.gov.za`,
  },
];

export default function Privacy() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-slate-900 border border-amber-400/20 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-amber-400/10 rounded-xl">
            <Lock size={28} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
            <p className="text-slate-400 text-sm mt-1">VaultSecure SA (Pty) Ltd · Last updated: 1 March 2026 · POPIA Compliant</p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 text-xs text-blue-200 leading-relaxed">
          This Privacy Policy is prepared in compliance with the Protection of Personal Information Act 4 of 2013 (POPIA) of the Republic of South Africa. Your privacy is important to us.
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
        <p>Registration No. 2019/123456/07 · FSCA Licensed FSP 45123 · POPIA compliant · Information Officer registered with the Information Regulator.</p>
      </div>
    </div>
  );
}
