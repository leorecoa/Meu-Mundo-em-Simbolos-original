import React, { useState } from 'react';
import SettingsModal from './components/modals/SettingsModal';
import Header from './components/Header';
import SentenceEditorScreen from './screens/SentenceEditorScreen'; // Importa a tela principal
import TextToSpeechScreen from './screens/TextToSpeechScreen'; // Placeholder para a tela de Texto
import TherapistScreen from './screens/TherapistScreen'; // Placeholder para a tela de Acompanhante
import { useLocalStorage } from './hooks';
import { useAppearance } from './hooks/useAppearance';
import { VoiceSettings, AppearanceSettings } from './types';

// Define e exporta o tipo para as telas.
export type ScreenView = 'symbols' | 'text' | 'therapist';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenView>('symbols');
  const [voiceSettings, setVoiceSettings] = useLocalStorage<VoiceSettings>('voiceSettings', { rate: 0.9, pitch: 1.0, volume: 1, voice: null });
  const [appearance, setAppearance] = useAppearance({ theme: 'dark', fontSize: 'md' });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        onOpenSettings={openModal}
      />
      <div className="flex-grow p-4 text-center">
        {/* Renderiza o conteúdo com base na tela ativa */}
        {activeScreen === 'symbols' && <div>Tela de Símbolos</div>}
        {activeScreen === 'text' && <div>Tela de Texto</div>}
        {activeScreen === 'therapist' && <div>Tela do Acompanhante</div>}
        {activeScreen === 'symbols' && <SentenceEditorScreen voiceSettings={voiceSettings} />}
        {activeScreen === 'text' && <TextToSpeechScreen />}
        {activeScreen === 'therapist' && <TherapistScreen />}
      </div>
      <SettingsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        voiceSettings={voiceSettings}
        onVoiceSettingsChange={setVoiceSettings}
        appearanceSettings={appearance}
        onAppearanceSettingsChange={setAppearance}
      />
    </div>
  );
}

export default App;