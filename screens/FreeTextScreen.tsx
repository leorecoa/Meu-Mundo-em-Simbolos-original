

import React, { useState, useCallback } from 'react';
import { VoiceService } from '../services/voiceService';
import Icon from '../components/common/Icon';
import { VoiceSettings } from '../types';

interface FreeTextScreenProps {
    voiceSettings: VoiceSettings;
}

const FreeTextScreen: React.FC<FreeTextScreenProps> = ({ voiceSettings }) => {
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingWordIndex, setSpeakingWordIndex] = useState(-1);
    const voiceService = VoiceService.getInstance();

    const handleSpeak = useCallback(() => {
        if (isSpeaking) {
            voiceService.stop();
            setIsSpeaking(false);
            setSpeakingWordIndex(-1);
        } else if (text.trim().length > 0) {
            setIsSpeaking(true);
            voiceService.speakText(
                text, 
                (index) => setSpeakingWordIndex(index),
                () => setIsSpeaking(false),
                voiceSettings
            ).catch(err => {
                console.error("Speech error:", err);
                setIsSpeaking(false);
                setSpeakingWordIndex(-1);
            });
        }
    }, [text, isSpeaking, voiceService, voiceSettings]);

    const handleClear = () => {
        setText('');
        setSpeakingWordIndex(-1);
        if (isSpeaking) {
            voiceService.stop();
            setIsSpeaking(false);
        }
    };

    const renderHighlightedText = () => {
        const segments = text.split(/(\s+)/);
        let wordIndex = 0;
        return segments.map((segment, i) => {
            if (segment.trim().length === 0) {
                return <span key={i}>{segment}</span>;
            } else {
                const isHighlighted = wordIndex === speakingWordIndex;
                const currentIndex = wordIndex;
                wordIndex++;
                return (
                    <span key={i} className={`transition-colors duration-150 ${isHighlighted ? 'bg-primary-dark/70 text-white rounded' : ''}`}>
                        {segment}
                    </span>
                );
            }
        });
    };

    const commonTextAreaStyles = "w-full h-full p-4 text-base sm:text-lg bg-background-dark border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none";

    return (
        <div className="flex flex-col h-full p-4 gap-4 font-sans">
            <div className="bg-surface-dark/50 p-4 sm:p-6 rounded-2xl shadow-lg animate-fadeIn flex flex-col gap-4 h-full">
                <h2 className="text-lg sm:text-xl font-semibold text-text-dark">Escrita Livre</h2>
                <p className="text-subtle">Digite sua mensagem abaixo e clique em "Falar" para ouvi-la.</p>
                <div className="flex-grow w-full relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Comece a digitar aqui..."
                        className={`${commonTextAreaStyles} ${isSpeaking ? 'text-transparent caret-transparent selection:bg-transparent' : ''}`}
                        aria-label="Caixa de texto para escrita livre"
                        readOnly={isSpeaking}
                    />
                    {isSpeaking && (
                        <div 
                            className={`${commonTextAreaStyles} absolute inset-0 overflow-y-auto pointer-events-none whitespace-pre-wrap`}
                            aria-hidden="true"
                        >
                            {renderHighlightedText()}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center flex-wrap gap-4 p-2">
                    <button
                        onClick={handleClear}
                        disabled={text.length === 0}
                        aria-label="Limpar Texto"
                        className="p-3 bg-surface-dark rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110"
                    >
                        <Icon name="trash" className="text-red-500 w-7 h-7" />
                    </button>
                    <button
                        onClick={handleSpeak}
                        disabled={text.trim().length === 0}
                        aria-label={isSpeaking ? "Parar" : "Falar"}
                        className="bg-gradient-to-br from-primary to-brand text-white w-14 h-14 sm:w-16 sm:h-16 p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110"
                    >
                        <Icon name={isSpeaking ? "stopSpeak" : "speak"} className="w-7 h-7 sm:w-8 sm:h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FreeTextScreen;