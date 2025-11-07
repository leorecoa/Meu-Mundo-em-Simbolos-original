import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 animate-fadeIn">
      <div className="text-white text-center p-4">
        <svg
          width="180"
          height="180"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Animação de um balão de fala sendo montado com peças de quebra-cabeça"
        >
          <defs>
            <linearGradient id="puzzle-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="20%" stopColor="#ef4444" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="60%" stopColor="#4ade80" />
              <stop offset="80%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
             <style>
              {`
                .puzzle-piece {
                  opacity: 0;
                  animation-name: assemble;
                  animation-duration: 0.6s;
                  animation-timing-function: ease-out;
                  animation-fill-mode: forwards;
                }
                .speech-bubble {
                  animation-name: pulseGlow;
                   animation-duration: 2.5s;
                   animation-timing-function: ease-in-out;
                   animation-iteration-count: infinite;
                   animation-delay: 1.2s;
                }
              `}
            </style>
          </defs>

          {/* Peças do Quebra-Cabeça formando um balão de fala */}
          <g className="speech-bubble" fill="url(#puzzle-gradient)">
            {/* Peça 1 (Topo Esquerda) */}
            <path className="puzzle-piece" style={{ animationDelay: '0.2s' }} d="M60,20 C40,20 20,40 20,60 v15 c-10,0 -10,15 0,15 h15 c0,10 15,10 15,0 v-15 c0-10 -15,-10 -15,-15 h15 c10,0 10-15 0-15 z" />
            {/* Peça 2 (Topo Direita) */}
            <path className="puzzle-piece" style={{ animationDelay: '0.4s' }} d="M140,20 c20,0 40,20 40,40 v30 c10,0 10,15 0,15 h-30 c0,-10 -15,-10 -15,0 v-30 c0,-10 15,-10 15,-15 h-30 c-10,0 -10,-15 0,-15 z" />
            {/* Peça 3 (Meio Esquerda) */}
            <path className="puzzle-piece" style={{ animationDelay: '0.6s' }} d="M20,105 v35 c0,20 20,40 40,40 h15 c10,0 10-15 0-15 v-15 c0,-10 -15,-10 -15,0 h-15 c-10,0 -10,-15 0,-15 z" />
            {/* Peça 4 (Meio Direita) */}
            <path className="puzzle-piece" style={{ animationDelay: '0.8s' }} d="M105,105 v30 c0,10 15,10 15,0 h30 c10,0 10,15 0,15 v15 c0,10 -15,10 -15,0 h-30 c-20,0 -40-20 -40-40 z" />
            {/* Cauda do balão */}
             <path className="puzzle-piece" style={{ animationDelay: '1s' }} d="M60,180 l10,-15 c10,-15 25,-10 25,5 v10 z" />
          </g>
        </svg>
        <h1
          className="text-3xl font-bold tracking-wider mt-6 opacity-0"
          style={{ 
            animation: 'fadeIn 0.5s ease-in-out 1.5s forwards, subtlePulse 2.5s ease-in-out 2.0s infinite'
          }}
        >
          Meu Mundo em Símbolos
        </h1>
        <p className="mt-2 max-w-md mx-auto text-base text-subtle opacity-0 animate-fadeIn" style={{ animationDelay: '1.8s' }}>
          Tecnologia inclusiva para que todas as vozes sejam compreendidas
        </p>
        <p className="mt-8 text-lg text-subtle opacity-0 animate-fadeIn" style={{ animationDelay: '2.2s'}}>Carregando seu mundo...</p>
      </div>
    </div>
  );
};

export default SplashScreen;