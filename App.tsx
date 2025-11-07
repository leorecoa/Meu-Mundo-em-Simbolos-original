import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import SentenceEditorScreen from './screens/SentenceEditorScreen';
import FreeTextScreen from './screens/FreeTextScreen';
import Header from './components/Header';
import TherapistScreen from './screens/TherapistScreen';
import { ProfileProvider } from './contexts/ProfileContext';
import { useLocalStorage } from './hooks';
import { Profile } from './types';
import ProfileScreen from './screens/ProfileScreen';

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
  const [activeProfile, setActiveProfile] = useLocalStorage<Profile | null>('activeProfileId', null);
  const [profiles, setProfiles] = useLocalStorage<Profile[]>('appProfiles', []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500); // Increased splash screen time for animation
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = useCallback(() => {
      setActiveProfile(null);
  }, [setActiveProfile]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <ProfileProvider activeProfile={activeProfile}>
      {!activeProfile ? (
        <ProfileScreen 
            profiles={profiles} 
            setProfiles={setProfiles} 
            onSelectProfile={setActiveProfile} 
        />
      ) : (
        <MainApp onLogout={handleLogout} />
      )}
    </ProfileProvider>
  );
};

// Main application component, rendered only when a profile is active
const MainApp: React.FC<{onLogout: () => void}> = ({ onLogout }) => {
    const [currentScreen, setCurrentScreen] = useState<ScreenView>(getScreenFromHash());

    // Update URL hash when screen changes
    useEffect(() => {
        const path = currentScreen === 'symbols' ? '/' : `/${currentScreen}`;
        const newHash = `#${path}`;
        if (window.location.hash !== newHash) {
            // Use replaceState to avoid polluting browser history on internal nav
            history.pushState(null, '', newHash);
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
            <Header activeScreen={currentScreen} onScreenChange={setCurrentScreen} onLogout={onLogout} />
            <main className="flex-grow min-h-0">
                {renderScreen()}
            </main>
        </div>
    );
}

export default App;