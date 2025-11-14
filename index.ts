import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SymbolData, Sentence, Goal, Session, AppearanceSettings, VoiceSettings } from '../types';
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

    const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, [setSettings]);

    useEffect(() => {
        const handleVoicesChanged = () => {
            const availableVoices = globalThis.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (!settings.voice && availableVoices.length > 0) {
                const defaultVoice = availableVoices.find(v => v.lang.startsWith('pt-BR')) || availableVoices[0];
                updateSettings({ voice: defaultVoice });
            }
        };

        globalThis.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        handleVoicesChanged(); // Call it once to load voices initially

        return () => globalThis.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    }, [settings.voice, updateSettings]);

    return { settings, voices, updateSettings };
};