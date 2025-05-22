
// Types for the language learning functionality

export interface OfflineStatus {
  grammarSaved: boolean;
  vocabularySaved: boolean;
  phrasesSaved: boolean;
}

export interface GamificationData {
  xp: number;
  level: number;
  streak: number;
  dailyGoalCompleted: boolean;
  lastActivity: string | null;
  achievements: {
    id: string;
    name: string;
    unlocked: boolean;
    date: string | null;
  }[];
}

export interface Achievement {
  id: string;
  name: string;
  unlocked: boolean;
  date: string | null;
}
