import React, { useState } from 'react';
import { useLocalStorage } from '../hooks';
import { Sentence, SymbolData, Goal, Session } from '../types';
import AnalyticsDashboard from '../components/therapist/AnalyticsDashboard';
import GoalsAndSessions from '../components/therapist/GoalsAndSessions';
import PinLockScreen from '../components/therapist/PinLockScreen';

type TherapistTab = 'analytics' | 'goals';

const TherapistScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TherapistTab>('analytics');
    const [isUnlocked, setIsUnlocked] = useState(false);
    
    // Data hooks from localStorage
    const [therapistPin, setTherapistPin] = useLocalStorage<string | null>('therapistPin', null);
    const [savedPhrases] = useLocalStorage<Sentence[]>('savedPhrases', []);
    const [customSymbols] = useLocalStorage<SymbolData[]>('customSymbols', []);
    const [goals, setGoals] = useLocalStorage<Goal[]>('therapistGoals', []);
    const [sessions, setSessions] = useLocalStorage<Session[]>('therapistSessions', []);

    if (!isUnlocked) {
        return (
            <PinLockScreen
                storedPin={therapistPin}
                onUnlock={() => setIsUnlocked(true)}
                onPinSet={(newPin) => {
                    setTherapistPin(newPin);
                    setIsUnlocked(true);
                }}
            />
        );
    }

    const TabButton: React.FC<{ tabId: TherapistTab; label: string; }> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tabId ? 'bg-primary text-white' : 'text-subtle hover:bg-surface-dark'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-full p-2 sm:p-4 font-sans text-text-dark animate-fadeIn overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                     <h1 className="text-xl sm:text-2xl font-bold text-text-light">Painel do Acompanhante</h1>
                     <div className="flex items-center gap-2 p-1 bg-background-dark/60 rounded-xl self-end sm:self-center">
                        <TabButton tabId="analytics" label="Desempenho" />
                        <TabButton tabId="goals" label="Metas e Sessões" />
                    </div>
                </div>

                <div className="bg-surface-dark/50 p-3 sm:p-6 rounded-2xl shadow-lg">
                    {activeTab === 'analytics' && <AnalyticsDashboard savedPhrases={savedPhrases} customSymbols={customSymbols} />}
                    {activeTab === 'goals' && <GoalsAndSessions goals={goals} setGoals={setGoals} sessions={sessions} setSessions={setSessions} />}
                </div>
            </div>
        </div>
    );
};

export default TherapistScreen;