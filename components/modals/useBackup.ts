import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../useLocalStorage';
import { SymbolData, Sentence, Goal, Session, BackupData } from '../../types';
import { categories } from '../../constants';

export const useBackup = () => {
  const [customSymbols, setCustomSymbols] = useLocalStorage<SymbolData[]>('customSymbols', []);
  const [savedPhrases, setSavedPhrases] = useLocalStorage<Sentence[]>('savedPhrases', []);
  const [therapistGoals, setTherapistGoals] = useLocalStorage<Goal[]>('therapistGoals', []);
  const [therapistSessions, setTherapistSessions] = useLocalStorage<Session[]>('therapistSessions', []);

  const exportData = useCallback((): BackupData => {
    return {
      customSymbols,
      savedPhrases,
      therapistGoals,
      therapistSessions,
    };
  }, [customSymbols, savedPhrases, therapistGoals, therapistSessions]);

  const importData = useCallback((data: BackupData) => {
    if (data.customSymbols) {
      setCustomSymbols(data.customSymbols);
    }
    if (data.savedPhrases) {
      setSavedPhrases(data.savedPhrases);
    }
    if (data.therapistGoals) {
      setTherapistGoals(data.therapistGoals);
    }
    if (data.therapistSessions) {
      setTherapistSessions(data.therapistSessions);
    }
  }, [setCustomSymbols, setSavedPhrases, setTherapistGoals, setTherapistSessions]);

  return { exportData, importData };
};
