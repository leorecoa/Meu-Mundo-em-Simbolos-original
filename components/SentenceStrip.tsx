import React, { useState, useRef } from 'react';
import { SymbolData } from '../types';
import Icon from './common/Icon';

interface SentenceStripProps {
  sentence: SymbolData[];
  onRemoveSymbol: (index: number) => void;
  onReorderSymbol: (fromIndex: number, toIndex: number) => void;
  speakingIndex?: number;
}

const SentenceStrip: React.FC<SentenceStripProps> = ({ sentence, onRemoveSymbol, onReorderSymbol, speakingIndex }) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    setTimeout(() => setDragging(true), 0); // Allow browser to render initial state
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', ''); // For Firefox compatibility
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragItem.current !== null && dragItem.current !== index) {
      dragOverItem.current = index;
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragItem.current !== null && dragOverItem.current !== null) {
      onReorderSymbol(dragItem.current, dragOverItem.current);
    }
    handleDragEnd();
  };
  
  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDragging(false);
  };

  return (
    <div className="w-full bg-background-light dark:bg-background-dark shadow-inner rounded-xl p-2 sm:p-4 min-h-[92px] sm:min-h-[124px] flex items-center" onDragOver={handleDragOver}>
      {sentence.length === 0 ? (
        <p className="w-full text-center text-subtle-light dark:text-subtle-dark">Toque nos símbolos para formar uma frase...</p>
      ) : (
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {sentence.map((symbol, index) => {
            const isSpeaking = index === speakingIndex;
            const isBeingDragged = dragging && dragItem.current === index;
            // Use dragOverItem.current for a stable highlight, not the transient onDragEnter
            const isDragTarget = dragging && dragOverItem.current === index && dragItem.current !== index;

            return (
                <div 
                    key={`${symbol.id}-${index}`} 
                    className="relative group animate-slideInUp cursor-grab"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                >
                    <div className={`flex flex-col items-center justify-center gap-1 text-center bg-surface-light dark:bg-surface-dark p-2 rounded-lg shadow transition-all duration-300
                      ${isSpeaking ? 'ring-2 ring-green-500 scale-110' : ''}
                      ${isBeingDragged ? 'opacity-30 scale-95' : 'opacity-100'}
                      ${isDragTarget ? 'ring-2 ring-primary-light ring-offset-2 ring-offset-background-dark' : ''}
                    `}>
                        <span className="text-3xl sm:text-4xl h-10 sm:h-12 flex items-center justify-center pointer-events-none">{symbol.imageUrl ? <img src={symbol.imageUrl} alt={symbol.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"/> : symbol.emoji}</span>
                        <span className="text-xs font-medium text-text-light dark:text-text-dark w-14 sm:w-20 truncate pointer-events-none">{symbol.name}</span>
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