import React, { useState } from 'react';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import { useVoiceSettings, VoiceSettings } from './hooks/useVoiceSettings';

// Mock da interface AppearanceSettings, já que o hook não foi fornecido
interface AppearanceSettings {
  theme: 'dark' | 'light';
  fontSize: number;
}

// Define e exporta o tipo para as telas, resolvendo o erro de importação no Header.
export type ScreenView = 'symbols' | 'text' | 'therapist';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenView>('symbols');
  const {
    settings: voiceSettings,
    updateSettings: onVoiceSettingsChange,
    voices,
    speak,
  } = useVoiceSettings();

  // Mock do estado de aparência
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'dark',
    fontSize: 16,
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div style={styles.main}>
      <Header
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        onOpenSettings={openModal}
      />
      <div style={styles.container}>
        {/* Renderiza o conteúdo com base na tela ativa */}
        {activeScreen === 'symbols' && <div>Tela de Símbolos</div>}
        {activeScreen === 'text' && <div>Tela de Texto</div>}
        {activeScreen === 'therapist' && <div>Tela do Acompanhante</div>}
      </div>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        voiceSettings={voiceSettings}
        onVoiceSettingsChange={onVoiceSettingsChange}
        appearanceSettings={appearanceSettings}
        onAppearanceSettingsChange={setAppearanceSettings}
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#333',
    color: 'white'
  },
  container: {
    padding: '2rem',
    textAlign: 'center',
    flex: 1
  },
};

export default App;