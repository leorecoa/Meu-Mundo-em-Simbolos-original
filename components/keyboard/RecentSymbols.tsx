import React from 'react';
import { SymbolData } from '../../types';
import SymbolCard from '../SymbolCard';

interface RecentSymbolsProps {
  symbols: SymbolData[];
  onSymbolClick: (symbol: SymbolData) => void;
}

const RecentSymbols: React.FC<RecentSymbolsProps> = ({ symbols, onSymbolClick }) => {
  if (symbols.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-subtle mb-2">Recentes</h4>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {symbols.map(symbol => (
            <SymbolCard key={`recent-${symbol.id}`} symbol={symbol} onClick={onSymbolClick} />
        ))}
      </div>
    </div>
  );
};

export default RecentSymbols;