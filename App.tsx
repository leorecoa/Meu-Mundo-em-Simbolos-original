import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import SentenceEditorScreen from './screens/SentenceEditorScreen';
import FreeTextScreen from './screens/FreeTextScreen';
import Header from './components/Header';
import TherapistScreen from './screens/TherapistScreen';
import { Sentence, SymbolData } from './types';

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
    if (window.location.hash !== `#${path}`) {
      window.location.hash = path;
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
    return <SplashScreen onStart={() => setLoading(false)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'symbols':
        return (
          <SentenceEditorScreen
            savedPhrases={savedPhrases}
            setSavedPhrases={setSavedPhrases}
            customSymbols={customSymbols}
            setCustomSymbols={setCustomSymbols}
          />
        );
      case 'text':
        return <FreeTextScreen />;
      case 'therapist':
        return <TherapistScreen savedPhrases={savedPhrases} customSymbols={customSymbols} />;
      default:
        // Fallback to symbols screen with props
        return <SentenceEditorScreen savedPhrases={savedPhrases} setSavedPhrases={setSavedPhrases} customSymbols={customSymbols} setCustomSymbols={setCustomSymbols} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark text-text-dark">
      <Header activeScreen={currentScreen} onScreenChange={setCurrentScreen} />
      <main className="flex-grow min-h-0">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;