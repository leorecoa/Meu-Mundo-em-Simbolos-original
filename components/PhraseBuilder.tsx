

import React from 'react';
import { SymbolData } from '../types';
import SentenceStrip from './SentenceStrip';
import Toolbar from './Toolbar';
import Icon from './common/Icon';

interface PhraseBuilderProps {
  sentence: SymbolData[];
  speakingIndex?: number;
  onRemoveSymbol: (index: number) => void;
  onReorderSymbol: (dragIndex: number, dropIndex: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSpeak: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSpeaking: boolean;
  onSavePhrase: () => void;
  canSave: boolean;
}

const PhraseBuilder: React.FC<PhraseBuilderProps> = (props) => {
  const {
    sentence,
    speakingIndex,
    onRemoveSymbol,
    onReorderSymbol,
    onUndo,
    onRedo,
    onClear,
    onSpeak,
    canUndo,
    canRedo,
    isSpeaking,
    onSavePhrase,
    canSave,
  } = props;

  const sentenceText = sentence.map(s => s.name).join(' ');
  const canPerformActions = sentence.length > 0;

  return (
    <div className="bg-surface-dark/50 p-4 sm:p-6 rounded-2xl shadow-lg animate-fadeIn flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-text-light dark:text-text-dark">Construtor de Frases</h2>
        <button
            onClick={onSavePhrase}
            disabled={!canSave}
            aria-label="Salvar Frase"
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-secondary to-green-400 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            <Icon name="bookmark" size={18} />
            <span className="hidden sm:inline text-sm font-medium">Salvar</span>
        </button>
      </div>
      
      {/* Sentence as Text */}
      <div className="w-full bg-background-dark shadow-inner rounded-lg p-3 min-h-[48px] flex items-center text-base sm:text-lg text-text-dark">
        <p className={sentence.length === 0 ? 'text-subtle-dark' : ''}>
          {sentenceText || 'Sua frase aparecerá aqui...'}
        </p>
      </div>

      {/* Sentence as Symbols */}
      <SentenceStrip 
        sentence={sentence} 
        onRemoveSymbol={onRemoveSymbol} 
        onReorderSymbol={onReorderSymbol} 
        speakingIndex={speakingIndex} 
      />

      {/* Toolbar */}
      <div className="self-center pt-2 mt-auto">
        <Toolbar 
            onUndo={onUndo} 
            onRedo={onRedo} 
            onClear={onClear} 
            onSpeak={onSpeak}
            canUndo={canUndo} 
            canRedo={canRedo}
            canClear={canPerformActions}
            isSpeaking={isSpeaking}
            canSpeak={canPerformActions}
        />
      </div>
    </div>
  );
};

export default PhraseBuilder;