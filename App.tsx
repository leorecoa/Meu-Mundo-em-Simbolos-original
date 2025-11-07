import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import SentenceEditorScreen from './screens/SentenceEditorScreen';
import FreeTextScreen from './screens/FreeTextScreen';
import Header from './components/Header';
import TherapistScreen from './screens/TherapistScreen';

export type ScreenView = 'symbols' | 'text' | 'therapist';

const getScreenFromHash = (): ScreenView => {
    const hash = window.location.hash.substring(1); // Remove '#'
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500); // Increased splash screen time for animation
    return () => clearTimeout(timer);
  }, []);

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
    return <SplashScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'symbols':
        return <SentenceEditorScreen />;
      case 'text':
        return <FreeTextScreen />;
      case 'therapist':
        return <TherapistScreen />;
      default:
        return <SentenceEditorScreen />;
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