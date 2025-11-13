import React from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AppearanceSettings } from '../types';

export function useAppearance(initialSettings: AppearanceSettings): [AppearanceSettings, React.Dispatch<React.SetStateAction<AppearanceSettings>>] {
    const [appearance, setAppearance] = useLocalStorage<AppearanceSettings>('appearanceSettings', initialSettings);

    React.useEffect(() => {
        const body = document.body;
        // Limpa classes antigas para evitar conflitos
        body.className = '';
        body.classList.add(`theme-${appearance.theme}`, `font-size-${appearance.fontSize}`);
        // Adiciona a classe de tema também ao elemento <html> para consistência
        document.documentElement.className = appearance.theme;
    }, [appearance]);

    return [appearance, setAppearance];
}