import React, { useState, useEffect } from 'react';
import { AppearanceSettings } from './types';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
          return initialValue;
      }
      const parsedItem = JSON.parse(item);
      
      // If initial value is an array, ensure the stored value is also an array.
      if (Array.isArray(initialValue)) {
        if(Array.isArray(parsedItem)) {
            return parsedItem;
        }
        console.warn(`Data for key "${key}" in localStorage is not an array. Resetting to default.`);
        return initialValue;
      }

      // If it's an object, merge the stored value with the initial value to ensure all properties exist.
      if (typeof initialValue === 'object' && initialValue !== null && typeof parsedItem === 'object' && parsedItem !== null) {
          return { ...initialValue, ...parsedItem };
      }

      return parsedItem ?? initialValue;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
            try {
                if (e.newValue === null) {
                    setStoredValue(initialValue);
                    return;
                }

                const parsedValue = JSON.parse(e.newValue);
                
                if (Array.isArray(initialValue)) {
                    if (Array.isArray(parsedValue)) {
                        // FIX: Cast parsedValue to T to match the state's generic type.
                        setStoredValue(parsedValue as T);
                        return;
                    }
                    console.warn(`Data for key "${key}" in localStorage is not an array during storage event. Resetting to default.`);
                    setStoredValue(initialValue);
                    return;
                }
                
                if (typeof initialValue === 'object' && initialValue !== null && typeof parsedValue === 'object' && parsedValue !== null) {
                    // FIX: Cast the merged object to T to match the state's generic type.
                    setStoredValue({ ...initialValue, ...parsedValue } as T);
                    return;
                }

                // FIX: Cast the parsed value to T to match the state's generic type.
                setStoredValue((parsedValue ?? initialValue) as T);
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
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export function useAppearance(initialSettings: AppearanceSettings): [AppearanceSettings, (settings: AppearanceSettings) => void] {
  const [settings, setSettings] = useLocalStorage<AppearanceSettings>('appearanceSettings', initialSettings);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Gerencia o tema
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);

    // Gerencia o tamanho da fonte
    document.body.style.fontSize = `var(--font-size-${settings.fontSize})`;
  }, [settings]);

  return [settings, setSettings];
}