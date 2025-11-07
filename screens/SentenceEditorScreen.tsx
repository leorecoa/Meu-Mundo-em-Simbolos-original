

import React, { useState, useCallback, useReducer, useEffect, useMemo } from 'react';
import { SymbolData, Sentence, History } from '../types';
import { VoiceService } from '../services/voiceService';
import PhraseBuilder from '../components/PhraseBuilder';
import SymbolKeyboard from '../components/keyboard/SymbolKeyboard';
import EditSymbolModal from '../components/modals/EditSymbolModal';
import { useLocalStorage } from '../hooks';

// Reducer for sentence history (undo/redo)
const historyReducer = (state: History, action: { type: 'add' | 'undo' | 'redo', payload?: Sentence }): History => {
  const { past, future } = state;
  switch (action.type) {
    case 'add':
      if (!action.payload) return state;
      // Previne a adição de estados duplicados ao histórico
      if (past.length > 0 && JSON.stringify(action.payload.map(s => s.id)) === JSON.stringify(past[past.length - 1].map(s => s.id))) {
        return state;
      }
      return {
        past: [...past, action.payload],
        future: [],
      };
    case 'undo':
      if (past.length <= 1) return state;
      return {
        past: past.slice(0, past.length - 1),
        future: [past[past.length - 1], ...future],
      };
    case 'redo':
      if (future.length === 0) return state;
      const next = future[0];
      return {
        past: [...past, next],
        future: future.slice(1),
      };
    default:
      return state;
  }
};

const SentenceEditorScreen: React.FC = () => {
    const [history, dispatchHistory] = useReducer(historyReducer, { past: [[]], future: [] });
    const sentence = history.past[history.past.length - 1];

    const [speakingIndex, setSpeakingIndex] = useState(-1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const voiceService = VoiceService.getInstance();
    
    const [customSymbols, setCustomSymbols] = useLocalStorage<SymbolData[]>('customSymbols', []);
    const [savedPhrases, setSavedPhrases] = useLocalStorage<Sentence[]>('savedPhrases', []);
    const [editingSymbol, setEditingSymbol] = useState<SymbolData | null>(null);

    const updateSentence = (newSentence: Sentence) => {
        dispatchHistory({ type: 'add', payload: newSentence });
    };
    
    const handleSelectSymbol = (symbol: SymbolData) => {
        updateSentence([...sentence, symbol]);
    };
    
    const handleRemoveSymbol = (index: number) => {
        updateSentence(sentence.filter((_, i) => i !== index));
    };

    const handleReorderSymbol = (fromIndex: number, toIndex: number) => {
        const newSentence = [...sentence];
        const [moved] = newSentence.splice(fromIndex, 1);
        newSentence.splice(toIndex, 0, moved);
        updateSentence(newSentence);
    };

    const handleClearSentence = () => updateSentence([]);
    const handleUndo = () => dispatchHistory({ type: 'undo' });
    const handleRedo = () => dispatchHistory({ type: 'redo' });

    const handleSpeak = useCallback(() => {
        if (isSpeaking) {
            voiceService.stop();
            setIsSpeaking(false);
            setSpeakingIndex(-1);
        } else if (sentence.length > 0) {
            setIsSpeaking(true);
            voiceService.speak(sentence, (index) => setSpeakingIndex(index))
            .catch(err => console.error("Speech error:", err))
            .finally(() => {
                setIsSpeaking(false);
                setSpeakingIndex(-1);
            });
        }
    }, [sentence, voiceService, isSpeaking]);
    
    const handleAddCustomSymbol = (name: string, imageBase64: string) => {
        const newSymbol: SymbolData = {
            id: crypto.randomUUID(),
            name,
            emoji: '',
            imageUrl: imageBase64,
            category: 'custom',
            isCustom: true,
            speechText: name,
        };
        setCustomSymbols(prev => [...prev, newSymbol]);
    };
    
    const handleDeleteCustomSymbol = (symbolToDelete: SymbolData) => {
        setCustomSymbols(prev => prev.filter(s => s.id !== symbolToDelete.id));
    };

    const handleOpenEditModal = (symbolToEdit: SymbolData) => {
        setEditingSymbol(symbolToEdit);
    };

    const handleSaveEditedSymbol = (updatedSymbol: SymbolData) => {
        setCustomSymbols(prev => prev.map(s => s.id === updatedSymbol.id ? updatedSymbol : s));
        setEditingSymbol(null);
    };

    const handleSavePhrase = () => {
        if (sentence.length > 0) {
            const sentenceString = JSON.stringify(sentence.map(({id, name}) => ({id, name})));
            const isDuplicate = savedPhrases.some(p => JSON.stringify(p.map(({id, name}) => ({id, name}))) === sentenceString);
            if (!isDuplicate) {
                setSavedPhrases(prev => [sentence, ...prev]);
            }
        }
    };
    
    const handleSelectSavedPhrase = (phrase: Sentence) => {
        updateSentence(phrase);
    };
    
    const handleDeleteSavedPhrase = (index: number) => {
        setSavedPhrases(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col lg:flex-row h-full p-2 sm:p-4 gap-4 font-sans">
            {/* Left side: Phrase Builder */}
            <div className="lg:w-1/2 flex flex-col min-h-0">
                <PhraseBuilder
                    sentence={sentence}
                    speakingIndex={speakingIndex}
                    onRemoveSymbol={handleRemoveSymbol}
                    onReorderSymbol={handleReorderSymbol}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onClear={handleClearSentence}
                    onSpeak={handleSpeak}
                    canUndo={history.past.length > 1}
                    canRedo={history.future.length > 0}
                    isSpeaking={isSpeaking}
                    onSavePhrase={handleSavePhrase}
                    canSave={sentence.length > 0}
                />
            </div>

            {/* Right side: Symbol Keyboard */}
            <div className="flex-grow lg:w-1/2 lg:flex-grow-0 min-h-0">
                <SymbolKeyboard
                    onSymbolAdd={handleSelectSymbol}
                    customSymbols={customSymbols}
                    onAddCustomSymbol={handleAddCustomSymbol}
                    onDeleteCustomSymbol={handleDeleteCustomSymbol}
                    onEditCustomSymbol={handleOpenEditModal}
                    savedPhrases={savedPhrases}
                    onSelectSavedPhrase={handleSelectSavedPhrase}
                    onDeleteSavedPhrase={handleDeleteSavedPhrase}
                />
            </div>
            
            {editingSymbol && (
                <EditSymbolModal
                    symbol={editingSymbol}
                    onClose={() => setEditingSymbol(null)}
                    onSave={handleSaveEditedSymbol}
                />
            )}
        </div>
    );
};

export default SentenceEditorScreen;