import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 px-4 py-4 text-center space-y-2">
      <p className="text-slate-500 text-xs">
        VaultSecure SA (Pty) Ltd is registered in South Africa (Reg. No. 2019/123456/07). Licensed under the Financial Sector Conduct Authority (FSCA). Compliant with GDPR, POPIA, CCPA, and PIPEDA.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <Link to="/terms" className="text-amber-400 hover:text-amber-300 transition-colors">Terms of Service</Link>
        <Link to="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors">Privacy Policy</Link>
        <Link to="/about" className="text-slate-400 hover:text-slate-300 transition-colors">About</Link>
        <a href="mailto:support@vaultsecure.co.za" className="text-slate-400 hover:text-slate-300 transition-colors">Support</a>
      </div>
      <p className="text-slate-600 text-xs">
        © 2024-2026 VaultSecure SA (Pty) Ltd. All rights reserved. · support@vaultsecure.co.za · +27 10 999 0000
      </p>
      <p className="text-slate-700 text-xs">
        Independently audited. Last audit: Q1 2026.
      </p>
    </footer>
  );
}
