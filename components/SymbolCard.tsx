import React from 'react';
import { SymbolData } from '../types';
import Icon from './common/Icon';

interface SymbolCardProps {
  symbol: SymbolData;
  onClick: (symbol: SymbolData) => void;
  onEdit?: (symbol: SymbolData) => void;
  onDelete?: (symbol: SymbolData) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'p-2 rounded-lg',
    icon: 'text-3xl',
    name: 'text-xs',
  },
  md: {
    container: 'p-4 rounded-xl',
    icon: 'text-5xl',
    name: 'text-sm',
  },
  lg: {
    container: 'p-6 rounded-2xl',
    icon: 'text-7xl',
    name: 'text-base',
  },
};

const SymbolCard: React.FC<SymbolCardProps> = ({ symbol, onClick, onEdit, onDelete, size = 'md' }) => {
  const classes = sizeClasses[size];

  return (
    <div
      onClick={() => onClick(symbol)}
      className={`group relative flex flex-col items-center justify-center gap-2 text-center bg-surface-light dark:bg-surface-dark shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-200 cursor-pointer aspect-square ${classes.container} border-2 border-transparent hover:border-primary-light`}
    >
      {symbol.imageUrl ? (
        <img src={symbol.imageUrl} alt={symbol.name} className="w-full h-full object-cover rounded-md" />
      ) : (
        <span className={classes.icon}>{symbol.emoji}</span>
      )}
      <span className={`font-medium text-text-light dark:text-text-dark ${classes.name}`}>{symbol.name}</span>

      {symbol.isCustom && onEdit && onDelete && (
        <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(symbol); }}
            className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            aria-label={`Editar ${symbol.name}`}
          >
            <Icon name="pencil" size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(symbol); }}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            aria-label={`Deletar ${symbol.name}`}
          >
            <Icon name="trash" size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SymbolCard;