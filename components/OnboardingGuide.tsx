import React, { useState } from 'react';
import Icon from './common/Icon';
import { icons } from './common/Icon';

interface OnboardingGuideProps {
  onClose: () => void;
}

const steps = [
  {
    icon: 'smile',
    title: 'Boas-vindas ao Meu Mundo em Símbolos!',
    content: 'Este é um tour rápido para mostrar como você pode começar a se comunicar. Vamos lá?',
  },
  {
    icon: 'palette',
    title: '1. Explore e Escolha Símbolos',
    content: 'Abaixo, você encontrará um teclado cheio de símbolos organizados por categorias. Toque em qualquer símbolo para adicioná-lo à sua frase.',
  },
  {
    icon: 'messageSquare',
    title: '2. Construa Sua Frase',
    content: 'Os símbolos que você escolher aparecerão na área "Construtor de Frases". Você pode ver sua frase se formando tanto com imagens quanto com texto.',
  },
  {
    icon: 'speak',
    title: '3. Dê Voz à Sua Frase',
    content: 'Quando sua frase estiver pronta, pressione o grande botão de "Falar" para que o aplicativo a leia em voz alta.',
  },
  {
    icon: 'bookmark',
    title: '4. Salve Frases Favoritas',
    content: 'Usa frases com frequência? Clique no botão "Salvar" para guardá-las na aba "Frases" e usá-las rapidamente mais tarde.',
  },
  {
    icon: 'upload',
    title: '5. Crie Seus Próprios Símbolos',
    content: 'Vá para a aba "Personalizados" para adicionar suas próprias fotos e imagens, criando um vocabulário que é único para você.',
  },
  {
    icon: 'settings',
    title: 'Tudo Pronto!',
    content: 'Lembre-se de usar o ícone de Configurações no topo para fazer backup dos seus dados. Explore, crie e se comunique!',
  },
];

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-surface-dark rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-6">
          <Icon name={step.icon as keyof typeof icons} size={48} className="mx-auto text-brand-light mb-4" />
          <h2 className="text-2xl font-bold text-text-light">{step.title}</h2>
          <p className="text-subtle mt-2">{step.content}</p>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={handlePrev}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-opacity ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-subtle hover:bg-gray-700'}`}
          >
            Anterior
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${currentStep === index ? 'bg-primary' : 'bg-gray-600'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext} 
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark font-semibold"
          >
            {isLastStep ? 'Começar!' : 'Próximo'}
          </button>
        </div>

        <button onClick={onClose} className="text-subtle text-xs mx-auto block mt-6 hover:text-white">Pular tour</button>
      </div>
    </div>
  );
};

export default OnboardingGuide;