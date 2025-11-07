// FIX: Import React to make the React namespace available for types like React.Dispatch.
import React, { useState, useEffect, useContext } from 'react';
import { ProfileContext } from './contexts/ProfileContext';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { activeProfile } = useContext(ProfileContext);
  
  // Create a profile-specific key
  const compositeKey = activeProfile ? `${activeProfile.id}_${key}` : key;

  const [storedValue, setStoredValue] = useState<T>(() => {
    // If there's no active profile, we don't load any data to prevent bleed.
    // However, for the list of profiles itself, we need to load it.
    if (!activeProfile && key !== 'appProfiles' && key !== 'activeProfileId') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(compositeKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // When the active profile changes, we need to re-read from localStorage
  useEffect(() => {
    if (!activeProfile && key !== 'appProfiles' && key !== 'activeProfileId') {
      setStoredValue(initialValue);
      return;
    }
    try {
        const item = window.localStorage.getItem(compositeKey);
        setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
        console.error(`Error reading from localStorage for key "${compositeKey}":`, error);
        setStoredValue(initialValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositeKey, initialValue, activeProfile]);


  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    // Prevent setting data if no profile is active, except for profile management keys
    if (!activeProfile && key !== 'appProfiles' && key !== 'activeProfileId') {
      return;
    }
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(compositeKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === compositeKey) {
            try {
                const newValue = e.newValue;
                if (newValue !== null) {
                    setStoredValue(JSON.parse(newValue));
                } else {
                    setStoredValue(initialValue);
                }
            } catch (error) {
                console.error(error);
                setStoredValue(initialValue);
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [compositeKey, initialValue]);

  return [storedValue, setValue];
}