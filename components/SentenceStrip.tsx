import React from 'react';
import { SymbolData } from '../types';
import Icon from './common/Icon';

interface SentenceStripProps {
  sentence: SymbolData[];
  onRemoveSymbol: (index: number) => void;
  onReorderSymbol: (fromIndex: number, toIndex: number) => void;
  speakingIndex?: number;
}

const SentenceStrip: React.FC<SentenceStripProps> = ({ sentence, onRemoveSymbol, onReorderSymbol, speakingIndex }) => {
  // Drag and drop functionality can be added here later.
  // For now, it just renders the sentence.

  return (
    <div className="w-full bg-background-light dark:bg-background-dark shadow-inner rounded-xl p-2 sm:p-4 min-h-[100px] lg:min-h-[140px] flex items-center">
      {sentence.length === 0 ? (
        <p className="w-full text-center text-subtle-light dark:text-subtle-dark">Toque nos símbolos para formar uma frase...</p>
      ) : (
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {sentence.map((symbol, index) => {
            const isSpeaking = index === speakingIndex;

            return (
                <div 
                    key={`${symbol.id}-${index}`} 
                    className="relative group animate-slideInUp"
                >
                    <div className={`flex flex-col items-center justify-center gap-1 text-center bg-surface-light dark:bg-surface-dark p-2 rounded-lg shadow transition-all duration-200 ${isSpeaking ? 'ring-2 ring-green-500 scale-110' : ''}`}>
                        <span className="text-4xl sm:text-5xl h-12 sm:h-14 flex items-center justify-center">{symbol.emoji}</span>
                        <span className="text-xs font-medium text-text-light dark:text-text-dark w-16 sm:w-20 truncate">{symbol.name}</span>
                    </div>
                    <button
                        onClick={() => onRemoveSymbol(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                        aria-label={`Remover ${symbol.name}`}
                    >
                        <Icon name="close" size={14} />
                    </button>
                </div>
            );
        })}
        </div>
      )}
    </div>
  );
};

export default SentenceStrip;