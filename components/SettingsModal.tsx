import React from 'react';
import { VoiceSettings } from '../hooks/useVoiceSettings';
import Icon from './common/Icon';

// Mock da interface AppearanceSettings, já que o hook não foi fornecido
interface AppearanceSettings {
    theme: 'dark' | 'light';
    fontSize: number;
}
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    voiceSettings: VoiceSettings;
    onVoiceSettingsChange: (settings: VoiceSettings) => void;
    appearanceSettings: AppearanceSettings;
    onAppearanceSettingsChange: (settings: AppearanceSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    voiceSettings,
    onVoiceSettingsChange,
    appearanceSettings,
    onAppearanceSettingsChange,
}) => {
    if (!isOpen) {
        return null;
    }

    // Mock de dados para exibição, já que os hooks não estão aqui
    const voices = typeof window !== 'undefined' ? window.speechSynthesis.getVoices() : [];
    const speak = (text: string) => window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));

    const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedVoice = voices.find(v => v.name === event.target.value) || null;
        onVoiceSettingsChange({ ...voiceSettings, voice: selectedVoice });
    };

    const handleSettingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        onVoiceSettingsChange({ ...voiceSettings, [name]: parseFloat(value) });
    };

    const handleTestVoice = () => {
        speak("Olá, este é um teste de voz.");
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Configurações de Voz</h2>

                <div style={styles.formGroup}>
                    <label htmlFor="voice-select">Voz:</label>
                    <select
                        id="voice-select"
                        value={voiceSettings.voice?.name || ''}
                        onChange={handleVoiceChange}
                        style={styles.select}
                    >
                        {voices.map(voice => (
                            <option key={voice.name} value={voice.name}>
                                {`${voice.name} (${voice.lang})`}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="rate">Velocidade: {voiceSettings.rate.toFixed(1)}</label>
                    <input type="range" id="rate" name="rate" min="0.5" max="2" step="0.1" value={voiceSettings.rate} onChange={handleSettingChange} />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="pitch">Tom: {voiceSettings.pitch.toFixed(1)}</label>
                    <input type="range" id="pitch" name="pitch" min="0" max="2" step="0.1" value={voiceSettings.pitch} onChange={handleSettingChange} />
                </div>

                <div style={styles.buttonGroup}>
                    <button onClick={handleTestVoice} style={styles.button}>Testar Voz</button>
                    <button onClick={onClose} style={{ ...styles.button, ...styles.closeButton }}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

// Estilos básicos para o modal
const styles: { [key: string]: React.CSSProperties } = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px', maxWidth: '500px', color: '#333' },
    formGroup: { marginBottom: '15px' },
    select: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    buttonGroup: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
    button: { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    closeButton: { backgroundColor: '#f44336', color: 'white' }
};

export default SettingsModal;