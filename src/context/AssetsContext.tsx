import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  assets as initialAssets,
  transactions as initialTransactions,
  type Asset,
  type Transaction,
} from '../data/mockData';

interface AssetsContextType {
  assets: Asset[];
  transactions: Transaction[];
  addDeposit: (asset: Asset, transaction: Transaction) => void;
}

const AssetsContext = createContext<AssetsContextType | null>(null);

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addDeposit = (asset: Asset, transaction: Transaction) => {
    setAssets(prev => [...prev, asset]);
    setTransactions(prev => [...prev, transaction]);
  };

  return (
    <AssetsContext.Provider value={{ assets, transactions, addDeposit }}>
      {children}
    </AssetsContext.Provider>
  );
}

export function useAssets(): AssetsContextType {
  const ctx = useContext(AssetsContext);
  if (!ctx) throw new Error('useAssets must be used within AssetsProvider');
  return ctx;
}
