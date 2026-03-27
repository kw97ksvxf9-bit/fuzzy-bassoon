import { AlertTriangle } from 'lucide-react';

const sections = [
  {
    number: '1',
    title: 'General Investment Risk Disclaimer',
    content: `This disclaimer applies to all information, materials, data, and services provided by VaultSecure SA (Pty) Ltd ("VaultSecure SA") via the InvestgoV1.001 platform.

THE INFORMATION ON THIS PLATFORM DOES NOT CONSTITUTE FINANCIAL ADVICE, INVESTMENT ADVICE, TRADING ADVICE, OR ANY OTHER TYPE OF ADVICE. VaultSecure SA is a custodial storage services provider only — we do not provide financial advice, portfolio management, investment recommendations, or any regulated financial product under the Financial Advisory and Intermediary Services Act (FAIS).

Before making any investment or storage decision relating to precious metals or gemstones, you should seek independent advice from a qualified financial advisor licensed under FAIS in South Africa, or equivalent regulation in your jurisdiction.`,
  },
  {
    number: '2',
    title: 'Commodity Price Volatility',
    content: `2.1 The prices of precious metals (including gold, platinum, silver, palladium) and gemstones (including diamonds, rubies, emeralds) are subject to significant volatility and can change rapidly.

2.2 Commodity prices are influenced by numerous factors outside VaultSecure SA's control, including but not limited to:
• Global macroeconomic conditions and geopolitical events
• Supply and demand dynamics in mining and industrial markets
• Currency fluctuations (particularly USD/ZAR exchange rates)
• Interest rate changes by central banks (including the South African Reserve Bank, US Federal Reserve)
• Speculative trading activity in commodity futures markets
• Environmental regulations affecting mining operations
• Technological changes reducing demand for certain commodities

2.3 THE VALUE OF YOUR STORED ASSETS MAY DECREASE AS WELL AS INCREASE. You may receive less than you originally deposited.`,
  },
  {
    number: '3',
    title: 'Past Performance',
    content: `3.1 PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS.

3.2 Any historical price data, portfolio performance charts, or value trend information displayed on the Platform is provided for informational and illustrative purposes only. It does not guarantee, predict, or project future performance.

3.3 Historical appreciation in the value of gold, platinum, or diamonds does not imply that such appreciation will continue. Commodity markets are inherently unpredictable.

3.4 All values and estimates displayed on the Platform (including live gold price feeds) are sourced from third-party market data providers. VaultSecure SA does not warrant the accuracy, completeness, or timeliness of such data and accepts no liability for losses arising from reliance on it.`,
  },
  {
    number: '4',
    title: 'Insurance Coverage Details',
    content: `4.1 Assets stored in VaultSecure SA facilities are insured through a comprehensive policy underwritten by Lloyd's of London syndicates ("Insurance Policy").

4.2 Coverage Limit: All-risk coverage of up to USD $50,000,000 (fifty million US dollars) per vault facility.

4.3 Coverage Scope: The Insurance Policy covers physical loss or damage to stored assets arising from theft, fire, flood, natural disaster, and accidental damage while in the care of VaultSecure SA.

4.4 Coverage Exclusions: The Insurance Policy does NOT cover:
• Losses arising from market price fluctuations or commodity devaluation
• Losses resulting from your own instructions (e.g., withdrawal to an incorrect address)
• War, nuclear events, or government confiscation
• Assets not formally recorded and assigned to your account
• Losses arising from your own fraud or misrepresentation

4.5 Individual insurance certificates are available on request. Contact support@vaultsecure.co.za with your asset ID.

4.6 In the event of a claim, VaultSecure SA will liaise with our insurers on your behalf. Settlement timelines depend on the nature and complexity of the claim.`,
  },
  {
    number: '5',
    title: 'Liquidity & Withdrawal Risk',
    content: `5.1 Physical precious metals and gemstones are not as liquid as cash or publicly traded securities. Withdrawal processing times range from 5 to 21 business days.

5.2 Market conditions may affect your ability to convert stored assets to cash at a favorable price. VaultSecure SA does not guarantee any specific liquidation price for Sell & Wire withdrawal requests.

5.3 VaultSecure SA may temporarily suspend withdrawal processing in exceptional circumstances, including but not limited to: regulatory investigations, force majeure events, or insolvency proceedings. VaultSecure SA maintains segregated client asset accounts to protect client assets in such scenarios.`,
  },
  {
    number: '6',
    title: 'Regulatory & Tax Considerations',
    content: `6.1 The tax treatment of returns, capital gains, and withdrawals from precious metal storage depends on your individual circumstances and jurisdiction. VaultSecure SA does not provide tax advice.

6.2 You are solely responsible for declaring and paying all applicable taxes (including Capital Gains Tax, Income Tax, Wealth Tax, and VAT) arising from your use of the Platform, in accordance with the laws of your country of tax residence.

6.3 South African residents should consult a registered tax practitioner and the South African Revenue Service (SARS) guidelines on the taxation of precious metal investments.

6.4 VaultSecure SA complies with all South African FICA (Financial Intelligence Centre Act) obligations, including client identification and transaction reporting requirements.`,
  },
  {
    number: '7',
    title: 'Acknowledgement',
    content: `By using the VaultSecure SA platform, you confirm that:

• You have read and understood this Investment Disclaimer and Risk Disclosure.
• You understand that precious metal and gemstone investments carry risk and are not suitable for all investors.
• You accept full responsibility for your investment decisions.
• You have obtained (or have chosen not to obtain) independent professional financial advice.
• You will not hold VaultSecure SA liable for investment losses arising from commodity price movements.

If you have any concerns or questions about this disclaimer, please contact our compliance team at compliance@vaultsecure.co.za.`,
  },
];

export default function Disclaimer() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-500/10 rounded-xl">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Investment Disclaimer &amp; Risk Disclosure</h1>
            <p className="text-slate-400 text-sm mt-1">VaultSecure SA (Pty) Ltd · Last updated: 1 March 2026</p>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-xs text-red-200 leading-relaxed font-medium">
          ⚠ IMPORTANT: Please read this disclaimer carefully. The value of precious metal and gemstone investments can go down as well as up. Past performance is not indicative of future results. VaultSecure SA does not provide financial advice.
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
        <p>Registration No. 2019/123456/07 · FSCA Licensed FSP 45123 · This disclaimer does not constitute legal or financial advice.</p>
      </div>
    </div>
  );
}
