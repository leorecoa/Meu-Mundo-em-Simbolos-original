import React, { useState } from 'react';
import PinLockScreen from '../components/therapist/PinLockScreen';
import AnalyticsDashboard from '../components/therapist/AnalyticsDashboard';
import GoalsAndSessions from '../components/therapist/GoalsAndSessions';
import { useLocalStorage } from '../hooks';
import { SymbolData, Sentence, Goal, Session } from '../types';

const TherapistScreen: React.FC = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pin, setPin] = useLocalStorage<string | null>('therapistPin', null);
    const [customSymbols] = useLocalStorage<SymbolData[]>('customSymbols', []);
    const [savedPhrases] = useLocalStorage<Sentence[]>('savedPhrases', []);
    const [goals, setGoals] = useLocalStorage<Goal[]>('therapistGoals', []);
    const [sessions, setSessions] = useLocalStorage<Session[]>('therapistSessions', []);

    if (!isUnlocked) {
        return <PinLockScreen storedPin={pin} onUnlock={() => setIsUnlocked(true)} onPinSet={setPin} />;
    }

    return (
        <div className="flex flex-col h-full p-4 gap-6 font-sans overflow-y-auto">
            <div className="bg-surface-dark/50 p-4 sm:p-6 rounded-2xl shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-light mb-2">Área do Acompanhante</h1>
                <p className="text-subtle">Gerencie metas, sessões e visualize análises de comunicação.</p>
            </div>
            
            <AnalyticsDashboard 
                savedPhrases={savedPhrases} 
                customSymbols={customSymbols} 
            />
            
            <GoalsAndSessions 
                goals={goals}
                setGoals={setGoals}
                sessions={sessions}
                setSessions={setSessions}
            />
        </div>
    );
};

export default TherapistScreen;