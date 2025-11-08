import React from 'react';
import Icon from '../common/Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">{title}</h2>
          <button onClick={onClose} className="text-subtle hover:text-text-light dark:hover:text-text-dark">
            <Icon name="close" size={24} />
          </button>
        </div>
        <p className="text-subtle-light dark:text-subtle-dark mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-subtle hover:bg-gray-100 dark:hover:bg-gray-700">
            Cancelar
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
