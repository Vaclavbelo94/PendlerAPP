
// Basic types for language learning components
export interface DailyProgressStat {
  date: string;
  wordsReviewed: number;
  correctCount: number;
  incorrectCount: number;
}

export interface UserProgress {
  dailyStats: DailyProgressStat[];
  totalReviewed: number;
  streakDays: number;
  lastStudyDate?: string;
  averageAccuracy: number;
  categoryDistribution: Record<string, number>;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
    unspecified: number;
  };
}

export interface VocabularyStatistics {
  totalWords: number;
  newWords: number;
  learningWords: number;
  masteredWords: number;
  correctRate: number;
  dueToday: number;
  completedToday: number;
  dailyGoal: number;
  categoryDistribution: Record<string, number>;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
    unspecified: number;
  };
  progress: {
    today: number;
    yesterday: number;
    lastWeek: number;
  };
  accuracy: number;
  dailyGoalCompletion: number;
  averageTimeToMastery?: number;
  learningEfficiency?: number;
  difficultWords?: any[];
  mostMistakenWords?: any[];
  fastestLearned?: any[];
  recentActivity?: any[];
}

// Basic vocabulary item for components that still need it
export interface BasicVocabularyItem {
  id: string;
  word: string;
  translation: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReviewDate?: string;
  repetitionLevel: number;
  correctCount: number;
  incorrectCount: number;
}

// Gamification types
export interface Achievement {
  id: string;
  name: string;
  unlocked: boolean;
  date: string | null;
}

export interface GamificationData {
  xp: number;
  level: number;
  streak: number;
  dailyGoalCompleted: boolean;
  lastActivity: string | null;
  achievements: Achievement[];
}

// Offline status types
export interface OfflineStatus {
  grammarSaved: boolean;
  vocabularySaved: boolean;
  phrasesSaved: boolean;
}

// Smart pack recommendation types
export interface SmartPackRecommendation {
  id: string;
  packId: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  estimatedValue: number;
  basedOn: 'ai' | 'usage' | 'progress' | 'preferences';
}

// Test result types
export interface TestItem {
  item: BasicVocabularyItem;
  userAnswer: string;
  wasCorrect: boolean;
}

export interface TestResult {
  id?: string;
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  testItems: TestItem[];
}
