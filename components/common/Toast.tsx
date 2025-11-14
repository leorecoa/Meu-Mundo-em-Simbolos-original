import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface ToastProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Permite a animação de fade-out antes de chamar o onClose
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all duration-300";
  const typeClasses = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
  };
  const visibilityClass = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";
  const iconName = type === 'success' ? 'checkCircle' : 'close';

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClass}`} role="alert">
      <Icon name={iconName} size={20} />
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};

export default Toast;