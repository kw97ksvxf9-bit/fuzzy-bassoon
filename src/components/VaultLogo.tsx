export default function VaultLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="90" height="90" rx="12" stroke="#D4AF37" strokeWidth="6" fill="#1e293b"/>
      <circle cx="50" cy="50" r="28" stroke="#D4AF37" strokeWidth="5" fill="none"/>
      <circle cx="50" cy="50" r="10" fill="#D4AF37"/>
      <line x1="50" y1="22" x2="50" y2="34" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="66" x2="50" y2="78" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"/>
      <line x1="22" y1="50" x2="34" y2="50" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"/>
      <line x1="66" y1="50" x2="78" y2="50" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"/>
      <text x="50" y="56" textAnchor="middle" fill="#D4AF37" fontSize="14" fontWeight="bold" fontFamily="serif">VS</text>
    </svg>
  );
}
