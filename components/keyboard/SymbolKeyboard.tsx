
import React, { useState, useMemo, useEffect } from 'react';
import { SymbolData, Sentence, Symbol as SymbolType } from '../../types';
import { categories as predefinedCategories } from '../../constants';
import SymbolGrid from './SymbolGrid';
import RecentSymbols from './RecentSymbols';
import AddCustomSymbol from './AddCustomSymbol';
import SavedPhrases from './SavedPhrases';
import Icon, { icons } from '../common/Icon';

interface SymbolKeyboardProps {
  onSymbolAdd: (symbol: SymbolData) => void;
  customSymbols: SymbolData[];
  onAddCustomSymbol: (name: string, imageBase64: string) => void;
  onEditCustomSymbol: (symbol: SymbolData) => void;
  onDeleteCustomSymbol: (symbol: SymbolData) => void;
  savedPhrases: Sentence[];
  onSelectSavedPhrase: (phrase: Sentence) => void;
  onDeleteSavedPhrase: (index: number) => void;
}

const SymbolKeyboard: React.FC<SymbolKeyboardProps> = ({
  onSymbolAdd,
  customSymbols,
  onAddCustomSymbol,
  onEditCustomSymbol,
  onDeleteCustomSymbol,
  savedPhrases,
  onSelectSavedPhrase,
  onDeleteSavedPhrase,
}) => {
  const allCategories = [
    ...predefinedCategories,
    // FIX: Cast customSymbols to unknown first to resolve type incompatibility.
    // The symbols property here is for type compatibility with the Category type,
    // but the actual symbols are rendered from the `customSymbols` prop directly.
    { id: 'custom', name: 'Personalizados', iconName: 'palette', symbols: customSymbols as unknown as SymbolType[] },
    { id: 'frases', name: 'Frases', iconName: 'messageSquare', symbols: [] },
  ];

  const [activeCategoryId, setActiveCategoryId] = useState<string>(predefinedCategories[0].id);
  const [recentSymbols, setRecentSymbols] = useState<SymbolData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm('');
  }, [activeCategoryId]);

  const handleSymbolClick = (symbol: SymbolData) => {
    onSymbolAdd(symbol);
    
    setRecentSymbols(prev => {
      const filtered = prev.filter(s => s.id !== symbol.id);
      return [symbol, ...filtered].slice(0, 6);
    });
  };

  const activeCategory = allCategories.find(c => c.id === activeCategoryId);

  const currentSymbols = useMemo(() => {
    if (activeCategoryId === 'custom') {
      return customSymbols;
    }
    if (activeCategory) {
      return activeCategory.symbols.map(s => ({
        ...s,
        emoji: s.icon,
        isCustom: false,
      }));
    }
    return [];
  }, [activeCategoryId, customSymbols, activeCategory]);

  const filteredSymbols = useMemo(() => {
    if (!searchTerm.trim()) {
      return currentSymbols;
    }
    return currentSymbols.filter(symbol => 
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentSymbols, searchTerm]);
  
  const emptyGridMessage = useMemo(() => {
    if (searchTerm) {
      return "Nenhum símbolo encontrado para sua pesquisa.";
    }
    if (activeCategoryId === 'custom' && customSymbols.length === 0) {
      return "Você ainda não adicionou símbolos personalizados.";
    }
    return "Nenhum símbolo nesta categoria.";
  }, [searchTerm, activeCategoryId, customSymbols.length]);

  const renderContent = () => {
    if (activeCategoryId === 'frases') {
      return <SavedPhrases phrases={savedPhrases} onSelect={onSelectSavedPhrase} onDelete={onDeleteSavedPhrase} />;
    }
    if (activeCategoryId === 'custom') {
      return (
        <>
          <AddCustomSymbol onAdd={onAddCustomSymbol} />
          <SymbolGrid
            symbols={filteredSymbols}
            onSymbolClick={handleSymbolClick}
            onEditSymbol={onEditCustomSymbol}
            onDeleteSymbol={onDeleteCustomSymbol}
            emptyMessage={emptyGridMessage}
          />
        </>
      );
    }
    if (activeCategory) {
      return <SymbolGrid symbols={filteredSymbols} onSymbolClick={handleSymbolClick} emptyMessage={emptyGridMessage} />;
    }
    return null;
  };

  return (
    <div className="h-full bg-surface-dark/50 rounded-2xl shadow-lg overflow-hidden flex flex-col">
      {/* Category Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto" aria-label="Tabs">
          {allCategories.map((category) => (
              (category.id !== 'frases' || savedPhrases.length > 0) &&
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`group relative flex flex-col items-center justify-center gap-1 capitalize whitespace-nowrap pt-3 pb-2 px-2 sm:px-3 text-sm font-medium transition-colors w-20 sm:w-24 h-20 rounded-t-lg ${
                    activeCategoryId === category.id
                    ? 'text-white'
                    : 'text-subtle hover:text-white'
                }`}
              >
                <Icon name={category.iconName as keyof typeof icons} size={28} className={`transition-transform group-hover:scale-110 ${activeCategoryId === category.id ? 'text-brand-light' : ''}`} />
                <span>{category.name}</span>
                {activeCategoryId === category.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-brand rounded-t-full"></div>
                )}
              </button>
          ))}
        </div>
      </div>
      
      {/* Search Bar */}
      {activeCategoryId !== 'frases' && (
        <div className="p-2 sm:p-4 border-b border-gray-700">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={20} />
            <input
              type="text"
              placeholder="Pesquisar símbolos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background-dark border border-gray-600 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              aria-label="Pesquisar símbolos"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-text-dark"
                aria-label="Limpar pesquisa"
              >
                <Icon name="close" size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recent Symbols */}
      {activeCategoryId !== 'frases' && !searchTerm && <RecentSymbols symbols={recentSymbols} onSymbolClick={handleSymbolClick} />}

      <div className="flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SymbolKeyboard;
