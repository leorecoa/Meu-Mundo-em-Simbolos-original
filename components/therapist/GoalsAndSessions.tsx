import React, { useState } from 'react';
import { Goal, Session } from '../../types';
import Icon from '../common/Icon';

interface GoalsAndSessionsProps {
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
    sessions: Session[];
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
}

const GoalsAndSessions: React.FC<GoalsAndSessionsProps> = ({ goals, setGoals, sessions, setSessions }) => {
    const [newGoalText, setNewGoalText] = useState('');
    const [sessionNotes, setSessionNotes] = useState('');
    const [sessionDuration, setSessionDuration] = useState('');

    const handleAddGoal = () => {
        if (newGoalText.trim() === '') return;
        const newGoal: Goal = {
            id: crypto.randomUUID(),
            text: newGoalText.trim(),
            isCompleted: false,
            dateAdded: new Date().toISOString(),
        };
        setGoals(prev => [newGoal, ...prev]);
        setNewGoalText('');
    };

    const handleToggleGoal = (id: string) => {
        setGoals(prev => prev.map(goal => 
            goal.id === id ? { ...goal, isCompleted: !goal.isCompleted, dateCompleted: !goal.isCompleted ? new Date().toISOString() : undefined } : goal
        ));
    };
    
    const handleAddSession = () => {
        if (sessionNotes.trim() === '' || !sessionDuration) return;
        const newSession: Session = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            duration: parseInt(sessionDuration, 10),
            notes: sessionNotes.trim(),
        };
        setSessions(prev => [newSession, ...prev]);
        setSessionNotes('');
        setSessionDuration('');
    };
    
    const activeGoals = goals.filter(g => g && !g.isCompleted);
    const completedGoals = goals.filter(g => g && g.isCompleted);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-text-dark">
            {/* Goals Section */}
            <div>
                <h2 className="text-xl font-bold text-text-light mb-4">Metas de Comunicação</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Adicionar nova meta..."
                        className="flex-grow p-2 bg-background-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <button onClick={handleAddGoal} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50" disabled={!newGoalText.trim()}>
                        Adicionar
                    </button>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold mt-4 text-text-light">Ativas</h3>
                    {activeGoals.length > 0 ? activeGoals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onToggle={handleToggleGoal} />
                    )) : <p className="text-subtle text-sm p-2">Nenhuma meta ativa.</p>}
                    
                    <h3 className="font-semibold mt-6 pt-4 border-t border-gray-700 text-text-light">Concluídas</h3>
                    {completedGoals.length > 0 ? completedGoals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onToggle={handleToggleGoal} />
                    )) : <p className="text-subtle text-sm p-2">Nenhuma meta concluída.</p>}
                </div>
            </div>

            {/* Sessions Section */}
            <div>
                <h2 className="text-xl font-bold text-text-light mb-4">Registro de Sessões</h2>
                <div className="bg-background-dark p-4 rounded-lg space-y-3 mb-4">
                    <textarea
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        placeholder="Anotações da sessão..."
                        rows={3}
                        className="w-full p-2 bg-surface-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={sessionDuration}
                            onChange={(e) => setSessionDuration(e.target.value)}
                            placeholder="Duração (min)"
                            className="w-32 p-2 bg-surface-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <button onClick={handleAddSession} className="flex-grow px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark disabled:opacity-50" disabled={!sessionNotes.trim() || !sessionDuration}>
                            Registrar Sessão
                        </button>
                    </div>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                     {sessions.length > 0 ? sessions.filter(Boolean).map(session => (
                        <div key={session.id} className="bg-background-dark p-3 rounded-lg">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-bold text-text-light">{new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                <span className="text-subtle">{session.duration} min</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{session.notes}</p>
                        </div>
                    )) : <p className="text-subtle text-sm p-2">Nenhuma sessão registrada.</p>}
                </div>
            </div>
        </div>
    );
};

const GoalItem: React.FC<{goal: Goal; onToggle: (id: string) => void;}> = ({ goal, onToggle }) => (
    <div className={`flex items-start gap-3 p-2 rounded-md ${goal.isCompleted ? 'bg-green-800/20' : 'bg-background-dark'}`}>
        <button onClick={() => onToggle(goal.id)} className="flex-shrink-0 mt-1">
            <Icon name={goal.isCompleted ? 'checkSquare' : 'square'} className={`text-xl ${goal.isCompleted ? 'text-green-400' : 'text-subtle'}`} />
        </button>
        <span className={`flex-grow ${goal.isCompleted ? 'line-through text-subtle' : ''}`}>{goal.text}</span>
    </div>
);

export default GoalsAndSessions;