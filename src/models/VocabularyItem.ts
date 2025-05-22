
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
}

// Model pro sledování pokroku uživatele
export interface UserProgress {
  dailyStats: Array<{
    date: string;
    reviewedCount: number;
    correctCount: number;
  }>;
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
}
