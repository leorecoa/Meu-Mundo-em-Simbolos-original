import React, { useRef, useState, useEffect, useCallback } from 'react';
import Icon from '../common/Icon'; // Mantido
import { BackupData, VoiceSettings, AppearanceSettings, FontSize } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  appearanceSettings: AppearanceSettings;
  onAppearanceSettingsChange: (settings: AppearanceSettings) => void;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = { rate: 0.9, pitch: 1, volume: 1, voice: null };

function handleExport() {
  try {
    const customSymbols = localStorage.getItem('customSymbols') || '[]';
    const savedPhrases = localStorage.getItem('savedPhrases') || '[]';
    const therapistGoals = localStorage.getItem('therapistGoals') || '[]';
    const therapistSessions = localStorage.getItem('therapistSessions') || '[]';

    const backupData: BackupData = {
      customSymbols: JSON.parse(customSymbols),
      savedPhrases: JSON.parse(savedPhrases),
      therapistGoals: JSON.parse(therapistGoals),
      therapistSessions: JSON.parse(therapistSessions),
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `meu-mundo-em-simbolos-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export data:", error);
    alert("Ocorreu um erro ao exportar os dados.");
  }
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voiceSettings,
  onVoiceSettingsChange,
  appearanceSettings,
  onAppearanceSettingsChange
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const handleVoicesChanged = useCallback(() => {
    const availableVoices = globalThis.speechSynthesis.getVoices();
    setVoices(availableVoices);
  }, []);

  useEffect(() => {
    globalThis.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged(); // Carrega as vozes imediatamente
    return () => globalThis.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
  }, [handleVoicesChanged]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      if (typeof text !== 'string') throw new TypeError("File could not be read as text");

      const importedData = JSON.parse(text) as Partial<BackupData>;

      if (
        !Array.isArray(importedData.customSymbols || []) ||
        !Array.isArray(importedData.savedPhrases || []) ||
        !Array.isArray(importedData.therapistGoals || []) ||
        !Array.isArray(importedData.therapistSessions || [])
      ) {
        // ✅ Corrigido para TypeError (mais específico que Error)
        throw new TypeError("Invalid backup file structure.");
      }

      const confirmed = globalThis.confirm(
        "Tem certeza que deseja importar estes dados? Seus dados atuais serão substituídos. Esta ação não pode ser desfeita."
      );

      if (confirmed) {
        localStorage.setItem('customSymbols', JSON.stringify(importedData.customSymbols || []));
        localStorage.setItem('savedPhrases', JSON.stringify(importedData.savedPhrases || []));
        localStorage.setItem('therapistGoals', JSON.stringify(importedData.therapistGoals || []));
        localStorage.setItem('therapistSessions', JSON.stringify(importedData.therapistSessions || []));

        alert("Dados importados com sucesso! O aplicativo será recarregado para aplicar as alterações.");
        globalThis.location.reload();
      }

    } catch (error) {
      console.error("Failed to import data:", error);
      alert("Falha ao importar. O arquivo pode estar corrompido ou em um formato inválido.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, []);

  const handleResetApp = useCallback(() => {
    const confirmed = globalThis.confirm(
      "ATENÇÃO: Você tem certeza que deseja resetar o aplicativo? TODOS os seus símbolos personalizados, frases salvas, metas e configurações serão permanentemente apagados. Esta ação não pode ser desfeita."
    );
    if (confirmed) {
      const keysToRemove = [
        'customSymbols',
        'savedPhrases',
        'therapistGoals',
        'therapistSessions',
        'therapistPin',
        'voiceSettings',
        'appearanceSettings',
        'hasVisitedBefore'
      ];
      for (const key of keysToRemove) { localStorage.removeItem(key); }
      alert("Aplicativo resetado. A página será recarregada.");
      globalThis.location.reload();
    }
  }, []);

  const handleVoiceSettingChange = useCallback((setting: keyof VoiceSettings, value: number | string) => {
    if (setting === 'voice') {
      const selectedVoice = voices.find(v => v.name === value) || null;
      onVoiceSettingsChange({ ...voiceSettings, voice: selectedVoice });
    } else {
      onVoiceSettingsChange({ ...voiceSettings, [setting]: value });
    }
  }, [voices, onVoiceSettingsChange, voiceSettings]);

  const handleAppearanceSettingChange = useCallback(<K extends keyof AppearanceSettings>(setting: K, value: AppearanceSettings[K]) => {
    onAppearanceSettingsChange({ ...appearanceSettings, [setting]: value });
  }, [appearanceSettings, onAppearanceSettingsChange]);

  const resetVoiceSettings = useCallback(() => {
    onVoiceSettingsChange(DEFAULT_VOICE_SETTINGS);
  }, [onVoiceSettingsChange]);

  if (!isOpen) return null;

  return (
    // ✅ Substituí role="dialog" por <dialog> para acessibilidade
    <dialog
      open
      aria-modal="true"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose} // NOSONAR
    >
      <div
        className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-full text-text-light dark:text-text-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Configurações</h2>
          <button
            onClick={onClose}
            aria-label="Fechar configurações"
            className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* ✅ Substituí role="group" por fieldset */}
        <fieldset className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <legend className="text-lg font-semibold mb-4">Aparência</legend>
          <div className="space-y-4">
            <fieldset>
              <legend id="theme-label" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tema</legend>
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-background-dark rounded-lg">
                <button
                  onClick={() => handleAppearanceSettingChange('theme', 'light')}
                  className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${appearanceSettings.theme === 'light' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  Claro
                </button>
                <button
                  onClick={() => handleAppearanceSettingChange('theme', 'dark')}
                  className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${appearanceSettings.theme === 'dark' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  Escuro
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend id="font-size-label" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tamanho da Fonte</legend>
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-background-dark rounded-lg">
                {(['sm', 'md', 'lg'] as FontSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => handleAppearanceSettingChange('fontSize', size)}
                    className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${appearanceSettings.fontSize === size ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </fieldset>
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
              <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={voiceSettings.rate} onChange={(e) => handleVoiceSettingChange('rate', parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <label htmlFor="pitch-slider" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tom: {voiceSettings.pitch.toFixed(1)}</label>
              <input id="pitch-slider" type="range" min="0" max="2" step="0.1" value={voiceSettings.pitch} onChange={(e) => handleVoiceSettingChange('pitch', parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <label htmlFor="volume-slider" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Volume: {voiceSettings.volume.toFixed(1)}</label>
              <input id="volume-slider" type="range" min="0" max="1" step="0.1" value={voiceSettings.volume} onChange={(e) => handleVoiceSettingChange('volume', parseFloat(e.target.value))} className="w-full" />
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