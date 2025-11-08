import React, { useState, useCallback, useReducer, useEffect } from 'react';
import { SymbolData, Sentence, History, VoiceSettings } from '../types';
import { VoiceService } from '../services/voiceService';
import PhraseBuilder from '../components/PhraseBuilder';
import SymbolKeyboard from '../components/keyboard/SymbolKeyboard';
import EditSymbolModal from '../components/modals/EditSymbolModal';
import { useLocalStorage } from '../hooks';
import OnboardingGuide from '../components/OnboardingGuide';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import Toast from '../components/common/Toast';
import RecentPhrasesModal from '../components/modals/RecentPhrasesModal';

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

interface SentenceEditorScreenProps {
    voiceSettings: VoiceSettings;
}

const SentenceEditorScreen: React.FC<SentenceEditorScreenProps> = ({ voiceSettings }) => {
    const [history, dispatchHistory] = useReducer(historyReducer, { past: [[]], future: [] });
    const sentence = history.past[history.past.length - 1];

    const [speakingIndex, setSpeakingIndex] = useState(-1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const voiceService = VoiceService.getInstance();
    
    const [customSymbols, setCustomSymbols] = useLocalStorage<SymbolData[]>('customSymbols', []);
    const [savedPhrases, setSavedPhrases] = useLocalStorage<Sentence[]>('savedPhrases', []);
    const [recentPhrases, setRecentPhrases] = useLocalStorage<Sentence[]>('recentPhrasesHistory', []);
    const [isRecentPhrasesModalOpen, setIsRecentPhrasesModalOpen] = useState(false);

    const [editingSymbol, setEditingSymbol] = useState<SymbolData | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    const [toastMessage, setToastMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState<{ action: () => void; title: string; message: string } | null>(null);

    useEffect(() => {
        try {
            const hasVisited = window.localStorage.getItem('hasVisitedBefore');
            if (hasVisited !== 'true') {
                setShowOnboarding(true);
            }
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
    }, []);

    useEffect(() => {
      // This effect runs once on mount to clean up any bad data from previous sessions.
      const cleanSymbols = Array.isArray(customSymbols)
        ? customSymbols.filter(s => s && typeof s === 'object' && s.id && s.name && typeof s.name === 'string')
        : [];
      
      if (!Array.isArray(customSymbols) || cleanSymbols.length !== customSymbols.length) {
        console.warn('Malformed or invalid custom symbols data found in localStorage. Cleaning up.');
        setCustomSymbols(cleanSymbols);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount to prevent re-triggering.
    
    const addPhraseToHistory = useCallback((phraseToAdd: Sentence) => {
        if (!phraseToAdd || phraseToAdd.length === 0) return;

        setRecentPhrases(prev => {
            const phraseString = JSON.stringify(phraseToAdd.map(s => s.id));
            if (prev.length > 0 && JSON.stringify(prev[0].map(s => s.id)) === phraseString) {
                return prev;
            }
            const newHistory = [phraseToAdd, ...prev];
            return newHistory.slice(0, 15);
        });
    }, [setRecentPhrases]);

    const handleCloseOnboarding = () => {
        try {
            window.localStorage.setItem('hasVisitedBefore', 'true');
        } catch (error) {
            console.error("Could not write to localStorage:", error);
        }
        setShowOnboarding(false);
    };

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

    const handleClearSentence = () => {
        if (sentence.length > 0) {
            addPhraseToHistory(sentence);
        }
        updateSentence([]);
    };
    const handleUndo = () => dispatchHistory({ type: 'undo' });
    const handleRedo = () => dispatchHistory({ type: 'redo' });

    const handleSpeak = useCallback(() => {
        if (isSpeaking) {
            voiceService.stop();
            setIsSpeaking(false);
            setSpeakingIndex(-1);
        } else if (sentence.length > 0) {
            addPhraseToHistory(sentence);
            setIsSpeaking(true);
            voiceService.speak(sentence, (index) => setSpeakingIndex(index), voiceSettings)
            .catch(err => console.error("Speech error:", err))
            .finally(() => {
                setIsSpeaking(false);
                setSpeakingIndex(-1);
            });
        }
    }, [sentence, voiceService, isSpeaking, voiceSettings, addPhraseToHistory]);
    
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
        setToastMessage('Símbolo adicionado!');
    };
    
    const handleDeleteCustomSymbol = (symbolToDelete: SymbolData) => {
        setConfirmAction({
            action: () => {
                setCustomSymbols(prev => prev.filter(s => s.id !== symbolToDelete.id));
                setToastMessage('Símbolo deletado.');
            },
            title: 'Deletar Símbolo',
            message: `Você tem certeza que quer deletar o símbolo "${symbolToDelete.name}"? Esta ação não pode ser desfeita.`
        });
    };

    const handleOpenEditModal = (symbolToEdit: SymbolData) => {
        setEditingSymbol(symbolToEdit);
    };

    const handleSaveEditedSymbol = (updatedSymbol: SymbolData) => {
        setCustomSymbols(prev => prev.map(s => s.id === updatedSymbol.id ? updatedSymbol : s));
        setEditingSymbol(null);
        setToastMessage('Símbolo atualizado.');
    };
    
    const handleReorderCustomSymbol = (fromIndex: number, toIndex: number) => {
        setCustomSymbols(prevSymbols => {
            const newSymbols = [...prevSymbols];
            const [moved] = newSymbols.splice(fromIndex, 1);
            newSymbols.splice(toIndex, 0, moved);
            return newSymbols;
        });
        setToastMessage('Ordem dos símbolos atualizada.');
    };

    const handleSavePhrase = () => {
        if (sentence.length > 0) {
            addPhraseToHistory(sentence);
            const sentenceString = JSON.stringify(sentence.map(({id, name}) => ({id, name})));
            const isDuplicate = savedPhrases.some(p => JSON.stringify(p.map(({id, name}) => ({id, name}))) === sentenceString);
            if (!isDuplicate) {
                setSavedPhrases(prev => [sentence, ...prev]);
                setToastMessage('Frase salva!');
            } else {
                setToastMessage('Esta frase já foi salva.');
            }
        }
    };
    
    const handleSelectSavedPhrase = (phrase: Sentence) => {
        updateSentence(phrase);
    };
    
    const handleDeleteSavedPhrase = (index: number) => {
        const phraseToDelete = savedPhrases[index];
        const phraseText = phraseToDelete.map(s => s.name).join(' ');
        setConfirmAction({
            action: () => {
                setSavedPhrases(prev => prev.filter((_, i) => i !== index));
                setToastMessage('Frase deletada.');
            },
            title: 'Deletar Frase',
            message: `Você tem certeza que quer deletar a frase "${phraseText}"?`
        });
    };

    const handleSelectRecentPhrase = (phrase: Sentence) => {
        updateSentence(phrase);
        setIsRecentPhrasesModalOpen(false);
    };

    const handleClearHistory = () => {
        setConfirmAction({
            action: () => {
                setRecentPhrases([]);
                setToastMessage('Histórico de frases recentes limpo.');
                setIsRecentPhrasesModalOpen(false);
            },
            title: 'Limpar Histórico',
            message: 'Você tem certeza que quer limpar todo o histórico de frases recentes? Esta ação não pode ser desfeita.'
        });
    };

    return (
        <div className="flex flex-col lg:flex-row h-full p-2 sm:p-4 gap-4 font-sans">
            <Toast message={toastMessage} onClose={() => setToastMessage('')} />
            {showOnboarding && <OnboardingGuide onClose={handleCloseOnboarding} />}
            {confirmAction && (
                <ConfirmationModal 
                    isOpen={!!confirmAction}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={confirmAction.action}
                    title={confirmAction.title}
                    message={confirmAction.message}
                />
            )}
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
                    onOpenHistory={() => setIsRecentPhrasesModalOpen(true)}
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
                    onReorderCustomSymbol={handleReorderCustomSymbol}
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
            <RecentPhrasesModal
                isOpen={isRecentPhrasesModalOpen}
                onClose={() => setIsRecentPhrasesModalOpen(false)}
                phrases={recentPhrases}
                onSelectPhrase={handleSelectRecentPhrase}
                onClearHistory={handleClearHistory}
            />
        </div>
    );
};

export default SentenceEditorScreen;