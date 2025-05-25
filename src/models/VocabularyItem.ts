
// Typový model pro položku slovní zásoby

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  example?: string;
  notes?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  
  // Údaje pro spaced repetition algoritmus
  repetitionLevel: number;
  nextReviewDate?: string;
  lastReviewed?: string;
  correctCount: number;
  incorrectCount: number;
}

// Model pro výsledky testu
export interface TestResult {
  id?: string;
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpentSeconds: number;
  categories?: string[];
  difficulties?: string[];
  testItems?: TestItem[]; // Add reference to TestItem
  skillsData?: SkillsData; // Add reference to SkillsData
}

// Model pro statistiku jednotlivých testových položek
export interface TestItem {
  item: VocabularyItem;
  wasCorrect: boolean;
  userAnswer?: string;
  responseTimeMs?: number;
}

// Model pro sledování dovedností v jazyce
export interface SkillsData {
  reading: number;
  writing: number;
  speaking: number;
  listening: number;
  grammar: number;
}

// Model pro denní statistiky pokroku
export interface DailyProgressStat {
  date: string;
  wordsReviewed: number;
  correctCount: number;
  incorrectCount: number;
}

// Model pro sledování pokroku uživatele
export interface UserProgress {
  dailyStats: DailyProgressStat[];
  totalReviewed: number;
  streakDays: number;
  lastStudyDate?: string;
  averageAccuracy: number;
  categoryDistribution?: Record<string, number>;
  difficultyDistribution?: {
    easy: number;
    medium: number;
    hard: number;
    unspecified: number;
  };
}

// Model pro statistiky slovní zásoby
export interface VocabularyStatistics {
  totalWords: number;
  newWords: number;
  learningWords: number;
  masteredWords: number;
  dueToday: number;
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
  completedToday?: number;
  dailyGoal?: number;
  correctRate?: number;
  // Additional properties needed by components
  learningEfficiency: number;
  averageTimeToMastery: number;
  recentActivity: Array<{
    date: string;
    reviewedWords: number;
    correctCount: number;
  }>;
  difficultWords: VocabularyItem[];
  fastestLearned: VocabularyItem[];
  mostMistakenWords: VocabularyItem[];
}
