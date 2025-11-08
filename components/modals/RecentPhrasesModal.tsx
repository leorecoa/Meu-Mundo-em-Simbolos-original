import React from 'react';
import { Sentence } from '../../types';
import Icon from '../common/Icon';

interface RecentPhrasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrases: Sentence[];
  onSelectPhrase: (phrase: Sentence) => void;
  onClearHistory: () => void;
}

const RecentPhrasesModal: React.FC<RecentPhrasesModalProps> = ({
  isOpen,
  onClose,
  phrases,
  onSelectPhrase,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 w-full max-w-lg flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Frases Recentes</h2>
          <button onClick={onClose} className="text-subtle hover:text-text-light dark:hover:text-text-dark">
            <Icon name="close" size={24} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          {phrases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-subtle-light dark:text-subtle-dark">O histórico de frases recentes está vazio.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {phrases.map((phrase, index) => {
                if (!Array.isArray(phrase)) return null;
                return (
                <button
                  key={index}
                  onClick={() => onSelectPhrase(phrase)}
                  className="w-full text-left bg-background-light dark:bg-background-dark rounded-lg p-3 transition-all hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {phrase.slice(0, 10).map((symbol, sIndex) => (
                      <span key={sIndex} className="text-2xl" title={symbol.name}>
                        {symbol.imageUrl ? <img src={symbol.imageUrl} alt={symbol.name} className="w-8 h-8 object-cover rounded"/> : symbol.emoji}
                      </span>
                    ))}
                    {phrase.length > 10 && <span className="text-subtle self-end pb-1">...</span>}
                  </div>
                  <p className="font-medium text-text-light dark:text-text-dark text-sm">
                    {phrase.map(s => s.name).join(' ')}
                  </p>
                </button>
              )})}
            </div>
          )}
        </div>
        
        {phrases.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end flex-shrink-0">
            <button onClick={onClearHistory} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
              <Icon name="trash" size={16} />
              Limpar Histórico
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPhrasesModal;