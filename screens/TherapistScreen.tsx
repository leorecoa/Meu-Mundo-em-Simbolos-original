import React, { useState } from 'react';
import PinLockScreen from '../components/therapist/PinLockScreen';
import { useLocalStorage } from '../hooks';

const TherapistScreen: React.FC = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pin, setPin] = useLocalStorage<string | null>('therapistPin', null);

    if (!isUnlocked) {
        return <PinLockScreen storedPin={pin} onUnlock={() => setIsUnlocked(true)} onPinSet={setPin} />;
    }

    return <div className="text-white">Área do Acompanhante (A ser implementada)</div>;
};

export default TherapistScreen;