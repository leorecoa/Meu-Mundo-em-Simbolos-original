import React, { useContext } from 'react';
import Icon, { icons } from './common/Icon';
import { ScreenView } from '../App';
import { ProfileContext } from '../contexts/ProfileContext';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
    activeScreen: ScreenView;
    onScreenChange: (screen: ScreenView) => void;
    onLogout: () => void;
}

const NavButton: React.FC<{
    label: string;
    iconName: keyof typeof icons;
    isActive: boolean;
    onClick: () => void;
    href: string;
}> = ({ label, iconName, isActive, onClick, href }) => {
    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive
                    ? 'bg-gradient-to-r from-primary to-brand text-white shadow-lg'
                    : 'text-subtle hover:bg-gray-700/50'
            }`}
        >
            <Icon name={iconName} size={20} />
            <span className="hidden sm:inline">{label}</span>
        </a>
    );
};

const Header: React.FC<HeaderProps> = ({ activeScreen, onScreenChange, onLogout }) => {
    const { activeProfile } = useContext(ProfileContext);

    return (
        <header className="w-full p-2 sm:p-3 bg-surface-dark/50 backdrop-blur-lg shadow-lg flex justify-between items-center flex-shrink-0 z-10 border-b border-white/10 gap-2">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-background-dark/60">
                    <User className="text-brand-light" size={20}/>
                    <span className="text-sm font-semibold text-text-light truncate hidden md:inline">{activeProfile?.name}</span>
                </div>
                <h1 className="text-base sm:text-xl font-bold text-text-light flex-shrink truncate hidden sm:block">Meu Mundo em Símbolos</h1>
            </div>
            <nav className="flex items-center gap-1 p-1 bg-background-dark/60 rounded-xl flex-shrink-0">
                <NavButton
                    label="Símbolos"
                    iconName="messageSquare"
                    isActive={activeScreen === 'symbols'}
                    onClick={() => onScreenChange('symbols')}
                    href="#/"
                />
                <NavButton
                    label="Texto"
                    iconName="type"
                    isActive={activeScreen === 'text'}
                    onClick={() => onScreenChange('text')}
                    href="#/text"
                />
                <NavButton
                    label="Acompanhante"
                    iconName="clipboardList"
                    isActive={activeScreen === 'therapist'}
                    onClick={() => onScreenChange('therapist')}
                    href="#/therapist"
                />
            </nav>
            <button onClick={onLogout} title="Trocar de Perfil" className="p-3 bg-surface-dark rounded-full shadow-lg hover:bg-gray-700 transition-all text-subtle hover:text-white">
                <LogOut size={20} />
            </button>
        </header>
    );
};

export default Header;