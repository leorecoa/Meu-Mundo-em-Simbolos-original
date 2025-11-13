import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to manage state in localStorage.
 *
 * @param key The key to use in localStorage.
 * @param defaultValue The default value to use if no value is found in localStorage.
 * @returns A state and a function to update it, similar to useState.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [value, setValue] = useState<T>(() => {
        try {
            const storedValue = globalThis.localStorage.getItem(key);
            if (storedValue !== null) {
                return JSON.parse(storedValue) as T;
            }
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
        }
        return defaultValue;
    });

    const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
            setValue(valueToStore);
            globalThis.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, value]);

    // Efeito para sincronização entre abas
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== event.oldValue) {
                try {
                    setValue(event.newValue ? JSON.parse(event.newValue) : defaultValue);
                } catch (error) {
                    console.error(`Error parsing new value for localStorage key “${key}”:`, error);
                    setValue(defaultValue);
                }
            }
        };

        globalThis.addEventListener('storage', handleStorageChange);
        return () => globalThis.removeEventListener('storage', handleStorageChange);
    }, [key, defaultValue]);

    return [value, setStoredValue];
}