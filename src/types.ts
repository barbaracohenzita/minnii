export type View = 'map' | 'location' | 'settings';
export type Language = 'French' | 'Spanish' | 'Italian' | 'Portuguese' | 'German';

export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  persona: string;
}

export interface Location {
  id: string;
  district: string;
  name: string;
  description: string;
  ambient: string;
  icon: string;
  color: string;
  npc: NPC;
  initialMessage: string;
  hint: string;
}

export interface Message {
  id: string;
  senderId: string; // 'user' or npc.id
  text: string;
  timestamp: Date;
  reaction?: string;
}

export interface SavedWord {
  id: string;
  word: string;
  translation: string;
  language: Language;
}

export interface AppState {
  view: View;
  targetLanguage: Language;
  currentLocationId: string | null;
  chats: Record<string, Record<string, Message[]>>; // language -> locationId -> messages
  completedLocations: Record<string, string[]>; // language -> locationId[]
  savedWords: SavedWord[];
  hasSeenWelcome: boolean;
  isWordsModalOpen: boolean;
  streak: number;
  lastSessionDate: string | null;
}
