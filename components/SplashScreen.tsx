import React, { useState } from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartClick = () => {
    setIsLoading(true);
    // Simula um carregamento e depois chama a função para iniciar o app principal
    setTimeout(() => {
      onStart();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gradient-to-br from-[#6a11cb] to-[#2575fc] p-5 font-[Segoe UI,sans-serif]">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-center animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white py-10 px-8 text-center">
          <h1 className="text-3xl font-bold leading-tight">
            Meu Mundo<br />em símbolos
          </h1>
          <div className="flex justify-center gap-4 my-6">
            <div className="w-3 h-3 rounded-full bg-white/50"></div>
            <div className="w-3 h-3 rounded-full bg-white/70"></div>
            <div className="w-3 h-3 rounded-full bg-white/90"></div>
          </div>
          <div className="text-base opacity-90 mt-1">Uma jornada visual</div>
        </div>
        {/* Content */}
        <div className="py-10 px-8">
          <div className="text-2xl text-gray-800 mb-10 leading-relaxed">
            Olá!<br />
            Bem-vindo(a)
          </div>
          <button
            onClick={handleStartClick}
            disabled={isLoading}
            className="bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white font-semibold tracking-wider py-4 px-10 rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_15px_rgba(74,0,224,0.3)] hover:-translate-y-1 hover:shadow-[0_7px_20px_rgba(74,0,224,0.4)] active:translate-y-px disabled:opacity-70 disabled:cursor-wait"
          >
            {isLoading ? 'Carregando...' : 'Começar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;