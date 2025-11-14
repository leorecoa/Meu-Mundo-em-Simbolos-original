import React, { useState, useEffect } from 'react';
import SettingsModal from './components/modals/SettingsModal';
import Header from './components/Header';
import SentenceEditorScreen from './screens/SentenceEditorScreen';
import TextToSpeechScreen from './screens/TextToSpeechScreen';
import TherapistScreen from './screens/TherapistScreen';
import { useAppearance, useVoiceSettings } from './hooks';

export type ScreenView = 'symbols' | 'text' | 'therapist';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenView>('symbols');
  const { settings: voiceSettings } = useVoiceSettings();
  const [appearance] = useAppearance({ theme: 'dark', fontSize: 'md' });

  // Aplicar tema dark/light no HTML
  useEffect(() => {
    const root = document.documentElement;
    if (appearance.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [appearance.theme]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        onOpenSettings={openModal}
      />
      <div className="flex-grow p-4 text-center">
        {activeScreen === 'symbols' && <SentenceEditorScreen voiceSettings={voiceSettings} />}
        {activeScreen === 'text' && <TextToSpeechScreen />}
        {activeScreen === 'therapist' && <TherapistScreen />}
      </div>
      <SettingsModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
