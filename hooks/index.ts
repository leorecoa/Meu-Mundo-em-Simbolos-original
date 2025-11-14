import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from '../useLocalStorage';
import { SymbolData, Sentence, Goal, Session, AppearanceSettings, VoiceSettings, BackupData } from '../types';
import { categories as predefinedCategories } from '../constants';

/**
 * Hook para gerenciar os símbolos da aplicação.
 */
export const useSymbols = () => {
    const [customSymbols, setCustomSymbols] = useLocalStorage<SymbolData[]>('customSymbols', []);

    const allSymbols = useMemo(() => [
        ...predefinedCategories.flatMap(cat => cat.symbols.map(s => ({ ...s, emoji: s.icon, isCustom: false }))),
        ...customSymbols
    ], [customSymbols]);

    const addCustomSymbol = (name: string, imageBase64: string) => {
        const newSymbol: SymbolData = {
            id: `custom-${Date.now()}`,
            name,
            imageUrl: imageBase64,
            emoji: '', // Custom symbols use imageUrl
            category: 'custom',
            speechText: name,
            isCustom: true,
        };
        setCustomSymbols(prev => [...prev, newSymbol]);
    };

    const updateCustomSymbol = (updatedSymbol: SymbolData) => {
        setCustomSymbols(prev => prev.map(s => s.id === updatedSymbol.id ? updatedSymbol : s));
    };

    const deleteCustomSymbol = (symbolToDelete: SymbolData) => {
        setCustomSymbols(prev => prev.filter(s => s.id !== symbolToDelete.id));
    };

    const reorderCustomSymbols = (fromIndex: number, toIndex: number) => {
        setCustomSymbols(prev => {
            const result = Array.from(prev);
            const [removed] = result.splice(fromIndex, 1);
            result.splice(toIndex, 0, removed);
            return result;
        });
    };

    return { customSymbols, allSymbols, addCustomSymbol, updateCustomSymbol, deleteCustomSymbol, reorderCustomSymbols };
};

/**
 * Hook para gerenciar as configurações de aparência.
 */
export const useAppearance = (defaultSettings: AppearanceSettings): [AppearanceSettings, (settings: AppearanceSettings) => void] => {
    const [settings, setSettings] = useLocalStorage<AppearanceSettings>('appearanceSettings', defaultSettings);
    return [settings, setSettings];
};

/**
 * Hook para gerenciar as configurações de voz.
 */
export const useVoiceSettings = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [settings, setSettings] = useLocalStorage<VoiceSettings>('voiceSettings', {
        pitch: 1,
        rate: 1,
        volume: 1,
    });
    const hasSetDefaultVoice = useRef(false);

    const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, [setSettings]);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            return;
        }

        const handleVoicesChanged = () => {
            try {
                const availableVoices = window.speechSynthesis.getVoices();
                if (availableVoices && availableVoices.length > 0) {
                    setVoices(availableVoices);
                    // Only set default voice once if no voice is currently set
                    if (!hasSetDefaultVoice.current) {
                        setSettings(prev => {
                            if (!prev.voice) {
                                const defaultVoice = availableVoices.find(v => v.lang.startsWith('pt-BR')) || availableVoices[0];
                                if (defaultVoice) {
                                    hasSetDefaultVoice.current = true;
                                    return { ...prev, voice: defaultVoice };
                                }
                            }
                            return prev;
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading voices:', error);
            }
        };

        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        handleVoicesChanged(); // Call it once to load voices initially

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    return { settings, voices, updateSettings };
};

/**
 * Hook para gerenciar backup e restauração de dados.
 */
export const useBackup = () => {
    const [customSymbols, setCustomSymbols] = useLocalStorage<SymbolData[]>('customSymbols', []);
    const [savedPhrases, setSavedPhrases] = useLocalStorage<Sentence[]>('savedPhrases', []);
    const [therapistGoals, setTherapistGoals] = useLocalStorage<Goal[]>('therapistGoals', []);
    const [therapistSessions, setTherapistSessions] = useLocalStorage<Session[]>('therapistSessions', []);
    
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const clearMessages = useCallback(() => {
        setError('');
        setSuccess('');
    }, []);

    const exportData = useCallback(() => {
        setIsExporting(true);
        setError('');
        setSuccess('');
        
        try {
            const data: BackupData = {
                customSymbols,
                savedPhrases,
                therapistGoals,
                therapistSessions,
            };

            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `meu-mundo-em-simbolos-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSuccess('Dados exportados com sucesso!');
            setTimeout(clearMessages, 3000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar dados';
            setError(errorMessage);
            setTimeout(clearMessages, 5000);
        } finally {
            setIsExporting(false);
        }
    }, [customSymbols, savedPhrases, therapistGoals, therapistSessions, clearMessages]);

    const importData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setError('Nenhum arquivo selecionado');
            setTimeout(clearMessages, 5000);
            return;
        }

        setIsImporting(true);
        setError('');
        setSuccess('');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const data: BackupData = JSON.parse(text);

                // Validar estrutura básica
                if (typeof data !== 'object' || data === null) {
                    throw new Error('Formato de arquivo inválido');
                }

                // Importar dados (apenas se existirem no arquivo)
                if (Array.isArray(data.customSymbols)) {
                    setCustomSymbols(data.customSymbols);
                }
                if (Array.isArray(data.savedPhrases)) {
                    setSavedPhrases(data.savedPhrases);
                }
                if (Array.isArray(data.therapistGoals)) {
                    setTherapistGoals(data.therapistGoals);
                }
                if (Array.isArray(data.therapistSessions)) {
                    setTherapistSessions(data.therapistSessions);
                }

                setSuccess('Dados importados com sucesso!');
                setTimeout(clearMessages, 3000);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Erro ao importar dados. Verifique se o arquivo é válido.';
                setError(errorMessage);
                setTimeout(clearMessages, 5000);
            } finally {
                setIsImporting(false);
                // Resetar o input para permitir importar o mesmo arquivo novamente
                event.target.value = '';
            }
        };

        reader.onerror = () => {
            setError('Erro ao ler o arquivo');
            setTimeout(clearMessages, 5000);
            setIsImporting(false);
            event.target.value = '';
        };

        reader.readAsText(file);
    }, [setCustomSymbols, setSavedPhrases, setTherapistGoals, setTherapistSessions, clearMessages]);

    const resetApp = useCallback(() => {
        try {
            // Limpar todos os dados do localStorage
            setCustomSymbols([]);
            setSavedPhrases([]);
            setTherapistGoals([]);
            setTherapistSessions([]);
            
            // Limpar outras configurações se necessário
            localStorage.removeItem('appearanceSettings');
            localStorage.removeItem('voiceSettings');
            localStorage.removeItem('recentPhrasesHistory');
            localStorage.removeItem('hasVisitedBefore');
            
            setSuccess('Aplicativo resetado com sucesso!');
            setTimeout(() => {
                clearMessages();
                window.location.reload();
            }, 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao resetar aplicativo';
            setError(errorMessage);
            setTimeout(clearMessages, 5000);
        }
    }, [setCustomSymbols, setSavedPhrases, setTherapistGoals, setTherapistSessions, clearMessages]);

    return {
        isExporting,
        isImporting,
        error,
        success,
        exportData,
        importData,
        resetApp,
        clearMessages,
    };
};

// Re-export useLocalStorage for convenience
export { useLocalStorage } from '../useLocalStorage';

