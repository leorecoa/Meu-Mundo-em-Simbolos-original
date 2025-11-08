
import { SymbolData, VoiceSettings } from '../types';

export class VoiceService {
  private static instance: VoiceService;
  private utterance: SpeechSynthesisUtterance | null = null;

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public isSpeaking(): boolean {
    return window.speechSynthesis.speaking;
  }

  speak(
    sentenceSymbols: SymbolData[],
    onBoundary: (symbolIndex: number) => void,
    settings?: VoiceSettings
  ): Promise<void> {
    if (this.isSpeaking()) {
      this.stop();
    }
    
    const sentenceText = sentenceSymbols.map(s => s.speechText || s.name).join(' ');

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.error('Text-to-Speech not supported in this browser.');
        return reject('TTS not supported');
      }

      this.utterance = new SpeechSynthesisUtterance(sentenceText);
      this.utterance.lang = 'pt-BR';
      this.utterance.pitch = settings?.pitch ?? 1.0;
      this.utterance.rate = settings?.rate ?? 0.9;
      this.utterance.volume = 1.0;
      
      this.utterance.onend = () => {
        onBoundary(-1); // Reset highlight
        this.utterance = null;
        resolve();
      };

      this.utterance.onerror = (event) => {
        onBoundary(-1); // Reset highlight
        console.error('SpeechSynthesisUtterance.onerror', event);
        this.utterance = null;
        reject(event.error);
      };

      // Create a map of character indices to symbol indices for boundary events
      let textCursor = 0;
      const symbolBoundaries: number[] = [];
      sentenceSymbols.forEach(symbol => {
          symbolBoundaries.push(textCursor);
          const text = symbol.speechText || symbol.name;
          textCursor += text.length + 1; // +1 for space
      });

      this.utterance.onboundary = (event) => {
          if (event.name === 'word') {
             const spokenSymbolIndex = symbolBoundaries.findIndex((boundary, i) => {
                 const nextBoundary = symbolBoundaries[i+1] || sentenceText.length;
                 return event.charIndex >= boundary && event.charIndex < nextBoundary;
             });
             if(spokenSymbolIndex !== -1) {
                onBoundary(spokenSymbolIndex);
             }
          }
      };
      
      window.speechSynthesis.speak(this.utterance);
    });
  }

  speakText(
    text: string,
    onBoundary: (wordIndex: number) => void,
    onEnd: () => void,
    settings?: VoiceSettings
  ): Promise<void> {
    if (this.isSpeaking()) {
      this.stop();
    }
    
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.error('Text-to-Speech not supported in this browser.');
        return reject('TTS not supported');
      }

      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.lang = 'pt-BR';
      this.utterance.pitch = settings?.pitch ?? 1.0;
      this.utterance.rate = settings?.rate ?? 0.9;
      this.utterance.volume = 1.0;
      
      this.utterance.onend = () => {
        onBoundary(-1); // Reset highlight
        onEnd();
        this.utterance = null;
        resolve();
      };

      this.utterance.onerror = (event) => {
        onBoundary(-1); // Reset highlight
        onEnd();
        console.error('SpeechSynthesisUtterance.onerror', event);
        this.utterance = null;
        reject(event.error);
      };
      
      const wordBoundaries: { start: number, end: number }[] = [];
      // Regex to find non-whitespace sequences (words)
      const wordRegex = /\S+/g;
      let match;
      while ((match = wordRegex.exec(text)) !== null) {
          wordBoundaries.push({ start: match.index, end: match.index + match[0].length });
      }

      this.utterance.onboundary = (event) => {
          if (event.name === 'word') {
             const spokenWordIndex = wordBoundaries.findIndex(boundary => 
                 event.charIndex >= boundary.start && event.charIndex < boundary.end
             );
             if(spokenWordIndex !== -1) {
                onBoundary(spokenWordIndex);
             }
          }
      };

      window.speechSynthesis.speak(this.utterance);
    });
  }

  stop(): void {
    if (this.isSpeaking()) {
      window.speechSynthesis.cancel();
      this.utterance = null;
    }
  }
}