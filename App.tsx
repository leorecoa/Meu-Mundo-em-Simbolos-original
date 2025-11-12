import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import SentenceEditorScreen from './screens/SentenceEditorScreen';
import FreeTextScreen from './screens/FreeTextScreen';
import Header from './components/Header';
import TherapistScreen from './screens/TherapistScreen';
import { Sentence, SymbolData, VoiceSettings } from './types';
import FeedbackButton from './components/FeedbackButton';

export type ScreenView = 'symbols' | 'text' | 'therapist';

const getScreenFromHash = (): ScreenView => {
  const hash = globalThis.location?.hash?.substring(1) ?? ''; // Remove '#'
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
  const [savedPhrases, setSavedPhrases] = useState<Sentence[]>([]);
  const [customSymbols, setCustomSymbols] = useState<SymbolData[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({ rate: 1, pitch: 1 });
  const [showSettings, setShowSettings] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedPhrases = localStorage.getItem('savedPhrases');
      if (storedPhrases) {
        setSavedPhrases(JSON.parse(storedPhrases));
      }
      const storedSymbols = localStorage.getItem('customSymbols');
      if (storedSymbols) {
        setCustomSymbols(JSON.parse(storedSymbols));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savedPhrases', JSON.stringify(savedPhrases));
    localStorage.setItem('customSymbols', JSON.stringify(customSymbols));
  }, [savedPhrases, customSymbols]);

  // Update URL hash when screen changes
  useEffect(() => {
    const path = currentScreen === 'symbols' ? '/' : `/${currentScreen}`;
    if (globalThis.location?.hash !== `#${path}`) {
      globalThis.location.hash = path;
    }
  }, [currentScreen]);

  // Listen for hash changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentScreen(getScreenFromHash());
    };
    globalThis.addEventListener('hashchange', handleHashChange);
    return () => globalThis.removeEventListener('hashchange', handleHashChange);
  }, []);


  if (loading) {
    return <SplashScreen onStart={() => setLoading(false)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'symbols':
        return (
          <SentenceEditorScreen
            voiceSettings={voiceSettings}
          />
        );
      case 'text':
        return <FreeTextScreen voiceSettings={voiceSettings} />;
      case 'therapist':
        return <TherapistScreen />;
      default:
        return <SentenceEditorScreen voiceSettings={voiceSettings} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark text-text-light">
      <Header activeScreen={currentScreen} onScreenChange={setCurrentScreen} onOpenSettings={() => setShowSettings(true)} />
      <main className="flex-grow min-h-0">
        {renderScreen()}
      </main>
      <FeedbackButton />
    </div>
  );
};

export default App;