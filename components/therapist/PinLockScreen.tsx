import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';

interface PinLockScreenProps {
  storedPin: string | null;
  onUnlock: () => void;
  onPinSet: (pin: string) => void;
}

const PIN_LENGTH = 4;

const PinLockScreen: React.FC<PinLockScreenProps> = ({ storedPin, onUnlock, onPinSet }) => {
  const [mode, setMode] = useState<'setup' | 'confirm' | 'entry'>(storedPin ? 'entry' : 'setup');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');

  const titles = {
    setup: 'Crie um PIN de 4 dígitos',
    confirm: 'Confirme seu novo PIN',
    entry: 'Digite seu PIN de Acompanhante',
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      switch (mode) {
        case 'setup':
          setFirstPin(pin);
          setMode('confirm');
          setPin('');
          break;
        case 'confirm':
          if (pin === firstPin) {
            onPinSet(pin);
          } else {
            setError('Os PINs não correspondem. Tente novamente.');
            setMode('setup');
            setPin('');
            setFirstPin('');
          }
          break;
        case 'entry':
          if (pin === storedPin) {
            onUnlock();
          } else {
            setError('PIN incorreto. Tente novamente.');
            setPin('');
          }
          break;
      }
    } else {
        setError(''); // Limpa o erro quando o usuário começa a digitar
    }
  }, [pin, mode, firstPin, storedPin, onPinSet, onUnlock]);

  const handleKeyClick = (key: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(pin + key);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };
  
  const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-fadeIn">
      <div className="w-full max-w-xs bg-surface-dark/50 p-6 sm:p-8 rounded-2xl shadow-lg text-center">
        <Icon name="clipboardList" size={40} className="mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-bold text-text-light mb-2">{titles[mode]}</h2>
        <p className="text-subtle text-sm min-h-[20px] mb-6 text-red-400">{error || 'Esta área contém informações sensíveis.'}</p>
        
        <div className="flex justify-center items-center gap-4 mb-8">
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                index < pin.length ? 'bg-primary' : 'bg-background-dark'
              }`}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {keypadKeys.map((key, index) => {
            if (key === 'backspace') {
              return (
                <button
                  key={index}
                  onClick={handleBackspace}
                  disabled={pin.length === 0}
                  className="p-4 text-2xl font-semibold bg-background-dark rounded-full aspect-square flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50"
                  aria-label="Apagar"
                >
                  <Icon name="backspace" size={28} />
                </button>
              );
            }
            if (key === '') {
              return <div key={index} />;
            }
            return (
              <button
                key={index}
                onClick={() => handleKeyClick(key)}
                className="p-4 text-2xl font-semibold bg-background-dark rounded-full aspect-square flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PinLockScreen;
