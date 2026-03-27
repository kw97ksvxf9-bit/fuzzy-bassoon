export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CNY';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  /** Approximate exchange rate from USD */
  rateFromUSD: number;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',       rateFromUSD: 1 },
  { code: 'EUR', symbol: '€',  name: 'Euro',             rateFromUSD: 0.92 },
  { code: 'GBP', symbol: '£',  name: 'British Pound',    rateFromUSD: 0.79 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',  rateFromUSD: 1.36 },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan',     rateFromUSD: 7.24 },
];

export function getCurrencyConfig(code: Currency): CurrencyConfig {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
}

/** Format a USD amount in the selected currency */
export function formatCurrency(usdAmount: number, currency: Currency): string {
  const cfg = getCurrencyConfig(currency);
  const converted = usdAmount * cfg.rateFromUSD;
  return `${cfg.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
