import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import SentenceEditorScreen from './screens/SentenceEditorScreen';
import FreeTextScreen from './screens/FreeTextScreen';
import Header from './components/Header';
import TherapistScreen from './screens/TherapistScreen';
import SettingsModal from './components/modals/SettingsModal';
import { useLocalStorage } from './hooks';
import { VoiceSettings, AppearanceSettings } from './types';

export type ScreenView = 'symbols' | 'text' | 'therapist';

const getScreenFromHash = (): ScreenView => {
    const hash = window.location.hash.substring(1); // Remove '#', leaves '/text', '/therapist', '/' or ''
    switch (hash) {
        case '/text':
            return 'text';
        case '/therapist':
            return 'therapist';
        case '/symbols':
        case '/':
        case '':
        default:
            return 'symbols';
    }
};


const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(getScreenFromHash());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voiceSettings, setVoiceSettings] = useLocalStorage<VoiceSettings>('voiceSettings', { rate: 0.9, pitch: 1.0 });
  const [appearanceSettings, setAppearanceSettings] = useLocalStorage<AppearanceSettings>('appearanceSettings', { theme: 'dark', fontSize: 'md' });

  useEffect(() => {
    const root = document.documentElement;
    // Theme
    if (appearanceSettings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    // Font Size
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    const fontSizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
    root.classList.add(fontSizeMap[appearanceSettings.fontSize]);

  }, [appearanceSettings]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500); // Increased splash screen time for animation
    return () => clearTimeout(timer);
  }, []);

  // Update URL hash when screen changes
  useEffect(() => {
      const path = currentScreen === 'symbols' ? '/' : `/${currentScreen}`;
      const newHash = `#${path}`;
      if (window.location.hash !== newHash) {
          // Use replaceState to avoid polluting browser history on internal nav
          history.replaceState(null, '', newHash);
      }
  }, [currentScreen]);

  // Listen for hash changes (back/forward buttons)
  useEffect(() => {
      const handleHashChange = () => {
          setCurrentScreen(getScreenFromHash());
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  
  const renderScreen = () => {
      switch (currentScreen) {
      case 'symbols':
          return <SentenceEditorScreen voiceSettings={voiceSettings} />;
      case 'text':
          return <FreeTextScreen voiceSettings={voiceSettings} />;
      case 'therapist':
          return <TherapistScreen />;
      default:
          return <SentenceEditorScreen voiceSettings={voiceSettings} />;
      }
  };

  return (
      <div className="flex flex-col h-screen bg-white dark:bg-background-dark text-gray-800 dark:text-text-dark transition-colors duration-300">
          <Header 
            activeScreen={currentScreen} 
            onScreenChange={setCurrentScreen} 
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          <main className="flex-grow min-h-0">
              {renderScreen()}
          </main>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            voiceSettings={voiceSettings}
            onVoiceSettingsChange={setVoiceSettings}
            appearanceSettings={appearanceSettings}
            onAppearanceSettingsChange={setAppearanceSettings}
          />
      </div>
  );
}

export default App;