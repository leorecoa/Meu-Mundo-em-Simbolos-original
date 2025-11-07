import React from 'react';
import { SymbolData } from '../../types';
import Icon from '../common/Icon';

interface SavedPhrasesProps {
  phrases: SymbolData[][];
  onSelect: (phrase: SymbolData[]) => void;
  onDelete: (index: number) => void;
}

const SavedPhrases: React.FC<SavedPhrasesProps> = ({ phrases, onSelect, onDelete }) => {
  return (
    <div className="p-4 min-h-[300px]">
      {phrases.length === 0 ? (
        <div className="text-center col-span-full py-12">
            <p className="text-subtle-light dark:text-subtle-dark">Você ainda não salvou nenhuma frase. Construa uma frase e clique no ícone de marcador para salvá-la aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phrases.map((phrase, index) => (
            <div 
                key={index} 
                className="relative group bg-background-light dark:bg-background-dark rounded-lg shadow p-4 transition-all hover:shadow-lg flex flex-col justify-between"
            >
              <div onClick={() => onSelect(phrase)} className="cursor-pointer flex-grow">
                <div className="flex items-center gap-2 mb-3 flex-wrap min-h-[32px]">
                  {phrase.slice(0, 8).map((symbol, sIndex) => (
                    <span key={sIndex} className="text-2xl" title={symbol.name}>
                        {symbol.imageUrl ? <img src={symbol.imageUrl} alt={symbol.name} className="w-8 h-8 object-cover"/> : symbol.emoji}
                    </span>
                  ))}
                  {phrase.length > 8 && <span className="text-subtle self-end pb-1">...</span>}
                </div>
                <p className="font-semibold text-text-light dark:text-text-dark">
                  {phrase.map(s => s.name).join(' ')}
                </p>
              </div>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                }} 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                aria-label="Deletar Frase"
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPhrases;
