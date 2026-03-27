import { useState, useEffect, useRef } from 'react';

export interface GoldPriceState {
  priceUSD: number;
  previousPriceUSD: number;
  lastUpdated: Date;
  isLoading: boolean;
}

const BASE_PRICE = 2650; // USD per troy ounce
const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

/** Simulate a realistic gold price fluctuation (±0.3%) */
function simulateNextPrice(current: number): number {
  const changePercent = (Math.random() - 0.5) * 0.006; // ±0.3%
  return parseFloat((current * (1 + changePercent)).toFixed(2));
}

export function useGoldPrice(): GoldPriceState {
  const [state, setState] = useState<GoldPriceState>({
    priceUSD: BASE_PRICE,
    previousPriceUSD: BASE_PRICE,
    lastUpdated: new Date(),
    isLoading: true,
  });

  const priceRef = useRef(BASE_PRICE);

  useEffect(() => {
    // Initial "load" after a short delay to simulate fetch
    const initTimer = setTimeout(() => {
      const initial = simulateNextPrice(BASE_PRICE);
      priceRef.current = initial;
      setState({
        priceUSD: initial,
        previousPriceUSD: BASE_PRICE,
        lastUpdated: new Date(),
        isLoading: false,
      });
    }, 800);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      const prev = priceRef.current;
      const next = simulateNextPrice(prev);
      priceRef.current = next;
      setState({
        priceUSD: next,
        previousPriceUSD: prev,
        lastUpdated: new Date(),
        isLoading: false,
      });
    }, REFRESH_INTERVAL_MS);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  return state;
}

/** Troy ounces in one standard gold bar (≈ 1 kg) */
export const TROY_OZ_PER_BAR = 32.15;
