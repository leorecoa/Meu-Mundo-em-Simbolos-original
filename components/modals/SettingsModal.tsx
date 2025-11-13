import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppearanceSettings, VoiceSettings } from '../../types';
import Icon from '../common/Icon';
import { useBackup } from '../../hooks/useBackup';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (newSettings: Partial<VoiceSettings>) => void;
  appearanceSettings: AppearanceSettings;
  onAppearanceSettingsChange: (settings: AppearanceSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voiceSettings,
  onVoiceSettingsChange,
  appearanceSettings,
  onAppearanceSettingsChange,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { exportData, importData, resetApp } = useBackup();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = globalThis.speechSynthesis.getVoices();
      const ptBRVoices = availableVoices.filter(v => v.lang.startsWith('pt-BR'));
      setVoices(ptBRVoices);
    };
    loadVoices();
    globalThis.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      globalThis.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // ✅ Gerenciamento de Foco e estado do modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        lastFocusedElementRef.current = document.activeElement as HTMLElement;
        dialog.showModal();
        // Foca no primeiro elemento focável, o botão de fechar
        const closeButton = dialog.querySelector('button[aria-label="Fechar"]');
        (closeButton as HTMLElement)?.focus();
      } else {
        dialog.close();
        lastFocusedElementRef.current?.focus();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleExport = useCallback(() => {
    exportData();
  }, [exportData]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    importData(event);
  }, [importData]);

  const handleResetApp = useCallback(() => {
    if (globalThis.confirm('Tem certeza que deseja resetar o aplicativo? Todos os seus dados (símbolos personalizados, frases salvas, etc.) serão perdidos.')) {
      resetApp();
    }
  }, [resetApp]);

  const handleAppearanceChange = (key: keyof AppearanceSettings, value: string) => {
    onAppearanceSettingsChange({ ...appearanceSettings, [key]: value });
  };

  const handleVoiceSettingChange = useCallback((key: keyof VoiceSettings, value: string | number) => {
    if (key === 'voice') {
      const selectedVoice = voices.find(v => v.name === value) || null;
      onVoiceSettingsChange({ [key]: selectedVoice });
    } else {
      onVoiceSettingsChange({ [key]: value });
    }
  }, [onVoiceSettingsChange, voices]);

  const resetVoiceSettings = useCallback(() => {
    onVoiceSettingsChange({ rate: 1, pitch: 1, volume: 1, voice: null });
  }, [onVoiceSettingsChange]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop:bg-black/60"
      onClick={handleBackdropClick} // O backdrop do <dialog> não é clicável por padrão
      onClose={onClose}
    >
      <div
        className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-full text-text-light dark:text-text-dark"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="settings-modal-title" className="text-2xl font-bold">
            Configurações
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Fechar"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* ✅ Agrupamento semântico com fieldset e legend */}
        <fieldset className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
          <legend className="text-lg font-semibold mb-4">Aparência</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="theme-select" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tema</label>
              <select
                id="theme-select"
                value={appearanceSettings.theme}
                onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                className="w-full p-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-600"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
            <div>
              <label htmlFor="fontsize-select" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tamanho da Fonte</label>
              <select
                id="fontsize-select"
                value={appearanceSettings.fontSize}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                className="w-full p-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-600"
              >
                <option value="sm">Pequeno</option>
                <option value="md">Médio</option>
                <option value="lg">Grande</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Voice Settings */}
        <fieldset className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
          <legend className="text-lg font-semibold mb-4">Configurações de Voz</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="voice-select" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Voz</label>
              <select
                id="voice-select"
                value={voiceSettings.voice?.name || ''}
                onChange={(e) => handleVoiceSettingChange('voice', e.target.value)}
                className="w-full p-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-600"
              >
                <option value="">Padrão do Navegador</option>
                {voices.map(v => (
                  <option key={v.name} value={v.name}>{`${v.name} (${v.lang})`}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rate-slider" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Velocidade: {voiceSettings.rate.toFixed(1)}</label>
              <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={voiceSettings.rate} onChange={(e) => handleVoiceSettingChange('rate', Number.parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <label htmlFor="pitch-slider" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tom: {voiceSettings.pitch.toFixed(1)}</label>
              <input id="pitch-slider" type="range" min="0" max="2" step="0.1" value={voiceSettings.pitch} onChange={(e) => handleVoiceSettingChange('pitch', Number.parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <label htmlFor="volume-slider" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Volume: {voiceSettings.volume.toFixed(1)}</label>
              <input id="volume-slider" type="range" min="0" max="1" step="0.1" value={voiceSettings.volume} onChange={(e) => handleVoiceSettingChange('volume', Number.parseFloat(e.target.value))} className="w-full" />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={resetVoiceSettings} className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Resetar Configurações de Voz
            </button>
          </div>
        </fieldset>

        {/* Gerenciamento de Dados */}
        <fieldset className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
          <legend className="text-lg font-semibold mb-4">Gerenciamento de Dados</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={handleExport} className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <Icon name="download" size={18} />
              Exportar Dados
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <Icon name="upload" size={18} />
              Importar Dados
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              className="hidden"
              accept=".json"
            />
          </div>
        </fieldset>

        {/* Resetar Aplicativo */}
        <fieldset className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
          <legend className="text-lg font-semibold mb-4 text-red-500">Zona de Perigo</legend>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">A ação abaixo é irreversível e apagará todos os seus dados permanentemente.</p>
            <button onClick={handleResetApp} className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
              <Icon name="trash" size={18} />
              Resetar Aplicativo
            </button>
          </div>
        </fieldset>
      </div>
    </dialog>
  );
};

export default SettingsModal;