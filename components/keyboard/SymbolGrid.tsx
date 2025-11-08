import React from 'react';
import { SymbolData } from '../../types';
import SymbolCard from '../SymbolCard';

interface SymbolGridProps {
  symbols: SymbolData[];
  onSymbolClick: (symbol: SymbolData) => void;
  onEditSymbol?: (symbol: SymbolData) => void;
  onDeleteSymbol?: (symbol: SymbolData) => void;
  emptyMessage?: string;
}

const SymbolGrid: React.FC<SymbolGridProps> = ({ symbols, onSymbolClick, onEditSymbol, onDeleteSymbol, emptyMessage = "Nenhum símbolo nesta categoria." }) => {
  return (
    <div className="p-2 sm:p-4">
      {symbols.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3">
          {symbols.map(symbol => (
            <SymbolCard 
              key={symbol.id} 
              symbol={symbol} 
              onClick={onSymbolClick}
              onEdit={symbol.isCustom ? onEditSymbol : undefined}
              onDelete={symbol.isCustom ? onDeleteSymbol : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center col-span-full py-12">
            <p className="text-subtle-light dark:text-subtle-dark">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SymbolGrid;