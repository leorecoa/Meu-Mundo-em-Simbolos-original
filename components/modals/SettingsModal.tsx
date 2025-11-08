import React, { useRef } from 'react';
import Icon from '../common/Icon';
import { BackupData, VoiceSettings, AppearanceSettings, Theme, FontSize } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  appearanceSettings: AppearanceSettings;
  onAppearanceSettingsChange: (settings: AppearanceSettings) => void;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = { rate: 0.9, pitch: 1.0 };

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    voiceSettings, 
    onVoiceSettingsChange,
    appearanceSettings,
    onAppearanceSettingsChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
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
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Ocorreu um erro ao exportar os dados.");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        
        const importedData = JSON.parse(text) as Partial<BackupData>;

        if (
          !Array.isArray(importedData.customSymbols || []) ||
          !Array.isArray(importedData.savedPhrases || []) ||
          !Array.isArray(importedData.therapistGoals || []) ||
          !Array.isArray(importedData.therapistSessions || [])
        ) {
          throw new Error("Invalid backup file structure.");
        }
        
        const confirmed = window.confirm(
          "Tem certeza que deseja importar estes dados? Seus dados atuais serão substituídos. Esta ação não pode ser desfeita."
        );

        if (confirmed) {
          localStorage.setItem('customSymbols', JSON.stringify(importedData.customSymbols || []));
          localStorage.setItem('savedPhrases', JSON.stringify(importedData.savedPhrases || []));
          localStorage.setItem('therapistGoals', JSON.stringify(importedData.therapistGoals || []));
          localStorage.setItem('therapistSessions', JSON.stringify(importedData.therapistSessions || []));

          alert("Dados importados com sucesso! O aplicativo será recarregado para aplicar as alterações.");
          window.location.reload();
        }

      } catch (error) {
        console.error("Failed to import data:", error);
        alert("Falha ao importar. O arquivo pode estar corrompido ou em um formato inválido.");
      } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetApp = () => {
    const confirmed = window.confirm(
      "ATENÇÃO: Você tem certeza que deseja resetar o aplicativo? TODOS os seus símbolos personalizados, frases salvas, metas e configurações serão permanentemente apagados. Esta ação não pode ser desfeita."
    );
    if (confirmed) {
        // Lista de chaves usadas pelo app no localStorage
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
        keysToRemove.forEach(key => localStorage.removeItem(key));
        alert("Aplicativo resetado. A página será recarregada.");
        window.location.reload();
    }
  };

  const handleVoiceSettingChange = (setting: keyof VoiceSettings, value: number) => {
    onVoiceSettingsChange({ ...voiceSettings, [setting]: value });
  };
  
  const handleAppearanceSettingChange = <K extends keyof AppearanceSettings>(setting: K, value: AppearanceSettings[K]) => {
    onAppearanceSettingsChange({ ...appearanceSettings, [setting]: value });
  };

  const resetVoiceSettings = () => {
      onVoiceSettingsChange(DEFAULT_VOICE_SETTINGS);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-full text-text-light dark:text-text-dark" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Configurações</h2>
          <button onClick={onClose} className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark">
            <Icon name="close" size={24} />
          </button>
        </div>
        
        {/* Appearance Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold mb-4">Aparência</h3>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tema</label>
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-background-dark rounded-lg">
                    <button onClick={() => handleAppearanceSettingChange('theme', 'light')} className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${appearanceSettings.theme === 'light' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Claro</button>
                    <button onClick={() => handleAppearanceSettingChange('theme', 'dark')} className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${appearanceSettings.theme === 'dark' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Escuro</button>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Tamanho da Fonte</label>
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-background-dark rounded-lg">
                    {(['sm', 'md', 'lg'] as FontSize[]).map(size => (
                        <button key={size} onClick={() => handleAppearanceSettingChange('fontSize', size)} className={`flex-1 text-center text-sm py-1 rounded-md transition-colors ${appearanceSettings.fontSize === size ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{size.toUpperCase()}</button>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
            <h3 className="text-lg font-semibold mb-4">Configurações de Voz</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="rate" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Velocidade da Fala ({voiceSettings.rate.toFixed(1)})</label>
                    <input id="rate" type="range" min="0.5" max="2" step="0.1" value={voiceSettings.rate} onChange={(e) => handleVoiceSettingChange('rate', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
                <div>
                    <label htmlFor="pitch" className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Tom da Voz ({voiceSettings.pitch.toFixed(1)})</label>
                    <input id="pitch" type="range" min="0" max="2" step="0.1" value={voiceSettings.pitch} onChange={(e) => handleVoiceSettingChange('pitch', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
                <button onClick={resetVoiceSettings} className="px-4 py-2 text-sm border border-gray-300 dark:border-subtle text-subtle-light dark:text-subtle-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-text-light dark:hover:text-white transition-colors">Redefinir Padrões</button>
            </div>
        </div>
        
        {/* Data Management */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
            <h3 className="text-lg font-semibold mb-2">Gerenciamento de Dados</h3>
            <p className="text-subtle-light dark:text-subtle-dark text-sm mb-4">
            Salve uma cópia de segurança de todos os seus símbolos personalizados, frases salvas, metas e sessões.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all text-sm font-semibold"><Icon name="download" size={18} />Exportar</button>
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-all text-sm font-semibold"><Icon name="upload" size={18} />Importar</button>
                <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept="application/json,.json" />
            </div>
        </div>

        {/* Reset App */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
            <h3 className="text-lg font-semibold text-red-500 mb-2">Zona de Perigo</h3>
            <div className="bg-red-500/10 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <p className="font-semibold text-red-500">Resetar Aplicativo</p>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm mt-1">Isso apagará permanentemente todos os dados do aplicativo neste navegador.</p>
                </div>
                <button onClick={handleResetApp} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-sm flex-shrink-0">Resetar</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;