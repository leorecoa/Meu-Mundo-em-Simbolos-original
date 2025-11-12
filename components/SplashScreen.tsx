import React, { useState } from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartClick = () => {
    setIsLoading(true);
    // Simula um carregamento e depois inicia o app
    setTimeout(() => {
      onStart();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gradient-to-br from-purple-800 via-purple-700 to-blue-600 p-5">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-center animate-fadeIn">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-10 px-5">
          <h1 className="text-3xl font-bold leading-tight">
            Meu Mundo<br />em símbolos
          </h1>
          <div className="flex justify-center gap-4 my-4">
            <div className="w-3 h-3 rounded-full bg-white/50"></div>
            <div className="w-3 h-3 rounded-full bg-white/70"></div>
            <div className="w-3 h-3 rounded-full bg-white/90"></div>
          </div>
          <div className="text-base opacity-90">Uma jornada visual</div>
        </div>
        <div className="py-12 px-8">
          <div className="text-2xl text-gray-700 mb-10 leading-relaxed">
            Olá!<br />
            Bem-vindo(a)
          </div>
          <button
            onClick={handleStartClick}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold py-4 px-10 rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
          >
            {isLoading ? 'Carregando...' : 'Começar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;