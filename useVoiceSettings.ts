import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { VoiceSettings } from '../types';

export const useVoiceSettings = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [settings, setSettings] = useLocalStorage<VoiceSettings>('voiceSettings', {
        voice: null,
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
        handleVoicesChanged();

        return () => {
            globalThis.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, [settings.voice, updateSettings]);

    return { settings, voices, updateSettings };
};