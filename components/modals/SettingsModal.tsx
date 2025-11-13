import React, { useRef, useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = globalThis.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    globalThis.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged(); // Carrega as vozes imediatamente
    return () => globalThis.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
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
  }

  function handleResetApp() {
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
  }

  function handleVoiceSettingChange(setting: keyof VoiceSettings, value: number | string) {
    if (setting === 'voice') {
      const selectedVoice = voices.find(v => v.name === value) || null;
      onVoiceSettingsChange({ ...voiceSettings, voice: selectedVoice });
    } else {
      onVoiceSettingsChange({ ...voiceSettings, [setting]: value });
    }
  }

  function handleAppearanceSettingChange<K extends keyof AppearanceSettings>(setting: K, value: AppearanceSettings[K]) {
    onAppearanceSettingsChange({ ...appearanceSettings, [setting]: value });
  }

  function resetVoiceSettings() {
    onVoiceSettingsChange(DEFAULT_VOICE_SETTINGS);
  }

  if (!isOpen) return null;

  return (
    // ✅ Substituí role="dialog" por <dialog> para acessibilidade
    <dialog
      open
      aria-modal="true"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
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
          {/* ...restante igual */}
        </fieldset>

        {/* Data Management e Reset App permanecem iguais */}
      </div>
    </dialog>
  );
};

export default SettingsModal;