import React, { useState } from 'react';
import Icon from './common/Icon';

const FeedbackButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('Feedback sobre o App "Meu Mundo em Símbolos"');
  const [message, setMessage] = useState('');

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = 'leorecoa2@gmail.com';
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    globalThis.location.href = mailtoLink;
    setIsOpen(false); // Fecha o modal após tentar enviar
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="no-print fixed bottom-5 right-5 bg-gradient-to-r from-primary to-brand text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40"
        aria-label="Enviar Feedback"
      >
        <Icon name="mail" size={24} />
      </button>

      {/* Modal de Feedback */}
      {isOpen && (
        <div className="no-print fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fadeIn">
          <div className="bg-background-light w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSendFeedback} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-light">Enviar Feedback</h2>
                <button type="button" onClick={() => setIsOpen(false)} className="text-subtle hover:text-text-light">
                  <Icon name="close" size={24} />
                </button>
              </div>
              <p className="text-subtle mb-6">
                Sua opinião é muito importante! Ao clicar em "Enviar", seu aplicativo de e-mail será aberto.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Assunto"
                  className="w-full p-3 bg-surface-light border border-surface-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  className="w-full p-3 bg-surface-light border border-surface-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none h-32"
                  required
                />
              </div>
              <button type="submit" className="mt-6 w-full bg-gradient-to-r from-primary to-brand text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                Enviar por E-mail
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;