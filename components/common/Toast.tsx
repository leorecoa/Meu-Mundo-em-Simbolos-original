import React, { useEffect, useState } from 'react';
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
import Icon from './Icon';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Delay closing to allow for fade-out animation
        setTimeout(onClose, 500);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="flex items-center gap-3 bg-secondary-dark text-white font-semibold px-4 py-2 rounded-full shadow-lg">
        <Icon name="checkSquare" size={20} />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
