import React from 'react';
import Icon from './common/Icon';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSpeak: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canClear: boolean;
  isSpeaking: boolean;
  canSpeak: boolean;
}

const ToolbarButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode; label: string; className?: string }> = ({ onClick, disabled, children, label, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={`p-3 bg-surface-light dark:bg-surface-dark rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110 ${className}`}
  >
    {children}
  </button>
);

const Toolbar: React.FC<ToolbarProps> = ({
  onUndo, onRedo, onSpeak, onClear,
  canUndo, canRedo, canClear, isSpeaking, canSpeak
}) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-4 p-2">
      <ToolbarButton onClick={onUndo} disabled={!canUndo} label="Desfazer">
        <Icon name="undo" size={24} className="text-subtle" />
      </ToolbarButton>
      <ToolbarButton onClick={onRedo} disabled={!canRedo} label="Refazer">
        <Icon name="redo" size={24} className="text-subtle" />
      </ToolbarButton>
      <ToolbarButton onClick={onClear} disabled={!canClear} label="Limpar Tudo">
        <Icon name="trash" className="text-red-500" size={28} />
      </ToolbarButton>
      <ToolbarButton onClick={onSpeak} disabled={!canSpeak} label={isSpeaking ? "Parar" : "Falar"} className="bg-gradient-to-br from-primary to-brand text-white w-16 h-16">
        <Icon name={isSpeaking ? "stopSpeak" : "speak"} size={32} />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;