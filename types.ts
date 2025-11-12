export interface SymbolData {
  id: string;
  name: string;
  emoji: string;
  category: string;
  speechText?: string;
  imageUrl?: string; // For custom symbols from file upload
  isCustom?: boolean;
}

export type Sentence = SymbolData[];

export type History = {
  past: Sentence[];
  future: Sentence[];
};

export type Theme = 'light' | 'dark';
export type FontSize = 'sm' | 'md' | 'lg';

// Types for potential future refactoring with nested categories
export interface Symbol {
  id: string;
  name: string;
  icon: string;
  category: string;
  speechText?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Name of the Lucide icon
  symbols: Symbol[];
}

// Therapist Module Types
export interface Session {
  id: string;
  date: string; // ISO string
  duration: number; // in minutes
  notes: string;
}

export interface Goal {
  id: string;
  text: string;
  isCompleted: boolean;
  dateAdded: string; // ISO string
  dateCompleted?: string; // ISO string
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume?: number; // Adicionado para consistência
  voice?: any; // Adicionado para consistência
}

export interface AppearanceSettings {
  theme: Theme;
  fontSize: FontSize;
}

// Data structure for backup files
export interface BackupData {
  customSymbols: SymbolData[];
  savedPhrases: Sentence[];
  therapistGoals: Goal[];
  therapistSessions: Session[];
}