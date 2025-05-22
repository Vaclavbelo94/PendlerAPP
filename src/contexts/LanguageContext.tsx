
import { createContext } from 'react';
import { GamificationData, OfflineStatus } from '@/types/language';

export interface LanguageContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  offlineStatus: OfflineStatus;
  saveForOffline: (type: 'grammar' | 'vocabulary' | 'phrases') => void;
  gamificationData: GamificationData;
  addXp: (amount: number) => void;
  completeDailyGoal: () => void;
  unlockAchievement: (achievementId: string) => void;
}

// Create context with empty default values
export const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);
