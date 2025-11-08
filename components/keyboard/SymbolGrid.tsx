import React, { useState, useRef } from 'react';
import { SymbolData } from '../../types';
import SymbolCard from '../SymbolCard';

interface SymbolGridProps {
  symbols: SymbolData[];
  onSymbolClick: (symbol: SymbolData) => void;
  onEditSymbol?: (symbol: SymbolData) => void;
  onDeleteSymbol?: (symbol: SymbolData) => void;
  emptyMessage?: string;
  isReorderable?: boolean;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

const SymbolGrid: React.FC<SymbolGridProps> = ({ symbols, onSymbolClick, onEditSymbol, onDeleteSymbol, emptyMessage = "Nenhum símbolo nesta categoria.", isReorderable = false, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isReorderable || !onReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.toString()); // For Firefox
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      dragOverItemRef.current = index;
      setDragOverIndex(index);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    dragOverItemRef.current = null;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIndex !== null && dragOverItemRef.current !== null && onReorder) {
      onReorder(draggedIndex, dragOverItemRef.current);
    }
    handleDragEnd();
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragOverItemRef.current = null;
  };

  return (
    <div className="p-2 sm:p-4">
      {symbols.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3">
          {symbols.map((symbol, index) => {
            const isBeingDragged = draggedIndex === index;
            const isDragTarget = dragOverIndex === index;
            
            return (
              <div
                key={symbol.id}
                draggable={isReorderable}
                onDragStart={isReorderable ? (e) => handleDragStart(e, index) : undefined}
                onDragEnter={isReorderable ? (e) => handleDragEnter(e, index) : undefined}
                onDragOver={isReorderable ? handleDragOver : undefined}
                onDragLeave={isReorderable ? handleDragLeave : undefined}
                onDrop={isReorderable ? handleDrop : undefined}
                onDragEnd={isReorderable ? handleDragEnd : undefined}
                className={`transition-all duration-200 rounded-lg sm:rounded-xl
                  ${isReorderable ? 'cursor-grab active:cursor-grabbing' : ''}
                  ${isBeingDragged ? 'opacity-30 scale-95' : 'opacity-100'}
                  ${isDragTarget ? 'ring-2 ring-primary-light ring-offset-2 ring-offset-background-dark' : ''}
                `}
              >
                <SymbolCard 
                  symbol={symbol} 
                  onClick={onSymbolClick}
                  onEdit={symbol.isCustom ? onEditSymbol : undefined}
                  onDelete={symbol.isCustom ? onDeleteSymbol : undefined}
                />
              </div>
            );
          })}
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