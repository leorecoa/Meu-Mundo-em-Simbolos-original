import { useState, useEffect, useCallback } from 'react';

export interface VoiceSettings {
    voice: SpeechSynthesisVoice | null;
    pitch: number;
    rate: number;
    volume: number;
}

export const useVoiceSettings = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [settings, setSettings] = useState<VoiceSettings>({
        voice: null,
        pitch: 1,
        rate: 1,
        volume: 1,
    });

    useEffect(() => {
        const handleVoicesChanged = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            // Define uma voz padrão se nenhuma estiver selecionada
            if (!settings.voice && availableVoices.length > 0) {
                setSettings(prev => ({ ...prev, voice: availableVoices[0] }));
            }
        };

        // O evento 'voiceschanged' é disparado quando a lista de vozes é carregada
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        // Carrega as vozes imediatamente caso já estejam disponíveis
        handleVoicesChanged();

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, [settings.voice]);

    const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    const speak = useCallback((text: string) => {
        if (!settings.voice) {
            console.warn("Nenhuma voz selecionada.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = settings.voice;
        utterance.pitch = settings.pitch;
        utterance.rate = settings.rate;
        utterance.volume = settings.volume;
        window.speechSynthesis.speak(utterance);
    }, [settings]);

    return { settings, voices, updateSettings, speak };
};